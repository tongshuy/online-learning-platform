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

async function readResourceIndex(event) {
  if (resourceIndexCache) return resourceIndexCache;

  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "resourceIndex.json"), "utf8");
    resourceIndexCache = JSON.parse(raw);
    return resourceIndexCache;
  } catch {
    const host = event.headers.host || event.headers["x-forwarded-host"];
    if (!host) {
      resourceIndexCache = {};
      return resourceIndexCache;
    }

    try {
      const response = await fetch(`https://${host}/data/resourceIndex.json`);
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
  agentPrompts,
  callDeepSeek,
  json,
  methodGuard,
  parsePayload,
  readResourceIndex,
};
