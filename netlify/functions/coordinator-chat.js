const {
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
} = require("./lib/deepseek-common");

exports.handler = async (event) => {
  const guarded = methodGuard(event);
  if (guarded) return guarded;

  let payload;
  try {
    payload = parsePayload(event);
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  const fallback = heuristicCoordinatorDecision(payload);
  const coordinatorInput = {
    learnerProfile: payload.learningContext && payload.learningContext.profile,
    matchedAgent: payload.learningContext && payload.learningContext.matchedAgent,
    currentSection: payload.learningContext && payload.learningContext.currentSection,
    activeTool: payload.learningContext && payload.learningContext.activeTool,
    currentTask: payload.learningContext && payload.learningContext.currentTask,
    telemetry: payload.learningContext && payload.learningContext.telemetry,
    recentMessages: (payload.messages || []).slice(-8),
  };
  const coordinatorResult = await callDeepSeek(
    [
      { role: "system", content: coordinatorPrompt },
      { role: "user", content: JSON.stringify(coordinatorInput, null, 2) },
    ],
    0.1,
  );

  if (coordinatorResult.statusCode >= 400 && !extractAssistantContent(coordinatorResult)) {
    return coordinatorResult;
  }

  const decision = normalizeCoordinatorDecision(
    parseJsonObject(extractAssistantContent(coordinatorResult)) || fallback,
    fallback.selectedAgent,
  );
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

  if (answerResult.statusCode >= 400 && !extractAssistantContent(answerResult)) {
    let errorBody = {};
    try {
      errorBody = answerResult.body ? JSON.parse(answerResult.body) : {};
    } catch {
      errorBody = { error: answerResult.body || "AI request failed." };
    }
    return json(answerResult.statusCode, {
      ...errorBody,
      coordinator: decision,
    });
  }

  try {
    const data = JSON.parse(answerResult.body);
    data.coordinator = decision;
    return json(answerResult.statusCode, data);
  } catch {
    return answerResult;
  }
};
