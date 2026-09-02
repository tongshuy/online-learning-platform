import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 5174);
const host = process.env.HOST || "127.0.0.1";

async function loadEnvLocal() {
  try {
    const raw = await fs.readFile(path.join(root, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (!process.env[key]) process.env[key] = rest.join("=").trim();
    }
  } catch {
    // Optional local file. Keep secrets out of the browser bundle.
  }
}

await loadEnvLocal();

const agentPrompts = {
  concept: `你是“概念理解伙伴”。你的任务是帮助学习者理解抽象概念、梳理知识结构和辨析重点难点。回答时优先使用“概念解释—具体例子—易错点—简短小结”的结构。你不能直接替学习者完成作业、生成完整答案或代替学习者进行最终判断。你应通过解释、举例、提问和小测帮助学习者自己理解。回答应简洁、有层次，必要时在最后提出一个简短检查问题。`,
  planner: `你是“任务规划伙伴”。你的任务是帮助学习者理解任务要求、拆解任务步骤、制定阶段计划并进行温和提醒。你不能替学习者完成任务内容，不能直接生成完整作业、完整报告或最终提交文本。你可以提供任务框架、步骤建议、时间安排、模板说明和检查清单，但具体内容必须由学习者自己完成。每次建议优先给出当前最应该完成的 1-3 个行动。`,
  scenario: `你是“情境应用伙伴”。你的任务是帮助学习者将知识放入真实问题和具体情境中理解与应用。你不能直接替学习者完成完整方案、完整案例分析或最终任务成果。你可以提供案例线索、分析框架和思考问题，但具体判断、方案设计和表达需要由学习者自己完成。回答优先围绕“问题是什么—为什么出现—可以怎么解决—知识如何发挥作用”展开。`,
  discussion: `你是“共同讨论伙伴”。你的任务是帮助学习者进行讨论准备、观点整理、表达练习和互动反思。你不能直接替学习者发布讨论内容，不能代替学习者完成小组协作，也不能主导小组决策。你可以提供表达模板、观点整理建议、追问问题和共识总结。回答应温和、鼓励、低压力。`,
};

const agentNames = {
  concept: "概念理解伙伴",
  planner: "任务规划伙伴",
  scenario: "情境应用伙伴",
  discussion: "共同讨论伙伴",
};

const coordinatorPrompt = `你是“AI学伴协调器 Coordinator Agent”。你的任务不是直接回答学习问题，而是根据学习者画像、当前页面、当前章节、当前任务、学习行为数据和用户问题，判断本轮最适合由哪一类AI学伴提供支持。

可选AI学伴只有四类：
- concept：概念理解伙伴，适合概念、定义、知识结构、易错点。
- planner：任务规划伙伴，适合任务拆解、学习进度、截止日期、下一步行动。
- scenario：情境应用伙伴，适合真实案例、角色视角、知识迁移、方案合理性追问。
- discussion：共同讨论伙伴，适合讨论发言、观点整理、回应同伴、降低表达压力。

你必须输出严格JSON，不要输出Markdown，不要解释JSON之外的内容。格式如下：
{
  "selectedAgent": "concept|planner|scenario|discussion",
  "secondaryAgent": "concept|planner|scenario|discussion|null",
  "reason": "用一句中文说明为什么这样分配",
  "strategy": "用一句中文说明主学伴应该怎样支持，强调先引导学习者思考而不是代写"
}

约束：
- selectedAgent必须是四类之一。
- secondaryAgent可以为null；只有确实需要补充视角时才选择。
- secondaryAgent不能和selectedAgent相同。
- 如果用户要求直接生成完整作业、完整方案或替他发帖，应选择最相关学伴，但strategy必须要求以追问、框架或检查清单支持，不直接代写。`;

let resourceIndexCache = null;

async function readResourceIndex() {
  if (resourceIndexCache) return resourceIndexCache;
  try {
    const raw = await fs.readFile(path.join(root, "data", "rag", "resourceIndex.json"), "utf8");
    resourceIndexCache = JSON.parse(raw);
  } catch {
    resourceIndexCache = {};
  }
  return resourceIndexCache;
}

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".pdf", "application/pdf"],
]);

