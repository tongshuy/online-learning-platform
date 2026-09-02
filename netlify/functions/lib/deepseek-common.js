const fs = require("node:fs/promises");
const path = require("node:path");

const agentPrompts = {
  concept:
    "你是“概念理解伙伴”。你的任务是帮助学习者理解抽象概念、梳理知识结构和辨析重点难点。回答时优先使用“概念解释—具体例子—易错点—简短小结”的结构。你不能直接替学习者完成作业、生成完整答案或代替学习者进行最终判断。你应通过解释、举例、提问和小测帮助学习者自己理解。回答应简洁、有层次，必要时在最后提出一个简短检查问题。",
  planner:
    "你是“任务规划伙伴”。你的任务是帮助学习者理解任务要求、拆解任务步骤、制定阶段计划并进行温和提醒。你不能替学习者完成任务内容，不能直接生成完整作业、完整报告或最终提交文本。你可以提供任务框架、步骤建议、时间安排、模板说明和检查清单，但具体内容必须由学习者自己完成。每次建议优先给出当前最应该完成的 1-3 个行动。",
  scenario:
    "你是“情境应用伙伴”。你的任务是帮助学习者将知识放入真实问题和具体情境中理解与应用。你不能直接替学习者完成完整方案、完整案例分析或最终任务成果。你可以提供案例线索、分析框架和思考问题，但具体判断、方案设计和表达需要由学习者自己完成。回答优先围绕“问题是什么—为什么出现—可以怎么解决—知识如何发挥作用”展开。",
  discussion:
    "你是“共同讨论伙伴”。你的任务是帮助学习者进行讨论准备、观点整理、表达练习和互动反思。你不能直接替学习者发布讨论内容，不能代替学习者完成小组协作，也不能主导小组决策。你可以提供表达模板、观点整理建议、追问问题和共识总结。回答应温和、鼓励、低压力。",
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

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  };
}

function parsePayload(event) {
  if (!event.body) return {};
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;
  return JSON.parse(raw);
}

async function callDeepSeek(messages, temperature = 0.55) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return json(503, {
      error: "线上服务端还没有配置 DEEPSEEK_API_KEY。",
      setup: "请在 Netlify Site configuration 的 Environment variables 中配置 DEEPSEEK_API_KEY。",
    });
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

    return {
      statusCode: upstream.status,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: await upstream.text(),
    };
  } catch (error) {
    return json(502, {
      error: "DeepSeek request failed.",
      detail: String(error.message || error),
    });
  }
}

function extractAssistantContent(result) {
  if (!result.body) return "";
  try {
    const data = JSON.parse(result.body);
    return data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content || ""
      : "";
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
  const selectedAgent = validAgents.includes(input && input.selectedAgent) ? input.selectedAgent : fallbackAgent;
  const secondaryAgent =
    validAgents.includes(input && input.secondaryAgent) && input.secondaryAgent !== selectedAgent
      ? input.secondaryAgent
      : null;
  return {
    selectedAgent,
    secondaryAgent,
    reason: String((input && input.reason) || `系统根据当前问题先交由${agentNames[selectedAgent]}支持。`).slice(0, 140),
    strategy: String((input && input.strategy) || "先理解学习者已有想法，再通过提示、追问和框架帮助其完善。").slice(0, 180),
    source: (input && input.source) || "coordinator",
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
  return normalizeCoordinatorDecision(
    {
      selectedAgent,
      secondaryAgent,
      reason: `根据当前问题关键词和学习页面状态，优先交由${agentNames[selectedAgent]}支持。`,
      strategy: "先确认学习者已有想法，再给出下一步提示或追问，避免直接替学习者完成最终答案。",
      source: "heuristic",
    },
    selectedAgent,
  );
}

async function readResourceIndex(event) {
  if (resourceIndexCache) return resourceIndexCache;

  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "rag", "resourceIndex.json"), "utf8");
    resourceIndexCache = JSON.parse(raw);
    return resourceIndexCache;
  } catch {
    const host = event.headers.host || event.headers["x-forwarded-host"];
    if (!host) {
      resourceIndexCache = {};
      return resourceIndexCache;
    }

    try {
      const response = await fetch(`https://${host}/data/rag/resourceIndex.json`);
      resourceIndexCache = response.ok ? await response.json() : {};
    } catch {
      resourceIndexCache = {};
    }
    return resourceIndexCache;
  }
}

function methodGuard(event) {
  if (event.httpMethod === "OPTIONS") return json(204, {});
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed." });
  return null;
}

module.exports = {
  agentNames,
  agentPrompts,
  callDeepSeek,
  coordinatorPrompt,
  extractAssistantContent,
  heuristicCoordinatorDecision,
  json,
  methodGuard,
  normalizeCoordinatorDecision,
  parseJsonObject,
  parsePayload,
  readResourceIndex,
};
