const { callDeepSeek, json, methodGuard, parsePayload, readResourceIndex } = require("./lib/deepseek-common");

exports.handler = async (event) => {
  const guarded = methodGuard(event);
  if (guarded) return guarded;

  let payload;
  try {
    payload = parsePayload(event);
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  const index = await readResourceIndex(event);
  const resource = index[payload.sectionId];
  const sectionTitle = payload.sectionTitle || payload.sectionId || "当前章节";
  const resourceText = (resource && resource.text ? resource.text : "").slice(0, 28000);
  const resourceFiles =
    resource && resource.files
      ? resource.files.map((item) => item.label || item.file).join("、")
      : resource && resource.file
        ? resource.file
        : "暂无资源文件";
  const system = `你是课程章节知识问答 AI。你只能基于当前章节主题与提供的课程资源内容回答知识点问题，不要扮演匹配AI学伴，也不要提供任务规划、情绪支持或讨论陪练。

如果资料中没有足够依据，请明确说“当前章节资源中没有直接依据”，再给出可以继续查阅的方向。回答要面向学生，清晰、简洁、分点，必要时引用“第几页”的线索。

当前章节：${sectionTitle}
当前资源文件：${resourceFiles}
课程资源摘录：
${resourceText || "该章节暂未上传资源。"}
`;

  return callDeepSeek(
    [
      { role: "system", content: system },
      { role: "user", content: payload.message || "" },
    ],
    0.25,
  );
};
