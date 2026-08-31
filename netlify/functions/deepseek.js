const { callDeepSeek, json, methodGuard, parsePayload } = require("./lib/deepseek-common");

exports.handler = async (event) => {
  const guarded = methodGuard(event);
  if (guarded) return guarded;

  let payload;
  try {
    payload = parsePayload(event);
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  return callDeepSeek(payload.messages || []);
};
