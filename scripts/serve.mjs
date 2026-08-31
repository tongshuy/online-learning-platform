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