function sendJson(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function callDeepSeek(messages, temperature = 0.55) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return {
      status: 503,
      body: {
        error: "本地服务端还没有配置 DEEPSEEK_API_KEY。",
        setup: "请根据 .env.example 创建 .env.local，并在重启服务后再使用 AI 交流区。",
      },
    };
  }

  try {
    const upstream = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        temperature,
        messages,
      }),
    });

    const text = await upstream.text();
    return { status: upstream.status, raw: text };
  } catch (error) {
    return { status: 502, body: { error: "DeepSeek request failed.", detail: String(error.message || error) } };
  }
}

function writeDeepSeekResult(res, result) {
  if (result.raw) {
    res.writeHead(result.status, { "content-type": "application/json; charset=utf-8" });
    res.end(result.raw);
    return;
  }
  sendJson(res, result.status, result.body);
}

function extractAssistantContent(result) {
  if (!result.raw) return "";
  try {
    const data = JSON.parse(result.raw);
    return data.choices?.[0]?.message?.content || "";
  } catch {
    return "";
  }
}

function parseJsonObject(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function normalizeCoordinatorDecision(input, fallbackAgent = "concept") {
  const validAgents = Object.keys(agentPrompts);
  const selectedAgent = validAgents.includes(input?.selectedAgent) ? input.selectedAgent : fallbackAgent;
  const secondaryAgent =
    validAgents.includes(input?.secondaryAgent) && input.secondaryAgent !== selectedAgent
      ? input.secondaryAgent
      : null;
  return {
    selectedAgent,
    secondaryAgent,
    reason: String(input?.reason || `系统根据当前问题先交由${agentNames[selectedAgent]}支持。`).slice(0, 140),
    strategy: String(input?.strategy || "先理解学习者已有想法，再通过提示、追问和框架帮助其完善。").slice(0, 180),
    source: input?.source || "coordinator",
  };
}

function heuristicCoordinatorDecision(payload) {
  const context = payload.learningContext || {};
  const lastMessage = [...(payload.messages || [])].reverse().find((item) => item.role === "user")?.content || "";
  const text = `${lastMessage}\n${context.activeTool || ""}\n${context.currentTask?.title || ""}`;
  let selectedAgent = context.matchedAgent || "concept";
  let secondaryAgent = null;
  if (/概念|定义|含义|理论|区别|是什么|知识点|框架/.test(text)) selectedAgent = "concept";
  if (/任务|计划|进度|截止|ddl|步骤|先做|还有多少|安排|提交/.test(text)) selectedAgent = "planner";
  if (/案例|情境|场景|迁移|角色|方案|原因|策略|应用|双师|MOOC|SPOC|培训/.test(text)) selectedAgent = "scenario";
  if (/讨论|发言|回复|观点|同伴|小组|表达|帖子|怎么说/.test(text)) selectedAgent = "discussion";
  if (selectedAgent === "scenario" && /概念|定义|理论|知识点/.test(text)) secondaryAgent = "concept";
  if (selectedAgent === "planner" && /讨论|发言|小组/.test(text)) secondaryAgent = "discussion";
  return normalizeCoordinatorDecision({
    selectedAgent,
    secondaryAgent,
    reason: `根据当前问题关键词和学习页面状态，优先交由${agentNames[selectedAgent]}支持。`,
    strategy: "先确认学习者已有想法，再给出下一步提示或追问，避免直接替学习者完成最终答案。",
    source: "heuristic",
  }, selectedAgent);
}

async function proxyDeepSeek(req, res) {
  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  writeDeepSeekResult(res, await callDeepSeek(payload.messages || []));
}

async function coordinatorChat(req, res) {
  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const fallback = heuristicCoordinatorDecision(payload);
  const coordinatorInput = {
    learnerProfile: payload.learningContext?.profile || null,
    matchedAgent: payload.learningContext?.matchedAgent || null,
    currentSection: payload.learningContext?.currentSection || null,
    activeTool: payload.learningContext?.activeTool || null,
    currentTask: payload.learningContext?.currentTask || null,
    telemetry: payload.learningContext?.telemetry || null,
    recentMessages: (payload.messages || []).slice(-8),
  };
  const coordinatorResult = await callDeepSeek(
    [
      { role: "system", content: coordinatorPrompt },
      { role: "user", content: JSON.stringify(coordinatorInput, null, 2) },
    ],
    0.1,
  );
  if (!coordinatorResult.raw && coordinatorResult.status >= 400) {
    writeDeepSeekResult(res, coordinatorResult);
    return;
  }

  const decision = normalizeCoordinatorDecision(
    parseJsonObject(extractAssistantContent(coordinatorResult)) || fallback,
    fallback.selectedAgent,
  );
  if (!decision.source) decision.source = parseJsonObject(extractAssistantContent(coordinatorResult)) ? "coordinator" : "heuristic";

  const secondaryNote = decision.secondaryAgent
    ? `本轮可参考辅助学伴“${agentNames[decision.secondaryAgent]}”的视角，但最终仍由你作为主学伴回答。`
    : "本轮不需要额外辅助学伴。";
  const system = `${agentPrompts[decision.selectedAgent]}

本轮由AI学伴协调器分配给你。
协调器判断理由：${decision.reason}
支持策略：${decision.strategy}
${secondaryNote}

回答要求：不要重复展示协调器JSON；用自然、温和、面向学习者的中文回答。优先基于学习者已经表达的内容进行追问、提示、框架化建议或检查清单，不要直接替学习者完成完整作业。`;

  const answerResult = await callDeepSeek(
    [
      { role: "system", content: system },
      ...(payload.messages || []),
    ],
    0.55,
  );
  if (!answerResult.raw) {
    sendJson(res, answerResult.status, { ...(answerResult.body || {}), coordinator: decision });
    return;
  }

  try {
    const data = JSON.parse(answerResult.raw);
    data.coordinator = decision;
    sendJson(res, answerResult.status, data);
  } catch {
    res.writeHead(answerResult.status, { "content-type": "application/json; charset=utf-8" });
    res.end(answerResult.raw);
  }
}

async function agentChat(req, res) {
  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const agentKey = payload.agentKey || "concept";
  const system = agentPrompts[agentKey] || agentPrompts.concept;
  const messages = [
    { role: "system", content: system },
    ...(payload.messages || []),
  ];
  writeDeepSeekResult(res, await callDeepSeek(messages));
}

async function sectionChat(req, res) {
  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const index = await readResourceIndex();
  const resource = index[payload.sectionId];
  const sectionTitle = payload.sectionTitle || payload.sectionId || "当前章节";
  const resourceText = resource?.text || "";
  const resourceFiles = resource?.files?.map((item) => item.label || item.file).join("、") || resource?.file || "暂无资源文件";
  const system = `你是课程章节知识问答 AI。你只能基于当前章节主题与提供的课程资源内容回答知识点问题，不要扮演匹配AI学伴，也不要提供任务规划、情绪支持或讨论陪练。

如果资料中没有足够依据，请明确说“当前章节资源中没有直接依据”，再给出可以继续查阅的方向。回答要面向学生，清晰、简洁、分点，必要时引用“第几页”的线索。

当前章节：${sectionTitle}
当前资源文件：${resourceFiles}
课程资源摘录：
${resourceText || "该章节暂未上传资源。"}
`;
  const userMessage = payload.message || "";
  writeDeepSeekResult(
    res,
    await callDeepSeek(
      [
        { role: "system", content: system },
        { role: "user", content: userMessage },
      ],
      0.25,
    ),
  );
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  if (url.pathname === "/api/deepseek" && req.method === "POST") {
    await proxyDeepSeek(req, res);
    return;
  }

  if (url.pathname === "/api/agent-chat" && req.method === "POST") {
    await agentChat(req, res);
    return;
  }

  if (url.pathname === "/api/coordinator-chat" && req.method === "POST") {
    await coordinatorChat(req, res);
    return;
  }

  if (url.pathname === "/api/section-chat" && req.method === "POST") {
    await sectionChat(req, res);
    return;
  }

  let filePath = decodeURIComponent(url.pathname);
  if (filePath === "/") filePath = "/index.html";
  const resolved = path.resolve(root, `.${filePath}`);
  if (!resolved.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const stat = await fs.stat(resolved);
    const finalPath = stat.isDirectory() ? path.join(resolved, "index.html") : resolved;
    const data = await fs.readFile(finalPath);
    res.writeHead(200, {
      "content-type": mimeTypes.get(path.extname(finalPath).toLowerCase()) || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Try another port, for example: PORT=5177 node scripts/serve.mjs`);
  } else if (error.code === "EPERM") {
    console.error(`The local environment blocked listening on ${host}:${port}. Try restarting from Codex with approval, or use another port.`);
  } else {
    console.error(error);
  }
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Learning design platform running at http://localhost:${port}`);
});
