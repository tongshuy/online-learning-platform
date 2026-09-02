const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

const courseCatalog = [
  { id: "1", chapter: "第一章 在线教育实践发展的脉络与创新方向", discussion: "在线教育的发展为什么不能只理解为“把课堂搬到网上”？请结合资源中的阶段变化说明。" },
  { id: "2", chapter: "第二章 在线教学模式与教学设计", discussion: "不同在线教学模式各自适合什么情境？请举一个课程设计例子说明你的选择。" },
  { id: "3", chapter: "第三章 在线自主学习与学习支持服务", discussion: "在线学习中，学习支持服务应该主动提供到什么程度？会不会影响学习者自主性？" },
  { id: "4", chapter: "第四章 在线学习资源与建设模式", discussion: "开放共享资源和共建共享资源有什么不同？你更认可哪一种建设模式？" },
  { id: "5", chapter: "第五章 在线教育的过程监控与精准管理", discussion: "学习数据用于精准管理时，可以使用哪些学习者数据？" },
  { id: "6", chapter: "第六章 在线教育服务供给模式", discussion: "时空灵活的教育服务供给模式最适合解决哪些传统教育问题？" },
  { id: "7", chapter: "第七章 在线教育公共服务平台与典型案例", discussion: "公共服务平台如何避免只提供资源，而不能真正促进教育公平？" },
  { id: "8", chapter: "第八章 在线教育的新知识观和新本体论", discussion: "网络时代的新知识观对教师角色和学生学习方式提出了哪些变化？" },
];

const resourceMap = {
  "1": [
    { type: "PDF", file: "resources/teaching/lesson-materials/第1章-在线教育实践发展的脉络与创新方向.pdf", label: "第1章-在线教育实践发展的脉络与创新方向.pdf" },
    { type: "PDF", file: "resources/teaching/references/第一章-教材.pdf", label: "第一章-教材.pdf" },
  ],
  "2": [
    { type: "PDF", file: "resources/teaching/lesson-materials/第2章-在线教学模式与教学设计.pdf", label: "第2章-在线教学模式与教学设计.pdf" },
    { type: "PDF", file: "resources/teaching/references/第二章-教材.pdf", label: "第二章-教材.pdf" },
    { type: "PDF", file: "resources/teaching/references/第二章-阅读材料.pdf", label: "第二章-阅读材料.pdf" },
  ],
  "3": [
    { type: "PDF", file: "resources/teaching/lesson-materials/第3章-在线自主学习与学习支持服务.pdf", label: "第3章-在线自主学习与学习支持服务.pdf" },
    { type: "PDF", file: "resources/teaching/references/第三章-教材.pdf", label: "第三章-教材.pdf" },
    { type: "PDF", file: "resources/teaching/references/第三章-阅读材料.pdf", label: "第三章-阅读材料.pdf" },
  ],
  "4": [
    { type: "PDF", file: "resources/teaching/lesson-materials/第4章-在线学习资源与建设模式.pdf", label: "第4章-在线学习资源与建设模式.pdf" },
    { type: "PDF", file: "resources/teaching/references/第四章-教材.pdf", label: "第四章-教材.pdf" },
    { type: "PDF", file: "resources/teaching/references/第四章-阅读材料.pdf", label: "第四章-阅读材料.pdf" },
  ],
  "5": [
    { type: "PDF", file: "resources/teaching/lesson-materials/第5章-在线教育的过程监控与精准管理.pdf", label: "第5章-在线教育的过程监控与精准管理.pdf" },
    { type: "PDF", file: "resources/teaching/references/第五章-教材.pdf", label: "第五章-教材.pdf" },
    { type: "PDF", file: "resources/teaching/references/第五章-阅读材料.pdf", label: "第五章-阅读材料.pdf" },
  ],
  "6": [
    { type: "PDF", file: "resources/teaching/lesson-materials/第6章-在线教育服务供给模式.pdf", label: "第6章-在线教育服务供给模式.pdf" },
    { type: "PDF", file: "resources/teaching/references/第六章-教材.pdf", label: "第六章-教材.pdf" },
  ],
  "7": [
    { type: "PDF", file: "resources/teaching/lesson-materials/第7章-在线教育公共服务平台与典型案例.pdf", label: "第7章-在线教育公共服务平台与典型案例.pdf" },
    { type: "PDF", file: "resources/teaching/references/第七章-教材.pdf", label: "第七章-教材.pdf" },
  ],
  "8": [
    { type: "PDF", file: "resources/teaching/lesson-materials/第8章-在线教育的新知识观和新本体论.pdf", label: "第8章-在线教育的新知识观和新本体论.pdf" },
    { type: "PDF", file: "resources/teaching/references/第八章-教材.pdf", label: "第八章-教材.pdf" },
  ],
};

const agentInfo = {
  concept: {
    name: "概念理解伙伴",
    code: "概",
    type: "概念理解支持",
    intro: "帮助学习者理解课程核心概念，提供结构化解释。",
    callout: "按照“概念—例子—易错点—小结”帮助你把抽象概念学清楚。",
    supports: ["概念解释", "具体例子", "易错点提醒", "学习小结"],
    triggers: ["反复询问某一概念或定义累计 3 次", "章节测验概念题表现较弱", "任务开始前需要复习核心概念"],
  },
  planner: {
    name: "任务规划伙伴",
    code: "规",
    type: "任务调节支持",
    intro: "帮助学习者管理每章学习任务，拆解阶段步骤并温和提醒。",
    callout: "会提醒你看 PPT、读教材/阅读材料，并完成讨论发帖。",
    supports: ["任务启动提醒", "任务推进提醒", "提交前提醒", "完成鼓励"],
    triggers: ["距离章节截止日期 3 天内", "打开任务表现页面", "完成本章全部学习内容"],
  },
  scenario: {
    name: "情境应用伙伴",
    code: "境",
    type: "情境应用支持",
    intro: "帮助学习者把概念应用到真实情境，避免停留在抽象表述。",
    callout: "当你的讨论发言概念较多、案例较少时，会提示你补充真实案例。",
    supports: ["案例补充", "情境追问", "应用边界", "方案迁移"],
    triggers: ["讨论发言中概念表述较多、具体案例较少", "任务成果缺少真实情境支撑"],
  },
  discussion: {
    name: "共同讨论伙伴",
    code: "论",
    type: "社会建构支持",
    intro: "帮助学习者参与讨论区表达，尤其支持不知道如何组织语言的学习者。",
    callout: "可以先听你说想法，再帮你整理成适合发布的讨论发言。",
    supports: ["观点整理", "表达模板", "回应建议", "低压力发言准备"],
    triggers: ["进入讨论区 1 分钟内未发言", "讨论观点零散", "需要回应同伴观点"],
  },
};

const questions = [
  {
    id: "motivation",
    title: "学习动机触发因素识别",
    question: "请判断下面说法与你的学习状态有多符合。",
    image: "public/images/学习动机触发因素识别页面.png",
    dimension: "学习动机触发因素",
    items: [
      { id: "motivation-task", text: "当学习任务和成绩、要求相关时，我更容易开始学习。", agent: "planner" },
      { id: "motivation-real", text: "当课程内容与真实问题或未来发展有关时，我更有学习动力。", agent: "scenario" },
      { id: "motivation-feedback", text: "如果学习过程有清晰进度和反馈，我更愿意持续投入。", agent: "planner" },
      { id: "motivation-social", text: "如果有老师或同伴的鼓励，我更容易保持学习动力。", agent: "discussion" },
    ],
  },
  {
    id: "situation",
    title: "学习情境适应需求识别",
    question: "请判断下面说法与你的学习支持需求有多符合。",
    image: "public/images/学习情境适应需求识别页面.png",
    dimension: "学习情境适应需求",
    items: [
      { id: "situation-concept", text: "学习新概念时，我希望先看到清晰解释。", agent: "concept" },
      { id: "situation-case", text: "如果能结合真实案例，我会更容易理解知识点。", agent: "scenario" },
      { id: "situation-steps", text: "面对复杂任务时，我需要有人帮我拆解步骤。", agent: "planner" },
      { id: "situation-context", text: "我希望系统能根据不同学习情境给出不同支持。", agent: "scenario" },
    ],
  },
  {
    id: "selfRegulation",
    title: "自我调节与情绪管理识别",
    question: "请判断下面说法与你的自我调节状态有多符合。",
    image: "public/images/自我调节与情绪管理识别功能.png",
    dimension: "自我调节与情绪管理",
    items: [
      { id: "selfRegulation-deadline", text: "面对两周完成的任务，我容易拖到截止前才开始。", agent: "planner" },
      { id: "selfRegulation-reminder", text: "如果没有提醒，我可能会忘记或推迟学习任务。", agent: "planner" },
      { id: "selfRegulation-anxiety", text: "遇到困难时，我容易感到焦虑或不知道下一步做什么。", agent: "planner" },
      { id: "selfRegulation-encourage", text: "我需要阶段性鼓励来维持学习投入。", agent: "discussion" },
    ],
  },
  {
    id: "difficulty",
    title: "学习困难感知识别",
    question: "请判断下面困难在你的网络学习中有多明显。",
    image: "public/images/学习困难感知识别功能.png",
    dimension: "学习困难感知",
    items: [
      { id: "difficulty-abstract", text: "我经常觉得课程概念比较抽象。", agent: "concept" },
      { id: "difficulty-transfer", text: "我能听懂知识点，但不知道如何用到任务中。", agent: "scenario" },
      { id: "difficulty-resource", text: "资源很多时，我不确定应该优先看哪些。", agent: "concept" },
      { id: "difficulty-feedback", text: "完成任务后，我不清楚自己哪里还需要改进。", agent: "planner" },
    ],
  },
  {
    id: "cognition",
    title: "认知加工方式识别",
    question: "请判断下面方式对你确认理解有多重要。",
    image: "public/images/认知加工方式识别功能.png",
    dimension: "认知加工方式",
    items: [
      { id: "cognition-define", text: "我更习惯通过复述定义来确认自己理解了知识点。", agent: "concept" },
      { id: "cognition-example", text: "我需要通过举例来确认自己是否真正理解。", agent: "scenario" },
      { id: "cognition-structure", text: "我更喜欢用结构图或框架整理知识。", agent: "concept" },
      { id: "cognition-problem", text: "我希望能把知识用于真实问题解决中。", agent: "scenario" },
    ],
  },
];

const likertOptions = [
  [1, "非常不符合"],
  [2, "不太符合"],
  [3, "一般"],
  [4, "比较符合"],
  [5, "非常符合"],
];

const dynamicDimensions = [
  {
    name: "知识理解",
    sources: "视频/PPT学习时长、重点片段点击、章节测验得分、概念复述质量、AI问答记录",
    signal: "判断学习者是否真正理解核心知识",
    score: 62,
  },
  {
    name: "任务过程",
    sources: "任务启动时间、距离DDL的提交时间、阶段完成率、草稿修改次数、是否查看任务说明和示例",
    signal: "判断任务规划和自我调节能力",
    score: 48,
  },
  {
    name: "社会互动",
    sources: "发帖、回复、点赞、同伴互评、小组贡献、AI讨论陪练记录、讨论文本深度",
    signal: "判断表达意愿、互动质量和社会临场感",
    score: 36,
  },
  {
    name: "能力发展",
    sources: "情境任务成果、案例分析质量、问题拆解、证据使用、方案合理性、反思修改记录",
    signal: "判断知识能否迁移到真实问题",
    score: 54,
  },
];

const taskScenarios = [
  {
    title: "县域教师数字化培训项目设计",
    subtitle: "青禾县 · 800名中小学教师 · 8周培训",
    knowledge: ["K1 在线教育概念与特征", "K3 在线学习理论", "K5 混合式学习设计", "K7 在线课程开发流程", "K8 在线教学交互设计", "K9 在线学习支持服务", "K10 在线教学评价方法", "K12 在线教育技术与工具"],
    background: ["教师信息技术水平差异很大。", "平台功能基础，只支持视频、测试、讨论区和直播。", "教师工作繁忙，只能晚上或周末学习。", "过去培训完成率高，但实际教学改进不明显。"],
    questions: ["选择全在线、混合式还是其他模式？", "培训内容如何分模块安排？", "如何处理教师能力差异？", "如何设计学习活动而不只是看视频？", "如何评价数字化教学能力是否提升？"],
    roles: ["教育局", "年轻教师", "老教师", "培训教师", "学校管理者"],
  },
  {
    title: "高校MOOC完成率低的课程改造",
    subtitle: "未来大学 · 人工智能导论 · MOOC+SPOC",
    knowledge: ["K4 MOOC/SPOC模式设计与实施", "K5 混合式学习设计", "K6 翻转课堂设计与实施", "K8 在线教学交互设计", "K10 在线教学评价方法", "K11 在线教育质量保证体系"],
    background: ["第三周后活跃人数下降到18%。", "论坛讨论质量低，多数回复停留在“已学习”。", "测验主要是选择题，难以考查真实问题解决。", "学校希望转为校内 SPOC 并结合线下课堂。"],
    questions: ["完成率低是MOOC本身问题还是课程设计问题？", "MOOC和SPOC如何分工？", "如何提高论坛互动质量？", "如何重新设计评价任务？", "线上和线下分别承担什么功能？"],
    roles: ["课程教师", "校内学生", "MOOC学习者", "助教", "学校管理者"],
  },
  {
    title: "乡村学校双师课堂与资源公平",
    subtitle: "明德小学 · 远程名师直播 · 本地教师协同",
    knowledge: ["K1 在线教育概念与特征", "K3 在线学习理论", "K5 混合式学习设计", "K8 在线教学交互设计", "K9 在线学习支持服务", "K10 在线教学评价方法", "K12 在线教育技术与工具"],
    background: ["城市教师不熟悉乡村学生基础。", "本地教师参与感弱。", "学生互动逐渐减少。", "网络不稳定时课堂连续性受影响。"],
    questions: ["双师课堂为什么不等于远程名师直播？", "城市教师和本地教师如何分工？", "如何增强学生互动？", "网络不稳定时如何保证连续性？", "如何评价是否促进教育公平？"],
    roles: ["城市教师", "本地教师", "学生", "家长", "县教研员"],
  },
  {
    title: "成人在线职业课程的学习支持服务设计",
    subtitle: "职达在线 · 数据分析入门 · 成人学习者",
    knowledge: ["K1 在线教育概念与特征", "K7 在线课程开发流程", "K8 在线教学交互设计", "K9 在线学习支持服务", "K10 在线教学评价方法", "K11 在线教育质量保证体系", "K12 在线教育技术与工具"],
    background: ["学习者多为在职人员。", "两周后学习频率明显下降。", "微信群通知多、学习交流少。", "平台希望引入 AI 助教但担心过度依赖。"],
    questions: ["成人在线学习者有什么特点？", "学习支持服务包括哪些类型？", "AI助教与人工教师如何分工？", "如何用作品证明能力？", "如何减少学习者流失？"],
    roles: ["成人学习者", "AI助教", "人工教师", "企业导师", "平台运营"],
  },
];

const state = {
  selectedSection: localStorage.getItem("selectedSection") || "1",
  activeView: "home",
  activeTool: "overview",
  expandedChapters: [],
  selectedScenario: Number(localStorage.getItem("selectedScenario") || "0"),
  questionIndex: 0,
  answers: JSON.parse(localStorage.getItem("learningProfileAnswers") || "{}"),
  user: JSON.parse(localStorage.getItem("learningUser") || "null"),
  matchedAgent: localStorage.getItem("matchedAgent") || "concept",
  agentMessages: JSON.parse(localStorage.getItem("agentMessages") || "[]"),
  coordinatorDecisions: JSON.parse(localStorage.getItem("coordinatorDecisions") || "[]"),
  sectionMessages: JSON.parse(localStorage.getItem("sectionMessages") || "{}"),
  discussionPosts: JSON.parse(localStorage.getItem("discussionPosts") || "{}"),
  selectedResources: JSON.parse(localStorage.getItem("selectedResources") || "{}"),
  triggerState: JSON.parse(localStorage.getItem("triggerState") || "{}"),
  telemetry: JSON.parse(localStorage.getItem("learningTelemetry") || "{}"),
  collaborativeDocs: JSON.parse(localStorage.getItem("collaborativeDocs") || "{}"),
  groupMessages: JSON.parse(localStorage.getItem("groupMessages") || "{}"),
  taskCompanionDialogs: JSON.parse(localStorage.getItem("taskCompanionDialogs") || "{}"),
  taskReviewMode: JSON.parse(localStorage.getItem("taskReviewMode") || "{}"),
  scenarioSupportInputs: JSON.parse(localStorage.getItem("scenarioSupportInputs") || "{}"),
  scenarioSupportActions: JSON.parse(localStorage.getItem("scenarioSupportActions") || "{}"),
  supportAdjustmentStatus: JSON.parse(localStorage.getItem("supportAdjustmentStatus") || "{}"),
  knowledgeBaseText: "",
};

function allSections() {
  return courseCatalog.map((chapter) => ({ id: chapter.id, title: chapter.chapter, chapter: chapter.chapter, discussion: chapter.discussion }));
}

function currentSection() {
  return allSections().find((item) => item.id === state.selectedSection) || allSections()[0];
}

function currentScenario() {
  return taskScenarios[state.selectedScenario] || taskScenarios[0];
}

function coordinatorLearningContext(section = currentSection()) {
  const scenario = currentScenario();
  const selectedResource = resourceMap[section.id]?.[selectedResourceIndex(section)];
  const p = profile();
  return {
    matchedAgent: state.matchedAgent,
    matchedAgentName: agentInfo[state.matchedAgent]?.name || "待匹配",
    profile: {
      mainAgent: p.mainAgent,
      supportScores: p.scores,
      traits: p.traits,
      radarValues: profileRadarValues(),
    },
    currentSection: {
      id: section.id,
      title: section.title,
      discussion: section.discussion,
      selectedResource: selectedResource?.label || null,
    },
    currentTask: {
      title: scenario.title,
      subtitle: scenario.subtitle,
      knowledge: scenario.knowledge,
      questions: scenario.questions,
      roles: scenario.roles,
    },
    activeTool: state.activeTool,
    twoWeekCycle: twoWeekCycleLabel(section),
    progressPercent: progressPercent(),
    telemetry: chapterTelemetry(section.id),
  };
}

function save() {
  localStorage.setItem("selectedSection", state.selectedSection);
  localStorage.setItem("selectedScenario", String(state.selectedScenario));
  localStorage.setItem("learningProfileAnswers", JSON.stringify(state.answers));
  localStorage.setItem("learningUser", JSON.stringify(state.user));
  localStorage.setItem("matchedAgent", state.matchedAgent);
  localStorage.setItem("agentMessages", JSON.stringify(state.agentMessages.slice(-24)));
  localStorage.setItem("coordinatorDecisions", JSON.stringify(state.coordinatorDecisions.slice(-12)));
  localStorage.setItem("sectionMessages", JSON.stringify(state.sectionMessages));
  localStorage.setItem("discussionPosts", JSON.stringify(state.discussionPosts));
  localStorage.setItem("selectedResources", JSON.stringify(state.selectedResources));
  localStorage.setItem("triggerState", JSON.stringify(state.triggerState));
  localStorage.setItem("learningTelemetry", JSON.stringify(state.telemetry));
  localStorage.setItem("collaborativeDocs", JSON.stringify(state.collaborativeDocs));
  localStorage.setItem("groupMessages", JSON.stringify(state.groupMessages));
  localStorage.setItem("taskCompanionDialogs", JSON.stringify(state.taskCompanionDialogs));
  localStorage.setItem("taskReviewMode", JSON.stringify(state.taskReviewMode));
  localStorage.setItem("scenarioSupportInputs", JSON.stringify(state.scenarioSupportInputs));
  localStorage.setItem("scenarioSupportActions", JSON.stringify(state.scenarioSupportActions));
  localStorage.setItem("supportAdjustmentStatus", JSON.stringify(state.supportAdjustmentStatus));
}

async function fetchKnowledgeBase() {
  try {
    const response = await fetch("data/knowledge/knowledge-base.md");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.knowledgeBaseText = await response.text();
    if (state.activeTool === "tasks" && qs("#task-companion-dialog")?.open) {
      renderTaskCompanionDialog(currentSection());
    }
  } catch {
    state.knowledgeBaseText = "";
  }
}

function taskStateKey(section = currentSection()) {
  return `${section.id}-${state.selectedScenario}`;
}

function taskDialogKey(section = currentSection()) {
  return `taskCompanion-${taskStateKey(section)}`;
}

function groupStateKey(section = currentSection()) {
  return `group-${taskStateKey(section)}`;
}

function twoWeekCycleLabel(section = currentSection()) {
  const startWeek = (Number(section.id) - 1) * 2 + 1;
  return `第 ${startWeek}—${startWeek + 1} 周`;
}

function supportAdjustmentKey(section = currentSection()) {
  return `support-adjustment-${section.id}`;
}

function nowText() {
  return new Date().toLocaleString("zh-CN", { hour12: false });
}

function profile() {
  const scores = { concept: 0, planner: 0, scenario: 0, discussion: 0 };
  const traits = questions.map((question) => {
    const answer = answerFor(question);
    question.items.forEach((item) => {
      const value = Number(answer[item.id]);
      if (value) scores[item.agent] += value - 1;
    });
    const score = dimensionScore(question);
    const topAgent = strongestAgentForQuestion(question);
    return {
      dimension: question.dimension,
      value: isQuestionAnswered(question) ? `${supportLevel(score)} · ${score}%` : "待识别",
      agent: topAgent,
      score,
    };
  });
  const mainAgent = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return { scores, traits, mainAgent };
}

function profileRadarValues() {
  return questions.map((question) => {
    const score = dimensionScore(question);
    return {
      id: question.id,
      name: question.dimension.replace("识别", ""),
      value: isQuestionAnswered(question) ? score : 18,
      label: isQuestionAnswered(question) ? supportLevel(score) : "待识别",
      agent: strongestAgentForQuestion(question),
    };
  });
}

function answerFor(question) {
  const answer = state.answers[question.id];
  return answer && typeof answer === "object" && !Array.isArray(answer) ? answer : {};
}

function isQuestionAnswered(question) {
  const answer = answerFor(question);
  return question.items.every((item) => Number(answer[item.id]) >= 1);
}

function answeredDimensionCount() {
  return questions.filter(isQuestionAnswered).length;
}

function dimensionScore(question) {
  const answer = answerFor(question);
  const values = question.items.map((item) => Number(answer[item.id])).filter((value) => value >= 1);
  if (!values.length) return 0;
  const average = values.reduce((sum, value) => sum + value, 0) / question.items.length;
  return Math.max(0, Math.min(100, Math.round(((average - 1) / 4) * 100)));
}

function supportLevel(score) {
  if (score >= 80) return "高支持需求";
  if (score >= 60) return "较高支持需求";
  if (score >= 40) return "中等支持需求";
  if (score > 0) return "较低支持需求";
  return "待识别";
}

function strongestAgentForQuestion(question) {
  const answer = answerFor(question);
  const scores = { concept: 0, planner: 0, scenario: 0, discussion: 0 };
  question.items.forEach((item) => {
    scores[item.agent] += Math.max(0, Number(answer[item.id]) || 0);
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function renderProfileRadar(values = profileRadarValues()) {
  const size = 330;
  const center = size / 2;
  const maxRadius = 104;
  const axisCount = values.length;
  const pointFor = (index, radius) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / axisCount;
    return [center + Math.cos(angle) * radius, center + Math.sin(angle) * radius];
  };
  const grid = [0.25, 0.5, 0.75, 1]
    .map((ratio) => `<polygon points="${values.map((_, index) => pointFor(index, maxRadius * ratio).join(",")).join(" ")}" />`)
    .join("");
  const axes = values
    .map((item, index) => {
      const [x, y] = pointFor(index, maxRadius);
      const [lx, ly] = pointFor(index, maxRadius + 38);
      return `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" /><text x="${lx}" y="${ly}">${item.name}</text>`;
    })
    .join("");
  const area = values.map((item, index) => pointFor(index, (item.value / 100) * maxRadius).join(",")).join(" ");
  const dots = values
    .map((item, index) => {
      const [x, y] = pointFor(index, (item.value / 100) * maxRadius);
      return `<circle cx="${x}" cy="${y}" r="4"><title>${item.name}：${item.value}% · ${item.label}</title></circle>`;
    })
    .join("");
  return `
    <section class="radar-card">
      <div>
        <p class="eyebrow">五维画像雷达图</p>
        <h3>学习支持需求可视化</h3>
      </div>
      <svg class="profile-radar" viewBox="0 0 ${size} ${size}" role="img" aria-label="五个维度的学习者画像雷达图">
        <g class="radar-grid">${grid}${axes}</g>
        <polygon class="radar-area" points="${area}" />
        <g class="radar-dots">${dots}</g>
      </svg>
      <div class="radar-legend">
        ${values.map((item) => `<div><strong>${item.value}%</strong><span>${item.name} · ${item.label}</span></div>`).join("")}
      </div>
      <p class="muted">注：这是类型识别后的画像强度可视化，不是成绩分数；后续会结合学习行为动态更新。</p>
    </section>
  `;
}

function syncMatchedAgent() {
  const p = profile();
  if (answeredDimensionCount() === questions.length) {
    state.matchedAgent = p.mainAgent;
  }
}

function chip(text, cls = "") {
  return `<span class="chip ${cls}">${text}</span>`;
}

function botFace(code) {
  return `<div class="bot-face"><span class="bot-eye"></span><span class="bot-code">${code}</span><span class="bot-eye"></span></div>`;
}

function renderSidebar() {
  const userName = state.user?.name || "未登录学习者";
  qs(".sidebar").innerHTML = `
    <button class="profile-button" id="profile-entry">
      <span class="avatar">${state.user?.name ? state.user.name.slice(0, 1) : "人"}</span>
      <span><strong>${userName}</strong><small>个人中心 · 学习画像</small></span>
    </button>
    <button class="home-nav ${state.activeView === "home" ? "active" : ""}" id="home-entry">课程首页</button>
    <nav class="course-nav" aria-label="课程目录">
      ${courseCatalog
        .map(
          (chapter) => `
          <section class="chapter-nav">
            <button class="chapter-title ${state.activeView === "section" && state.selectedSection === chapter.id ? "active" : ""}" data-section="${chapter.id}">
              <span>${chapter.id}</span>
              <strong>${chapter.chapter}</strong>
            </button>
            ${state.activeView === "section" && state.selectedSection === chapter.id ? renderSidebarResources(chapter.id) : ""}
          </section>`,
        )
        .join("")}
    </nav>
  `;
}

function renderSidebarResources(chapterId) {
  const resources = resourceMap[chapterId] || [];
  if (!resources.length) return `<div class="sidebar-resource-list"><p class="muted">暂无资源</p></div>`;
  return `
    <div class="sidebar-resource-list">
      ${resources
        .map((item, index) => `<button class="sidebar-resource-btn ${selectedResourceIndex({ id: chapterId }) === index ? "active" : ""}" data-resource-index="${index}">
          <strong>${item.label}</strong>
          <span>${item.type}</span>
        </button>`)
        .join("")}
      <button class="sidebar-resource-btn discussion-entry ${isDiscussionSelected({ id: chapterId }) ? "active" : ""}" data-discussion-entry="${chapterId}">
        <strong>讨论</strong>
        <span>本章话题讨论与发帖</span>
      </button>
    </div>
  `;
}

function renderApp() {
  syncMatchedAgent();
  renderSidebar();
  const section = currentSection();
  const isHome = state.activeView === "home";
  const isTool = state.activeView === "tool";
  qs("#view-title").textContent = isHome ? "课程首页" : isTool ? toolTitle() : section.title;
  qs(".eyebrow").textContent = isHome ? "知伴学境 · 在线学习平台" : isTool ? "学习支持工具 · 在线教育原理" : `第 ${section.id} 章 · 在线教育原理`;
  qs(".top-actions").innerHTML = `
    <button class="ghost-btn" id="open-test-top">识别差异</button>
    <button class="ghost-btn" data-tool="agent">匹配AI学伴</button>
    <button class="ghost-btn" data-tool="tasks">任务表现</button>
    <button class="primary-btn" data-tool="dynamic">反馈更新</button>
  `;
  qs("#dashboard-view").innerHTML = isHome ? renderHomePage() : isTool ? renderToolPage() : renderCourseWorkspace(section);
  qsa(".view").forEach((view) => view.classList.remove("active"));
  qs("#dashboard-view").classList.add("active");
  ["diagnosis", "agents", "tasks", "resources", "community", "ai", "analytics"].forEach((id) => {
    const el = qs(`#${id}-view`);
    if (el) el.innerHTML = "";
  });
  save();
}

function toolTitle() {
  if (state.activeTool === "agent") return "匹配AI学伴";
  if (state.activeTool === "tasks") return "任务表现";
  if (state.activeTool === "dynamic") return "反馈更新";
  return "学习支持";
}

function renderHomePage() {
  const needsTest = answeredDimensionCount() < questions.length;
  return `
    <section class="course-hero">
      <div class="course-hero-content">
        <p class="eyebrow">知伴学境 · 在线学习平台</p>
        <h2>在线教育原理</h2>
        <p>完成学习者差异识别，进入按章节组织的课程资源、真实情境任务与 AI 支持学习空间。</p>
        <div class="button-row">
          <button class="primary-btn" id="home-start-test">${needsTest ? "开始匹配测试" : "查看我的画像"}</button>
          <button class="ghost-btn" data-tool="agent">查看匹配AI学伴</button>
        </div>
      </div>
    </section>
    <div class="grid three" style="margin-top:16px">
      <div class="metric"><strong>${answeredDimensionCount()}/5</strong><span>差异识别完成度</span></div>
      <div class="metric"><strong>${progressPercent()}%</strong><span>课程学习进度</span></div>
      <div class="metric"><strong>${agentInfo[state.matchedAgent]?.name || "待匹配"}</strong><span>当前AI学伴</span></div>
    </div>
    <section class="panel" style="margin-top:16px">
      <h2>开始学习</h2>
      <p class="muted">左侧目录只显示章名。点击某一章后，会看到本章资源清单和讨论题；点击具体资源后，右侧显示 PDF 内容。</p>
    </section>
  `;
}

function renderToolPage() {
  return `
    <section class="panel tool-dock global-tool">
      <div class="module-tabs">
        <button class="tab-btn ${state.activeTool === "agent" ? "active" : ""}" data-tool="agent">匹配AI学伴</button>
        <button class="tab-btn ${state.activeTool === "tasks" ? "active" : ""}" data-tool="tasks">任务表现</button>
        <button class="tab-btn ${state.activeTool === "dynamic" ? "active" : ""}" data-tool="dynamic">反馈更新</button>
      </div>
      <div class="tool-body">${renderToolBody(currentSection())}</div>
    </section>
  `;
}

function renderCourseWorkspace(section) {
  return `
    <div class="lesson-layout">
      <section class="resource-column">
        ${renderResourcePreview(section)}
        <section class="panel tool-dock">
          <div class="module-tabs">
            <button class="tab-btn ${state.activeTool === "overview" ? "active" : ""}" data-tool="overview">章节学习</button>
            <button class="tab-btn ${state.activeTool === "agent" ? "active" : ""}" data-tool="agent">匹配AI学伴</button>
            <button class="tab-btn ${state.activeTool === "tasks" ? "active" : ""}" data-tool="tasks">任务表现</button>
            <button class="tab-btn ${state.activeTool === "dynamic" ? "active" : ""}" data-tool="dynamic">反馈更新</button>
          </div>
          <div class="tool-body">${renderToolBody(section)}</div>
        </section>
      </section>
      <aside class="section-ai panel">
        ${renderSectionAi(section)}
      </aside>
    </div>
  `;
}

function renderChapterPanel(section) {
  const resources = resourceMap[section.id] || [];
  if (!resources.length) {
    return `
      <section class="panel resource-panel empty-resource">
        <p class="eyebrow">章节资源</p>
        <h2>${section.title}</h2>
        <p class="muted">该章节暂未提供教学资源，当前先保留课程标题和学习入口。</p>
        <div class="empty-illustration">${botFace("课")}</div>
      </section>
    `;
  }
  return `
    <section class="panel resource-panel">
      <div class="resource-header">
        <div>
          <p class="eyebrow">章节资源 · RAG 语料库</p>
          <h2>${section.title}</h2>
          <p class="muted">这些资源都已归入本章 RAG 语料库。点击某个资源后，会在右侧显示具体内容。</p>
        </div>
      </div>
      <div class="resource-card-list">
        ${resources.map((item, index) => `<button class="resource-card-btn ${selectedResourceIndex(section) === index ? "active" : ""}" data-resource-index="${index}">
          <strong>${item.label}</strong>
          <span>${item.type} · 点击后在右侧预览</span>
        </button>`).join("")}
      </div>
    </section>
  `;
}

function selectedResourceIndex(section) {
  const value = state.selectedResources[section.id];
  return Number.isInteger(value) ? value : null;
}

function isDiscussionSelected(section) {
  return state.selectedResources[section.id] === "discussion";
}

function renderResourcePreview(section) {
  if (isDiscussionSelected(section)) return renderChapterDiscussion(section);
  const resources = resourceMap[section.id] || [];
  const index = selectedResourceIndex(section);
  const resource = resources.length ? resources[index ?? 0] : null;
  if (!resource) {
    return `
      <section class="panel resource-preview empty-preview">
        <p class="eyebrow">资源预览</p>
        <h2>请选择一个资源</h2>
        <p class="muted">点击左侧资源清单中的具体 PDF 后，这里会显示对应内容。</p>
        <div class="empty-illustration">${botFace("阅")}</div>
      </section>
    `;
  }
  return `
    <section class="panel resource-preview">
      <div class="resource-header">
        <div>
          <p class="eyebrow">正在阅读</p>
          <h2>${resource.label}</h2>
        </div>
        <a class="ghost-btn resource-link" href="${resource.file}" target="_blank" rel="noreferrer">新窗口打开</a>
      </div>
      <iframe class="resource-viewer" src="${resource.file}" title="${resource.label}"></iframe>
    </section>
  `;
}

function renderChapterDiscussion(section) {
  const posts = state.discussionPosts[section.id] || [
    { author: "同学A", content: "我觉得这一章的关键不是技术本身，而是技术如何改变教育服务的组织方式。", time: "示例帖子" },
    { author: "同学B", content: "可以结合资源里的案例分析：同样是在线平台，不同供给模式带来的学习支持差异很大。", time: "示例帖子" },
  ];
  return `
    <section class="panel discussion-panel discussion-screen">
      <p class="eyebrow">${chapterDiscussionTitle(section)} · AI 学伴支持讨论</p>
      <h2>${section.discussion}</h2>
      ${renderDiscussionCompanionCue(section)}
      ${renderScenarioApplicationCue(section)}
      <form class="discussion-form" id="chapter-discussion-form">
        <textarea id="chapter-discussion-input" placeholder="发表你的观点：可以说明判断、理由、案例或对同学观点的回应。"></textarea>
        <button class="primary-btn" type="submit">发布帖子</button>
      </form>
      <div class="discussion-list">
        ${posts
          .map((post) => `<article class="discussion-item"><strong>${post.author}</strong><p>${escapeHtml(post.content)}</p><span class="muted">${post.time}</span></article>`)
          .join("")}
      </div>
    </section>
  `;
}

function chapterDiscussionTitle(section) {
  return `第${section.id}章-话题讨论`;
}

function renderDiscussionCompanionCue(section) {
  const posts = state.discussionPosts[section.id] || [];
  if (posts.length === 0) {
    return `<div class="auto-cue discussion-wait-cue"><strong>共同讨论伙伴</strong><p>你可以先把想法告诉我，我帮你整理成一段适合发布的讨论发言。</p></div>`;
  }
  return "";
}

function renderScenarioApplicationCue(section) {
  const cue = state.triggerState[`scenarioCue-${section.id}`];
  if (!cue) return "";
  return `
    <div class="auto-cue scenario-cue">
      <strong>情境应用伙伴</strong>
      <p>你的概念表述比较完整，但还可以补充一个真实案例来说明。</p>
      <form class="case-supplement-form" id="case-supplement-form">
        <textarea id="case-supplement-input" placeholder="补充一个真实案例或学习场景，让观点更具体。"></textarea>
        <button class="soft-btn" type="submit">补充案例</button>
      </form>
    </div>
  `;
}

function needsCaseCue(text) {
  const conceptWords = (text.match(/概念|理论|模式|资源|支持|评价|数据|平台|学习|教育/g) || []).length;
  const caseWords = /例如|比如|案例|场景|学校|课程|教师|学生|项目/.test(text);
  return conceptWords >= 4 && !caseWords;
}

function renderToolBody(section) {
  if (state.activeTool === "agent") return renderMatchedAgentPanel();
  if (state.activeTool === "tasks") return renderTaskPanel(section);
  if (state.activeTool === "dynamic") return renderDynamicPanel();
  return renderSectionOverview(section);
}

function renderSectionOverview(section) {
  const resources = resourceMap[section.id] || [];
  return `
    <div class="grid three">
      <div class="card">
        <h3>学习路径</h3>
        <p class="muted">先浏览资源，再向右侧章节 AI 提问，最后进入任务表现或反馈更新查看学习状态。</p>
      </div>
      <div class="card">
        <h3>资源状态</h3>
        <p>${resources.length ? `${resources.length} 份资源已归入第 ${section.id} 章 RAG 语料库` : "当前章节暂无资源"}</p>
      </div>
      <div class="card">
        <h3>支持提醒</h3>
        <p class="muted">右侧 AI 学伴会嵌入资源学习、讨论互动和任务表现过程，按情境提供支持。</p>
      </div>
    </div>
  `;
}

function renderMatchedAgentPanel() {
  const agent = agentInfo[state.matchedAgent] || agentInfo.concept;
  const reason = matchedAgentReason();
  return `
    <section class="agent-showcase hero-agent">
        ${botFace(agent.code)}
        <div>
          <p class="eyebrow">当前主学伴</p>
          <h2>${agent.name}</h2>
          <p class="muted">${agent.intro}</p>
          <div class="chip-row">${chip(agent.type, "mint")}${chip(agent.callout, "blue")}</div>
        </div>
    </section>
    <section class="panel-lite match-reason-panel">
      <div class="grid three">
        <div class="metric"><strong>${agent.name}</strong><span>当前主学伴</span></div>
        <div class="metric"><strong>${reason.score}%</strong><span>最高支持需求维度</span></div>
        <div class="metric"><strong>${twoWeekCycleLabel()}</strong><span>当前学习周期</span></div>
      </div>
      <div class="record-list" style="margin-top:12px">
        <div class="record-item"><strong>匹配原因</strong><p>${reason.text}</p></div>
        <div class="record-item"><strong>后续动态调整</strong><p>系统每两周汇总一次学习行为、任务表现、社会互动和 AI 互动数据，并更新学习者画像与 AI 学伴支持策略。</p></div>
      </div>
    </section>
    <section class="panel-lite coordinator-panel">
      <div>
        <p class="eyebrow">Coordinator Agent</p>
        <h3>AI 学伴协调器</h3>
        <p class="muted">每次提问时，协调器会综合学习者画像、当前章节、任务情境和行为数据，先选择 1 个主学伴，必要时附加 1 个辅助学伴，再由主学伴生成最终回复。</p>
      </div>
      <div class="coordinator-flow">
        ${["学习者状态", "协调器判断", "主学伴回复", "展示判断理由"].map((item) => `<span>${item}</span>`).join("")}
      </div>
      ${renderLatestCoordinatorDecision()}
    </section>
    <section class="panel-lite companion-map">
      <h3>四类AI学伴如何嵌入学习过程</h3>
      <div class="companion-map-grid">
        ${Object.values(agentInfo)
          .map(
            (item) => `
          <article>
            <strong>${item.name}</strong>
            <p>${item.intro}</p>
            <div class="chip-row">${item.supports.map((support) => chip(support)).join("")}</div>
            <small>自动触发：${item.triggers.join(" / ")}</small>
          </article>`,
          )
          .join("")}
      </div>
    </section>
    <div class="agent-grid-full">
      ${Object.entries(agentInfo)
        .map(([key, item]) => `<button class="agent-choice ${state.matchedAgent === key ? "active" : ""}" data-agent="${key}">
          ${botFace(item.code)}
          <span><strong>${item.name}</strong><small>${item.callout}</small></span>
        </button>`)
        .join("")}
    </div>
    <div class="suggestion-row">
      <button class="soft-btn" data-agent-prompt="我还有多少学习任务？你有什么建议？">我还有多少学习任务？你有什么建议？</button>
      <button class="soft-btn" data-agent-prompt="我现在不知道从哪里开始，请帮我拆成三步。">帮我拆成三步</button>
      <button class="soft-btn" data-agent-prompt="我想把这个知识点用到真实任务里，可以怎么思考？">帮我迁移应用</button>
      <button class="soft-btn" data-agent-prompt="我想发讨论区，但观点有点散，帮我整理一下。">整理讨论观点</button>
    </div>
    <div class="chat-log compact-chat" id="agent-chat-log">${renderMessages(state.agentMessages, "匹配AI学伴会根据后台规则为你提供学习支持。页面只展示角色说明和对话内容。")}</div>
    <form class="chat-form" id="agent-chat-form">
      <textarea id="agent-chat-input" placeholder="向匹配AI学伴描述你的学习困难、任务卡点或讨论准备需求。"></textarea>
      <button class="primary-btn" type="submit">发送</button>
    </form>
  `;
}

function renderLatestCoordinatorDecision() {
  const decision = state.coordinatorDecisions[state.coordinatorDecisions.length - 1];
  if (!decision) {
    return `<p class="muted">还没有新的协调器判断。发送一个问题后，这里会显示本轮为什么分配给某个 AI 学伴。</p>`;
  }
  return renderCoordinatorDecision(decision);
}

function renderCoordinatorDecision(decision) {
  const main = agentInfo[decision.selectedAgent]?.name || decision.selectedAgent || "待判断";
  const secondary = decision.secondaryAgent ? agentInfo[decision.secondaryAgent]?.name || decision.secondaryAgent : "无";
  return `
    <div class="coordinator-decision">
      <div class="chip-row">
        ${chip(`主学伴：${main}`, "mint")}
        ${chip(`辅助学伴：${secondary}`, "blue")}
      </div>
      <p><strong>判断理由：</strong>${escapeHtml(decision.reason || "系统根据当前学习状态完成分配。")}</p>
      <p><strong>支持策略：</strong>${escapeHtml(decision.strategy || "先引导学习者表达已有想法，再给出提示。")}</p>
    </div>
  `;
}

function matchedAgentReason() {
  const radar = profileRadarValues().filter((item) => item.label !== "待识别");
  const strongest = radar.length ? [...radar].sort((a, b) => b.value - a.value)[0] : null;
  const agent = agentInfo[state.matchedAgent] || agentInfo.concept;
  if (!strongest) {
    return {
      score: 0,
      text: `当前还没有完成初始量表测试，暂以“${agent.name}”作为默认支持入口。完成测试后会根据五维画像重新匹配。`,
    };
  }
  return {
    score: strongest.value,
    text: `初始测试显示“${strongest.name}”的支持需求较明显（${strongest.value}%），因此当前优先匹配“${agent.name}”。这只是初始画像，后续会结合两周学习表现动态调整。`,
  };
}

function renderSectionAi(section) {
  const messages = state.sectionMessages[section.id] || [];
  const resources = resourceMap[section.id] || [];
  const companionKey = isDiscussionSelected(section) ? "discussion" : "concept";
  const companion = agentInfo[companionKey];
  return `
    <div class="section-ai-head">
      ${botFace(companion.code)}
      <div>
        <p class="eyebrow">AI 学伴对话区</p>
        <h2>${companion.name}</h2>
      </div>
    </div>
    <p class="muted">${isDiscussionSelected(section) ? "你可以先和共同讨论伙伴交流，再发布讨论发言。" : resources.length ? `当前依据：本章 ${resources.length} 份教学资源。概念理解伙伴会基于本章资料解释知识点。` : "当前章节暂无资源，AI 学伴会明确说明依据不足。"}</p>
    ${renderConceptTriggerCard(section)}
    <div class="chat-log section-chat" id="section-chat-log">${renderMessages(messages, isDiscussionSelected(section) ? "把你的初步想法告诉我，我可以帮你整理成一段适合讨论区发布的发言。" : "你可以问本章知识点、概念区别、资源中的例子或复习重点。")}</div>
    <form class="chat-form vertical" id="section-chat-form">
      <textarea id="section-chat-input" placeholder="${isDiscussionSelected(section) ? "例如：我觉得在线教育不只是搬到线上，但不知道怎么组织语言。" : "例如：这一章的核心概念是什么？"}"></textarea>
      <button class="primary-btn" type="submit">${isDiscussionSelected(section) ? "让学伴帮我整理" : "提问"}</button>
    </form>
  `;
}

function conceptQuestionCount(section) {
  const messages = state.sectionMessages[section.id] || [];
  return messages.filter((item) => item.role === "user" && /概念|定义|含义|什么是|是什么意思/.test(item.content)).length;
}

function renderConceptTriggerCard(section) {
  if (isDiscussionSelected(section) || conceptQuestionCount(section) < 3) return "";
  return `
    <div class="auto-cue concept-trigger">
      <strong>概念理解伙伴</strong>
      <p>看来你正在理解这个概念，我们可以按照“概念—例子—易错点—小结”来学习。</p>
      <div class="support-module-grid">
        ${["概念解释", "具体例子", "易错点提醒", "学习小结"].map((item) => `<span>${item}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderMessages(messages, emptyText) {
  if (!messages.length) return `<div class="chat-bubble assistant">${emptyText}</div>`;
  return messages
    .map(
      (item) => `<div class="chat-bubble ${item.role === "user" ? "user" : "assistant"}">
        ${item.coordinator ? renderCoordinatorDecision(item.coordinator) : ""}
        ${escapeHtml(item.content)}
      </div>`,
    )
    .join("");
}

function renderScenarioPartnerPanel(section, scenario) {
  const key = taskStateKey(section);
  const input = state.scenarioSupportInputs[key] || {};
  const selectedAction = state.scenarioSupportActions[key] || "cases";
  const canUseSupport = hasScenarioSupportInput(input);
  return `
    <section class="card scenario-partner-panel" style="margin-top:16px">
      <div class="scenario-partner-head">
        <div>
          <p class="eyebrow">情境应用支持</p>
          <h3>情境应用伙伴</h3>
          <p class="muted">帮助你从真实案例中理解知识如何使用，把课程概念迁移到具体问题解决中。</p>
        </div>
        ${botFace("境")}
      </div>
      <div class="auto-cue scaffold-cue">
        <strong>AI 是支架，不是替代</strong>
        <p>请先写下你的初步想法，AI 学伴会在你的基础上帮助你完善，而不是直接替你完成任务。</p>
      </div>
      <div class="scenario-thinking-grid">
        <label>我对这个问题的初步理解
          <textarea data-scenario-input="understanding" placeholder="先用自己的话说明你怎么看当前任务。">${escapeHtml(input.understanding || "")}</textarea>
        </label>
        <label>我认为最关键的困难
          <textarea data-scenario-input="difficulty" placeholder="例如：学习动机不足、角色分工不清、评价方式单一。">${escapeHtml(input.difficulty || "")}</textarea>
        </label>
        <label>我目前想到的解决方向
          <textarea data-scenario-input="direction" placeholder="写下一个还不完整的方向即可，AI 学伴会继续追问。">${escapeHtml(input.direction || "")}</textarea>
        </label>
      </div>
      <div class="scenario-action-row">
        ${[
          ["cases", "查看相似案例"],
          ["causes", "分析问题原因"],
          ["roles", "切换角色视角"],
          ["check", "检查方案合理性"],
          ["transfer", "迁移到新场景"],
        ]
          .map(([action, label]) => `<button class="soft-btn ${selectedAction === action ? "active" : ""}" data-scenario-support-action="${action}" ${canUseSupport ? "" : "disabled"}>${label}</button>`)
          .join("")}
      </div>
      ${canUseSupport ? renderScenarioSupportOutput(scenario, selectedAction, input) : `<p class="muted">填写上面三个初步想法后，情境应用伙伴会根据当前任务给出追问、案例和迁移提示。</p>`}
    </section>
  `;
}

function hasScenarioSupportInput(input) {
  return ["understanding", "difficulty", "direction"].every((key) => (input[key] || "").trim().length >= 4);
}

function scenarioSupportProfile(scenario) {
  const title = scenario.title;
  if (title.includes("双师课堂")) {
    return {
      focus: "资源公平、本地教师角色、学生设备条件、学习共同体",
      cases: ["中国人民大学附属中学双师教学项目：远程名师与本地教师协同，关键不是直播本身，而是本地教师如何组织互动与巩固。", "北京市中学教师开放型在线辅导计划：通过网络连接优秀教师资源，同时保留本地学习支持与个别化辅导。"],
      roles: ["城市教师：提供优质教学内容，但需要理解乡村学生基础。", "本地教师：组织课堂、观察学生、补充解释，是学习支持的关键角色。", "学生：设备条件、互动机会和学习共同体会影响参与。", "管理者：需要保障网络、课表、评价和教师协作机制。"],
      questions: ["这个方案是否考虑到本地教师的角色？", "双师课堂为什么不等于远程名师直播？", "如果学生设备条件不足，你的方案需要怎样调整？", "这个设计如何体现学习支持服务，而不仅仅是资源传递？", "如果把这个方案迁移到县域教师培训场景中，需要保留和调整哪些部分？"],
      transfer: "迁移到县域教师培训时，要保留“远程专家+本地支持者”的协同机制，同时调整成人教师的时间安排、实践任务和反馈方式。",
    };
  }
  if (title.includes("MOOC")) {
    return {
      focus: "学习动机、论坛互动、形成性评价、SPOC 支持",
      cases: ["MOOC 转 SPOC：把开放课程资源用于校内教学，线下课堂承担讨论、答疑和实践反馈。", "翻转课堂：线上完成基础知识学习，课堂中通过问题讨论和项目任务提升完成率。"],
      roles: ["课程教师：重构学习活动和形成性评价。", "助教：维护论坛互动，发现低参与学习者。", "校内学生：需要明确节奏和可见反馈。", "MOOC 学习者：需要低门槛参与和持续激励。"],
      questions: ["完成率低是内容难，还是学习支持不足？", "论坛互动为什么停留在“已学习”？", "形成性评价可以如何嵌入阶段学习过程？", "SPOC 支持应该承担哪些 MOOC 无法完成的功能？"],
      transfer: "迁移到成人在线课程时，要保留形成性评价和讨论支持，但调整为更弹性的学习时间和职业情境任务。",
    };
  }
  if (title.includes("县域教师")) {
    return {
      focus: "教师差异、培训路径、混合式支持、学习反馈",
      cases: ["县域教师数字化培训：可采用线上资源学习、直播答疑、校本实践和同伴互评组合。", "混合式教师研修：线上解决知识传递，线下或校本共同体解决实践转化。"],
      roles: ["教育局：关注覆盖率、质量和可持续机制。", "年轻教师：需要挑战性任务和展示机会。", "老教师：需要低门槛支持和稳定反馈。", "学校管理者：需要把培训成果转化到课堂改进。"],
      questions: ["教师差异会如何影响培训路径设计？", "哪些内容适合线上自学，哪些必须通过实践反馈完成？", "如何避免完成率高但课堂改进不明显？", "你的方案如何体现混合式支持，而不仅是视频学习？"],
      transfer: "迁移到乡村双师课堂时，要保留分层支持和实践反馈，但把学习对象从教师转为学生与本地教师共同体。",
    };
  }
  return {
    focus: "成人学习动机、学习支持、AI 助教边界、作品评价",
    cases: ["成人在线职业课程：用短任务、作品评价和导师反馈支持碎片化学习。", "企业导师参与的在线课程：通过真实工作任务连接知识学习和职业能力。"],
    roles: ["成人学习者：时间有限，需要即时反馈和可迁移任务。", "AI助教：提供提醒、答疑和表达支架，但不替代最终作品。", "人工教师：负责价值判断、评价和深度反馈。", "平台运营：关注留存、完成率和学习体验。"],
    questions: ["AI 助教应支持到什么程度，才不会削弱自主性？", "如何用作品证明能力，而不只看测验得分？", "微信群通知多但交流少，原因是什么？", "学习支持服务如何帮助成人学习者持续投入？"],
    transfer: "迁移到高校 MOOC 改造时，要保留作品评价和过程支持，同时加入校内 SPOC 的同伴互动与教师反馈。",
  };
}

function renderScenarioSupportOutput(scenario, action, input) {
  const profile = scenarioSupportProfile(scenario);
  const userBasis = `基于你的初步理解：“${trimText(input.understanding || "", 42)}”；关键困难：“${trimText(input.difficulty || "", 42)}”；解决方向：“${trimText(input.direction || "", 42)}”。`;
  const blocks = {
    cases: { title: "相似案例", items: profile.cases },
    causes: { title: "问题—原因—策略分析", items: [`现象是什么：${scenario.background[0] || "当前任务中存在明显问题情境。"}`, `原因可能是什么：${profile.focus} 是需要重点分析的因素。`, `可以怎么解决：先提出原则和证据，再设计可执行的学习支持策略。`] },
    roles: { title: "角色视角", items: profile.roles },
    check: { title: "方案合理性追问", items: profile.questions },
    transfer: { title: "知识迁移提示", items: [profile.transfer, "请思考：哪些设计原则可以保留？哪些条件变化后必须调整？"] },
  };
  const block = blocks[action] || blocks.cases;
  return `
    <div class="scenario-support-output">
      <strong>${block.title}</strong>
      <p class="muted">${userBasis} 情境应用伙伴会通过追问帮助你检查方案是否合理，请根据自己的理解进行修改。</p>
      <div class="record-list">
        ${block.items.map((item) => `<div class="record-item"><p>${escapeHtml(item)}</p></div>`).join("")}
      </div>
    </div>
  `;
}

function renderTaskPanel(section) {
  const scenario = taskScenarios[state.selectedScenario] || taskScenarios[0];
  return `
    <div class="task-workspace">
      <aside class="task-scenario-list">
        <h2>真实情境任务</h2>
        ${taskScenarios
          .map((item, index) => `<button class="scenario-btn ${state.selectedScenario === index ? "active" : ""}" data-scenario="${index}">
            <strong>${item.title}</strong><span>${item.subtitle}</span>
          </button>`)
          .join("")}
      </aside>
      <section class="task-detail">
        <p class="eyebrow">当前关联章节：${section.id} ${section.title}</p>
        <h2>${scenario.title}</h2>
        <p class="muted">${scenario.subtitle}</p>
        <div class="chip-row">${chip(`当前学习周期：${twoWeekCycleLabel(section)}`, "blue")}</div>
        <div class="chip-row">${scenario.knowledge.map((item, index) => chip(item, index % 3 === 0 ? "mint" : index % 3 === 1 ? "blue" : "coral")).join("")}</div>
        <section class="panel-lite task-companion-entry">
          <div>
            <h3>AI学伴触发提示</h3>
            <p class="muted">任务表现页会由概念理解伙伴和任务规划伙伴提供阶段支持。你可以重新打开中心提示查看复习或规划建议。</p>
          </div>
          <button class="soft-btn" data-open-task-companion="true">查看提示</button>
        </section>

        <div class="grid two" style="margin-top:16px">
          <section class="card">
            <h3>情境背景</h3>
            <div class="timeline">
              ${scenario.background.map((item, index) => `<div class="timeline-item"><time>${index + 1}</time><div>${item}</div></div>`).join("")}
            </div>
          </section>
          <section class="card">
            <h3>需要回应的问题</h3>
            <div class="checklist">
              ${scenario.questions.map((item) => `<label><input type="checkbox"> ${item}</label>`).join("")}
            </div>
          </section>
        </div>

        <section class="card task-breakdown-card" style="margin-top:16px">
          <h3>任务规划伙伴 · 任务拆解面板</h3>
          <div class="stage-list">
            ${["第一步：理解任务要求", "第二步：回顾相关概念", "第三步：阅读材料并提取观点", "第四步：完成任务文本或讨论发言", "第五步：检查并提交"].map((stage) => `<button class="stage-item">${stage}</button>`).join("")}
          </div>
        </section>

        ${renderScenarioPartnerPanel(section, scenario)}

        <div class="grid two" style="margin-top:16px">
          <section class="card">
            <h3>角色视角</h3>
            <div class="role-grid">
              ${scenario.roles.map((role) => `<div class="role-card"><strong>${role}</strong><p class="muted">关注点、限制条件、可提供资源</p></div>`).join("")}
            </div>
          </section>
          <section class="card">
            <h3>任务推进</h3>
            <div class="stage-list">
              ${["理解情境", "分析问题", "交流观点", "补充证据", "设计方案", "小组修改", "提交成果"].map((stage, index) => `<button class="stage-item ${index === 1 ? "active" : ""}">${stage}</button>`).join("")}
            </div>
            <div class="progress" style="margin-top:14px"><span style="width:42%"></span></div>
          </section>
        </div>

        ${renderCollaborativeTaskWorkspace(section)}

        <section class="card" style="margin-top:16px">
          <h3>任务表现记录与分析</h3>
          <div class="grid four">
            <div class="metric"><strong>迁移</strong><span>是否能把概念用于真实方案设计</span></div>
            <div class="metric"><strong>表达</strong><span>观点是否明确，理由是否充分</span></div>
            <div class="metric"><strong>回应</strong><span>是否补充、质疑、回应同伴</span></div>
            <div class="metric"><strong>协调</strong><span>是否整合观点并推动共识</span></div>
          </div>
        </section>
      </section>
    </div>
  `;
}

function renderCollaborativeTaskWorkspace(section) {
  const doc = collaborativeDoc(section);
  const groupRoles = contributionRoles(section);
  const messages = groupMessages(section);
  return `
    <section class="card collaborative-doc" style="margin-top:16px">
      <div class="collab-head">
        <div>
          <h3>多人协作任务成果文档</h3>
          <p class="muted">同一份任务成果由小组成员共同编辑，系统记录编辑次数、贡献比例和是否根据 AI 提示修改。</p>
        </div>
        <div class="presence-row">
          ${groupRoles.map((item) => `<span class="avatar mini" title="${item.name}">${item.name.replace("学习者 ", "")}</span>`).join("")}
        </div>
      </div>
      <div class="grid two">
        <section>
          <h3>协作文档</h3>
          <textarea class="editor collab-editor" id="collab-editor" placeholder="小组共同编辑：先写出问题分析，再补充资源证据、真实案例、方案设计和评价方式。">${escapeHtml(doc.content || "")}</textarea>
          <div class="doc-meta">
            <span>正在编辑：${doc.activeEditors.join("、")}</span>
            <span>已保存 ${doc.editCount || 0} 次</span>
            <span>字数埋点：${doc.wordCount || 0}</span>
            <span>最近编辑：${doc.lastEditor || "暂无"} ${doc.lastEditedAt || ""}</span>
          </div>
        </section>
        <section>
          <h3>分工与贡献</h3>
          <div class="contribution-list">
            ${groupRoles
              .map(
                (item) => `
              <div class="contribution-item">
                <strong>${item.name}</strong>
                <span>${item.role}</span>
                <div class="progress"><span style="width:${item.percent}%"></span></div>
                <small>${item.percent}%</small>
              </div>`,
              )
              .join("")}
            <p class="muted small-note">本地原型根据编辑次数、文本长度和案例补充痕迹估算贡献；接入后台后可替换为真实协作记录。</p>
          </div>
          <h3 style="margin-top:16px">方案合理性评价</h3>
          <div class="checklist">
            <label><input type="checkbox"> 回应了任务中的核心问题</label>
            <label><input type="checkbox"> 引用了相关理论或知识点</label>
            <label><input type="checkbox"> 考虑了不同角色需求</label>
            <label><input type="checkbox"> 方案具有现实可行性</label>
            <label><input type="checkbox"> 根据讨论结果完成修改</label>
          </div>
        </section>
      </div>
      <section class="group-discussion">
        <h3>小组讨论区 · AI教师在场</h3>
        <div class="ig-thread" id="group-thread">
          ${messages.map(renderGroupMessage).join("")}
        </div>
        <form class="group-message-form" id="group-message-form">
          <textarea id="group-message-input" placeholder="在小组内提出观点、回应同伴或请求 AI教师引导。"></textarea>
          <button class="soft-btn" type="submit">发送到小组</button>
        </form>
      </section>
    </section>
  `;
}

function collaborativeDoc(section) {
  const key = taskStateKey(section);
  const existing = state.collaborativeDocs[key] || {};
  const content = existing.content || "";
  return {
    content,
    editCount: existing.editCount || 0,
    lastEditor: existing.lastEditor || "",
    lastEditedAt: existing.lastEditedAt || "",
    activeEditors: content.length > 80 ? ["学习者 A", "学习者 C", state.user?.name || "我"] : ["学习者 A", "学习者 C"],
    wordCount: content.trim().length,
  };
}

function contributionRoles(section) {
  const doc = collaborativeDoc(section);
  const hasCase = /案例|例如|比如|场景|学校|课程|学生|教师/.test(doc.content);
  const weights = [
    { name: "学习者 A", role: "资料整理", weight: 30 + Math.min(12, doc.editCount) },
    { name: "学习者 B", role: "案例补充", weight: 22 + (hasCase ? 12 : 0) },
    { name: "学习者 C", role: "观点整合", weight: 28 + (doc.wordCount > 120 ? 8 : 0) },
    { name: "学习者 D", role: "最终修改", weight: 20 + (doc.wordCount > 220 ? 6 : 0) },
  ];
  const total = weights.reduce((sum, item) => sum + item.weight, 0);
  return weights.map((item) => ({ ...item, percent: Math.round((item.weight / total) * 100) }));
}

function groupMessages(section) {
  const key = groupStateKey(section);
  if (state.groupMessages[key]?.length) return state.groupMessages[key];
  return [
    {
      role: "teacher",
      author: "AI教师",
      content: "我会观察小组讨论：当观点值得展开、案例不足或有人不知道怎么说时，会用温和问题帮助大家继续推进。",
      time: "系统提示",
      reason: "协作学习支持已开启",
    },
  ];
}

function renderGroupMessage(message) {
  const isMine = message.role === "me";
  const isTeacher = message.role === "teacher";
  const avatar = isTeacher ? "师" : (message.author || "我").replace("学习者 ", "").slice(0, 1);
  return `
    <article class="ig-message ${isMine ? "mine" : ""} ${isTeacher ? "teacher" : ""}">
      <span class="avatar mini">${avatar}</span>
      <div class="ig-message-body">
        <div class="ig-message-meta">
          <strong>${escapeHtml(message.author || "我")}</strong>
          <span>${escapeHtml(message.time || "")}</span>
        </div>
        <p>${escapeHtml(message.content || "")}</p>
        ${message.reason ? `<small>${escapeHtml(message.reason)}</small>` : ""}
      </div>
    </article>
  `;
}

function renderTaskCompanionDialog(section) {
  const scenario = taskScenarios[state.selectedScenario] || taskScenarios[0];
  const key = taskDialogKey(section);
  const mode = state.taskReviewMode[key] || "choice";
  qs("#task-companion-content").innerHTML = `
    <div class="task-companion-dialog-body">
      <div class="task-dialog-head">
        ${botFace("伴")}
        <div>
          <p class="eyebrow">AI学伴 · 动态触发</p>
          <h2>${mode === "review" ? "任务相关知识点复习" : "开始任务前的小提醒"}</h2>
          <p class="muted">当前任务：${scenario.title}</p>
        </div>
      </div>
      ${
        mode === "review"
          ? renderTaskKnowledgeReview(section, scenario)
          : `
        <div class="grid two">
          <section class="auto-cue task-open-cue">
            <strong>概念理解伙伴</strong>
            <p>开始任务前，要不要先复习一下这个任务涉及的核心概念？我会优先根据已有知识库和任务知识点生成复习卡片。</p>
            <div class="button-row">
              <button class="soft-btn" data-task-review-action="review">开始复习</button>
              <button class="ghost-btn" data-task-review-action="skip">直接进入任务</button>
            </div>
          </section>
          ${renderChapterTaskReminder(section)}
        </div>`
      }
    </div>
  `;
}

function openTaskCompanionDialog(section, force = false) {
  const dialog = qs("#task-companion-dialog");
  const key = taskDialogKey(section);
  if (!dialog || (!force && state.taskCompanionDialogs[key] === "dismissed")) return;
  renderTaskCompanionDialog(section);
  if (!dialog.open) dialog.showModal();
}

function closeTaskCompanionDialog() {
  const key = taskDialogKey(currentSection());
  state.taskCompanionDialogs[key] = "dismissed";
  save();
  qs("#task-companion-dialog")?.close();
}

function renderTaskKnowledgeReview(section, scenario) {
  const cards = scenario.knowledge.slice(0, 4).map((label) => buildKnowledgeReviewCard(label, scenario));
  const hasEvidence = cards.some((card) => card.evidence);
  return `
    <section class="knowledge-review">
      ${!state.knowledgeBaseText ? `<div class="auto-cue"><strong>资料读取中</strong><p>正在读取“data/knowledge/knowledge-base.md”。如果稍后仍未出现复习内容，说明本地资料未能被浏览器读取。</p></div>` : ""}
      ${!hasEvidence ? `<div class="auto-cue"><strong>资料不足提示</strong><p>当前知识库没有找到与该任务知识点足够匹配的解释片段。需要补充更明确的知识点说明后，才能生成可靠复习内容。</p></div>` : ""}
      <div class="review-card-grid">
        ${cards.map(renderKnowledgeReviewCard).join("")}
      </div>
      <div class="button-row">
        <button class="primary-btn" data-task-review-action="finish-review">完成复习，进入任务</button>
        <button class="ghost-btn" data-task-review-action="back-choice">返回选择</button>
      </div>
    </section>
  `;
}

function buildKnowledgeReviewCard(label, scenario) {
  const evidence = findKnowledgeEvidence(label);
  const example = scenario.background.find((item) => /学生|教师|平台|课程|学校|学习者|课堂/.test(item)) || "";
  return {
    label,
    evidence,
    concept: evidence ? trimText(evidence, 130) : "当前资料不足以生成该知识点的概念解释。",
    example: evidence && example ? example : "当前资料没有提供足够明确的任务例子，可补充案例库或章节资料后生成。",
    mistake: evidence ? `复习时注意不要只背概念名称，要说明它如何回应“${scenario.questions[0]}”。` : "当前资料不足以生成可靠易错点提醒。",
    summary: evidence ? `把“${label.replace(/^K\\d+\\s*/, "")}”和任务情境中的对象、问题、证据连接起来。` : "当前资料不足以生成学习小结。",
  };
}

function renderKnowledgeReviewCard(card) {
  return `
    <article class="review-card">
      <h3>${escapeHtml(card.label)}</h3>
      <div class="review-module"><strong>概念解释</strong><p>${escapeHtml(card.concept)}</p></div>
      <div class="review-module"><strong>具体例子</strong><p>${escapeHtml(card.example)}</p></div>
      <div class="review-module"><strong>易错点提醒</strong><p>${escapeHtml(card.mistake)}</p></div>
      <div class="review-module"><strong>学习小结</strong><p>${escapeHtml(card.summary)}</p></div>
      ${card.evidence ? `<small>依据：data/knowledge/knowledge-base.md 匹配片段</small>` : `<small>需要补充：该知识点的解释或案例材料</small>`}
    </article>
  `;
}

function findKnowledgeEvidence(label) {
  const text = state.knowledgeBaseText;
  if (!text) return "";
  const code = label.match(/^K\d+/)?.[0] || "";
  const base = label.replace(/^K\d+\s*/, "").trim();
  const searchMap = {
    K1: ["在线教育的内涵", "在线教育发展三阶段", "在线教育发展的三个阶段", "在线教育概念"],
    K3: ["联通主义学习理论", "在线学习理论", "复杂性特征"],
    K4: ["MOOC", "SPOC"],
    K5: ["OMO混合式教学内涵", "混合式教学阶段", "混合式学习"],
    K6: ["翻转课堂实施模型", "翻转课堂"],
    K7: ["在线课程开发流程", "课程设计"],
    K8: ["在线教学交互设计", "教学交互"],
    K9: ["学习支持服务", "在线学习支持"],
    K10: ["在线教学评价", "精准评价"],
    K11: ["质量保证", "在线教育质量"],
    K12: ["在线教育技术", "云平台", "人工智能"],
  };
  const candidates = [base, ...(searchMap[code] || [])].filter(Boolean);
  for (const candidate of candidates) {
    const index = text.indexOf(candidate);
    if (index >= 0) return cleanKnowledgeSnippet(text.slice(Math.max(0, index - 80), index + 520));
  }
  return "";
}

function cleanKnowledgeSnippet(text) {
  return text
    .replaceAll("\\&\\#34;", "\"")
    .replaceAll("\\&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

function trimText(text, maxLength) {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function chapterDeadline(sectionId) {
  const start = new Date("2026-06-29T23:59:00+08:00");
  start.setDate(start.getDate() + (Number(sectionId) - 1) * 14);
  return start;
}

function renderChapterTaskReminder(section) {
  const deadline = chapterDeadline(section.id);
  const now = new Date();
  const diffDays = Math.ceil((deadline - now) / 86400000);
  const tasks = chapterTasks(section);
  const completed = completedChapterTasks(section).length;
  if (completed === tasks.length) {
    return `<div class="auto-cue encouragement-cue"><strong>任务规划伙伴</strong><p>你已经完成本章学习任务啦！可以回顾一下本章的核心收获，再进入下一阶段学习。</p></div>`;
  }
  if (diffDays <= 3 && diffDays >= 0) {
    return `<div class="auto-cue planner-cue"><strong>任务规划伙伴</strong><p>本章任务还有 ${diffDays || "不到 1"} 天截止，可以先检查一下 PPT、教材和讨论发帖是否都完成啦。</p><span class="chip">截止：${deadline.toLocaleDateString("zh-CN")}</span></div>`;
  }
  return `<div class="auto-cue planner-cue"><strong>任务规划伙伴</strong><p>当前学习周期：${twoWeekCycleLabel(section)}。建议先完成资源阅读，再整理观点并完成讨论发帖。</p><span class="chip">截止：${deadline.toLocaleDateString("zh-CN")}</span></div>`;
}

function chapterTasks(section) {
  const resources = resourceMap[section.id] || [];
  const hasReading = resources.some((item) => item.label.includes("阅读"));
  return ["看完 PPT", "看完教材", ...(hasReading ? ["看完阅读材料"] : []), "在讨论区完成发帖"];
}

function completedChapterTasks(section) {
  const selected = Number.isInteger(state.selectedResources[section.id]) ? ["看完 PPT"] : [];
  const posts = state.discussionPosts[section.id] || [];
  if (posts.length) selected.push("在讨论区完成发帖");
  return selected;
}

function renderDynamicPanel() {
  const p = profile();
  const agent = agentInfo[state.matchedAgent] || agentInfo[p.mainAgent];
  const dimensions = dynamicDimensionValues();
  const adjustmentStatus = state.supportAdjustmentStatus[supportAdjustmentKey()] || "等待学习者确认";
  return `
    <div class="dynamic-head">
      <div>
        <p class="eyebrow">当前学习周期：${twoWeekCycleLabel()} · 每两周更新</p>
        <h2>反馈更新</h2>
        <p class="muted">系统每两周汇总一次学习行为、任务表现、社会互动和 AI 互动数据，并更新学习者画像与 AI 学伴支持策略。</p>
      </div>
      <div class="metric strong-metric"><strong>${agent.name}</strong><span>当前增强支持</span></div>
    </div>
    <section class="panel-lite feedback-loop">
      <h3>反馈更新闭环</h3>
      <div class="loop-steps">
        ${["数据采集", "画像更新", "支持再匹配", "学习者确认"].map((step, index) => `<div class="loop-step ${index === 3 ? "active" : ""}"><strong>${index + 1}</strong><span>${step}</span></div>`).join("")}
      </div>
      <p class="muted">当前确认状态：${adjustmentStatus}。学习者可以在“本两周学习阶段报告”中接受、暂缓或修改系统推荐的支持方式。</p>
    </section>
    <div class="grid four">
      ${dimensions
        .map(
          (item, index) => `
          <div class="metric">
            <strong>${item.score}%</strong>
            <span>${item.name}</span>
            <div class="progress"><span style="width:${item.score}%"></span></div>
          </div>`,
        )
        .join("")}
    </div>
    <div class="grid two" style="margin-top:16px">
      <section>
        <h2>数据来源</h2>
        <div class="record-list">
          ${dimensions.map((item) => `<div class="record-item"><strong>${item.name}</strong><p>${item.sources}</p><span class="muted">${item.signal}</span></div>`).join("")}
        </div>
      </section>
      <section>
        <h2>阶段诊断规则</h2>
        <div class="timeline">
          <div class="timeline-item"><time>概念</time><div>视频学习完成但测验低、概念复述弱时，增强概念理解伙伴。</div></div>
          <div class="timeline-item"><time>任务</time><div>多次临近截止提交、阶段完成不稳定时，增强任务规划伙伴。</div></div>
          <div class="timeline-item"><time>互动</time><div>任务质量较高但讨论少时，增加共同讨论伙伴和低压力表达任务。</div></div>
          <div class="timeline-item"><time>迁移</time><div>互动活跃但成果缺少结构和证据时，情境应用伙伴提供案例补充提示。</div></div>
        </div>
      </section>
    </div>
    ${renderTelemetryPanel()}
  `;
}

function renderTelemetryPanel() {
  const section = currentSection();
  const telemetry = chapterTelemetry(section.id);
  const metrics = [
    ["PPT 是否打开", telemetry.pptOpened ? "是" : "待观察"],
    ["PDF/教材是否打开", telemetry.pdfOpened ? "是" : "待观察"],
    ["AI 学伴提问次数", String(Object.values(state.sectionMessages).flat().filter((item) => item.role === "user").length + state.agentMessages.filter((item) => item.role === "user").length)],
    ["是否反复询问概念", conceptQuestionCount(section) >= 3 ? "已触发" : "未触发"],
    ["讨论发帖数量", String((state.discussionPosts[section.id] || []).length)],
    ["AI 教师介入次数", String(telemetry.aiTeacherInterventions || 1)],
  ];
  return `
    <section class="panel telemetry-panel" style="margin-top:16px">
      <h2>学习者数据埋点预留</h2>
      <div class="grid three">
        ${metrics.map(([label, value]) => `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`).join("")}
      </div>
      <div class="record-list" style="margin-top:12px">
        <div class="record-item"><strong>资源学习数据</strong><p>PPT/PDF/教材是否打开、浏览时长、阅读材料是否完成。</p></div>
        <div class="record-item"><strong>AI 对话数据</strong><p>是否使用 AI 学伴、使用哪一类、提问次数、是否反复询问同一概念、AI 建议是否被采纳。</p></div>
        <div class="record-item"><strong>任务表现数据</strong><p>是否打开任务表现、编辑时长、文本字数、是否补充案例、是否根据 AI 提示修改。</p></div>
        <div class="record-item"><strong>讨论互动与协作数据</strong><p>进入讨论区后是否发言、是否先与 AI 学伴对话再发帖、回复数量、分工、贡献比例、AI 教师介入原因。</p></div>
      </div>
    </section>
  `;
}

function chapterTelemetry(sectionId) {
  return state.telemetry[sectionId] || {};
}

function updateTelemetry(sectionId, patch) {
  state.telemetry[sectionId] = { ...chapterTelemetry(sectionId), ...patch };
}

function resourceTelemetryPatch(resource) {
  const label = resource?.label || "";
  const patch = {
    lastResourceOpened: label,
    lastResourceOpenedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
  };
  if (/PPT|第\d章-|第[一二三四五六七八]章-在线/.test(label)) patch.pptOpened = true;
  if (/PDF|教材/.test(label)) patch.pdfOpened = true;
  if (/教材/.test(label)) patch.textbookOpened = true;
  if (/阅读材料/.test(label)) patch.readingCompleted = true;
  return patch;
}

function dynamicDimensionValues() {
  const answered = answeredDimensionCount();
  const sectionQuestionCount = Object.values(state.sectionMessages).flat().filter((item) => item.role === "user").length;
  const discussionCount = Object.values(state.discussionPosts).flat().length;
  const agentQuestionCount = state.agentMessages.filter((item) => item.role === "user").length;
  const progress = progressPercent();
  return dynamicDimensions.map((item) => {
    let score = item.score;
    if (item.name === "知识理解") score = Math.min(96, 35 + answered * 8 + sectionQuestionCount * 6);
    if (item.name === "任务过程") score = Math.min(96, 28 + progress * 0.45 + agentQuestionCount * 8);
    if (item.name === "社会互动") score = Math.min(96, 30 + discussionCount * 14);
    if (item.name === "能力发展") score = Math.min(96, 32 + progress * 0.28 + discussionCount * 6 + agentQuestionCount * 5);
    return { ...item, score: Math.round(score) };
  });
}

function renderLoginDialog() {
  qs("#login-content").innerHTML = `
    <form class="login-card" id="login-form">
      <p class="eyebrow">学习者登录 / 注册</p>
      <h2>进入你的个人学习空间</h2>
      <label>姓名<input id="login-name" required placeholder="请输入姓名"></label>
      <label>身份<select id="login-role"><option>本科生</option><option>研究生</option><option>教师学习者</option><option>成人学习者</option></select></label>
      <label>学习目标<textarea id="login-goal" placeholder="例如：掌握在线教育原理，并能完成课程设计任务。"></textarea></label>
      <button class="primary-btn" type="submit">进入平台</button>
    </form>
  `;
}

function renderProfileDialog() {
  const p = profile();
  const agent = agentInfo[state.matchedAgent] || agentInfo.concept;
  qs("#profile-content").innerHTML = `
    <div class="profile-detail">
      <div class="profile-hero">
        <span class="avatar large">${state.user?.name ? state.user.name.slice(0, 1) : "人"}</span>
        <div>
          <p class="eyebrow">学习者个人中心</p>
          <h2>${state.user?.name || "未登录学习者"}</h2>
          <p class="muted">${state.user?.role || "未设置身份"} · ${state.user?.goal || "暂未填写学习目标"}</p>
        </div>
      </div>
      <div class="grid three">
        <div class="metric"><strong>${progressPercent()}%</strong><span>课程学习进度</span></div>
        <div class="metric"><strong>${answeredDimensionCount()}/5</strong><span>差异识别完成度</span></div>
        <div class="metric"><strong>${agent.name}</strong><span>当前匹配AI学伴</span></div>
      </div>
      <section class="panel-lite">
        <h3>识别差异结果</h3>
        <div class="chip-row">${p.traits.map((trait) => chip(`${trait.dimension}：${trait.value}`, trait.agent === "scenario" ? "blue" : trait.agent === "discussion" ? "coral" : "mint")).join("")}</div>
      </section>
      ${renderProfileRadar()}
      <div class="button-row">
        <button class="primary-btn" id="open-weekly-report">本两周学习阶段报告</button>
        <button class="primary-btn" id="profile-start-test">重新识别差异</button>
        <button class="ghost-btn" id="logout-user">退出登录</button>
      </div>
    </div>
  `;
}

function progressPercent() {
  const sections = allSections();
  const currentIndex = Math.max(0, sections.findIndex((item) => item.id === state.selectedSection));
  return Math.round(((currentIndex + 1) / sections.length) * 100);
}

function openLogin() {
  renderLoginDialog();
  qs("#login-dialog").showModal();
}

function openProfile() {
  renderProfileDialog();
  qs("#profile-dialog").showModal();
}

function openWeeklyReport() {
  renderWeeklyReportDialog();
  qs("#weekly-report-dialog").showModal();
}

function renderWeeklyReportDialog() {
  const p = profile();
  const agent = agentInfo[state.matchedAgent] || agentInfo[p.mainAgent];
  const dimensions = dynamicDimensionValues();
  const strongest = [...dimensions].sort((a, b) => b.score - a.score)[0];
  const weakest = [...dimensions].sort((a, b) => a.score - b.score)[0];
  const radar = profileRadarValues();
  const topTrait = [...radar].sort((a, b) => b.value - a.value)[0];
  const section = currentSection();
  const telemetry = chapterTelemetry(section.id);
  const aiCount = Object.values(state.sectionMessages).flat().filter((item) => item.role === "user").length + state.agentMessages.filter((item) => item.role === "user").length;
  const discussionCount = Object.values(state.discussionPosts).flat().length;
  const groupCount = Object.values(state.groupMessages).flat().filter((item) => item.role === "me").length;
  const docEdits = Object.values(state.collaborativeDocs).reduce((sum, item) => sum + (item.editCount || 0), 0);
  const adjustmentStatus = state.supportAdjustmentStatus[supportAdjustmentKey(section)] || "等待确认";
  qs("#weekly-report-content").innerHTML = `
    <div class="weekly-report">
      <div class="weekly-report-head">
        <div>
          <p class="eyebrow">当前学习周期：${twoWeekCycleLabel(section)}</p>
          <h2>本两周学习阶段报告</h2>
          <p class="muted">${state.user?.name || "学习者"} · 当前章节：第 ${section.id} 章 · 生成时间：${nowText()}</p>
        </div>
        ${botFace("周")}
      </div>
      <section class="panel-lite feedback-loop">
        <h3>数据采集—画像更新—支持再匹配—学习者确认</h3>
        <div class="loop-steps">
          ${["数据采集", "画像更新", "支持再匹配", "学习者确认"].map((step, index) => `<div class="loop-step ${index === 3 ? "active" : ""}"><strong>${index + 1}</strong><span>${step}</span></div>`).join("")}
        </div>
        <p class="muted">根据你本两周的任务完成、讨论参与和 AI 互动情况，系统判断你在知识迁移方面需要更多支持，建议增加情境应用伙伴的提示频率。</p>
      </section>
      <div class="grid two">
        <section class="report-block">
          <h3>本两周学习优势</h3>
          <p>${strongest.name}表现相对突出，当前估计为 ${strongest.score}%。${discussionCount + groupCount > 0 ? "你已经开始通过讨论和小组协作表达观点。" : "资源学习和任务推进已有基础，可以继续增加讨论互动。"}</p>
        </section>
        <section class="report-block">
          <h3>本两周主要困难</h3>
          <p>${weakest.name}仍需要关注，当前估计为 ${weakest.score}%。${aiCount > 0 ? "从 AI 学伴使用记录看，你已经开始主动求助。" : "本两周 AI 学伴使用较少，遇到概念或任务卡点时可以先向学伴提问。"}</p>
        </section>
        <section class="report-block">
          <h3>画像变化</h3>
          <p>初始识别中“${topTrait.name}”维度最明显，当前特征为“${topTrait.label}”。反馈更新会继续结合资源打开、讨论发帖、任务编辑和 AI 对话记录更新画像。</p>
        </section>
        <section class="report-block">
          <h3>AI 支持调整</h3>
          <p>当前优先支持为“${agent.name}”。${telemetry.taskConceptReviewChoice ? `任务表现中已记录：${telemetry.taskConceptReviewChoice}。` : "建议在任务表现中先查看概念复习或任务拆解提示。"}</p>
        </section>
      </div>
      <section class="report-block">
        <h3>下一步学习建议</h3>
        <div class="timeline">
          ${weeklySuggestions({ weakest, aiCount, discussionCount, groupCount, docEdits }).map((item, index) => `<div class="timeline-item"><time>${index + 1}</time><div>${item}</div></div>`).join("")}
        </div>
      </section>
      <section class="report-data-strip">
        <div class="metric"><strong>${aiCount}</strong><span>AI 学伴提问</span></div>
        <div class="metric"><strong>${discussionCount}</strong><span>章节讨论发帖</span></div>
        <div class="metric"><strong>${groupCount}</strong><span>小组消息</span></div>
        <div class="metric"><strong>${docEdits}</strong><span>协作文档编辑</span></div>
      </section>
      <section class="report-block">
        <h3>学习者确认</h3>
        <p>当前状态：${adjustmentStatus}。你可以确认系统建议，也可以暂缓或提出希望修改的支持方式。</p>
        <div class="button-row" style="margin-top:12px">
          <button class="primary-btn" data-support-adjustment="accept">接受调整</button>
          <button class="ghost-btn" data-support-adjustment="pause">暂缓调整</button>
          <button class="soft-btn" data-support-adjustment="modify">我想修改支持方式</button>
        </div>
      </section>
    </div>
  `;
}

function weeklySuggestions({ weakest, aiCount, discussionCount, groupCount, docEdits }) {
  const suggestions = [];
  if (weakest.name === "社会互动") suggestions.push("本两周至少进入一次章节讨论区，先和共同讨论伙伴整理观点，再发布一条回应同学的帖子。");
  if (weakest.name === "任务过程") suggestions.push("把当前任务拆成 5 个阶段：理解要求、复习概念、提取材料观点、完成文本、检查提交。");
  if (weakest.name === "知识理解") suggestions.push("选择一个反复不清楚的概念，向概念理解伙伴连续追问，触发“概念—例子—易错点—小结”解释。");
  if (weakest.name === "能力发展") suggestions.push("在任务成果中补充一个真实教育场景，让情境应用伙伴帮助检查案例是否能支撑观点。");
  if (aiCount === 0) suggestions.push("遇到概念、任务或讨论表达卡点时，先向对应 AI 学伴提出一个具体问题。");
  if (discussionCount + groupCount === 0) suggestions.push("本两周还没有明显讨论互动记录，建议先在小组讨论区发一条 1-2 句话的初步判断。");
  if (docEdits === 0) suggestions.push("进入任务表现页，在协作文档中写下小组初稿，让系统记录你的协作贡献。");
  return suggestions.slice(0, 4);
}

function openTest(intro = true) {
  if (intro) renderTestIntro();
  else renderQuestion();
  qs("#test-dialog").showModal();
}

function renderTestIntro() {
  qs("#test-content").innerHTML = `
    <div class="test-layout">
      <div class="test-copy">
        <p class="eyebrow">AI学伴匹配测试</p>
        <h2>先了解你的学习习惯，再匹配更适合的 AI学伴。</h2>
        <p class="muted">测试包含 5 个维度、20 个量表项，不是考试。系统会根据 1-5 分评分生成初始学习者画像，你也可以确认、调整或重新测试。</p>
        <div class="button-row">
          <button class="primary-btn" id="begin-test">立即开始</button>
          <button class="ghost-btn" id="later-test">稍后完成</button>
        </div>
      </div>
      <div class="question-visual">
        <img src="public/images/学习动机触发因素识别页面.png" alt="AI学伴匹配测试插图">
      </div>
    </div>
  `;
}

function renderQuestion() {
  const question = questions[state.questionIndex];
  const answer = answerFor(question);
  qs("#test-content").innerHTML = `
    <div class="test-layout">
      <div class="question-visual">
        <img src="${question.image}" alt="${question.title}">
      </div>
      <div class="test-copy">
        <div class="test-progress">
          <p class="eyebrow">第 ${state.questionIndex + 1} / ${questions.length} 个维度</p>
          <div class="progress"><span style="width:${((state.questionIndex + 1) / questions.length) * 100}%"></span></div>
        </div>
        <h2>${question.question}</h2>
        <p class="muted">1 表示非常不符合，5 表示非常符合。完成本页 4 个评分后进入下一维度。</p>
        <div class="likert-list">
          ${question.items.map((item, index) => renderLikertItem(question, item, index, answer[item.id])).join("")}
        </div>
        <div class="button-row" style="margin-top:20px">
          <button class="ghost-btn" id="prev-question" ${state.questionIndex === 0 ? "disabled" : ""}>上一题</button>
          <button class="primary-btn" id="next-question" ${isQuestionAnswered(question) ? "" : "disabled"}>${state.questionIndex === questions.length - 1 ? "生成画像" : "下一题"}</button>
        </div>
      </div>
    </div>
  `;
}

function renderLikertItem(question, item, index, value) {
  return `
    <section class="likert-item">
      <div>
        <span class="option-code">${index + 1}</span>
        <strong>${item.text}</strong>
      </div>
      <div class="likert-scale" role="group" aria-label="${question.dimension}-${index + 1}">
        ${likertOptions
          .map(
            ([score, label]) => `
          <button class="likert-btn ${Number(value) === score ? "selected" : ""}" data-likert-item="${item.id}" data-likert-value="${score}" title="${label}">
            <span>${score}</span>
            <small>${label}</small>
          </button>`,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderTestResult() {
  syncMatchedAgent();
  const p = profile();
  const agent = agentInfo[state.matchedAgent];
  qs("#test-content").innerHTML = `
    <div class="test-layout">
      <div class="test-copy">
        <p class="eyebrow">初始学习者画像</p>
        <h2>推荐你优先使用：${agent.name}</h2>
        <p class="muted">系统根据五个维度的量表得分识别你的支持需求。你不是被固定为单一类型，后续会继续结合学习行为动态更新。</p>
        <div class="chip-row">${p.traits.map((trait) => chip(`${trait.dimension}：${trait.value}`, "mint")).join("")}</div>
        <div class="button-row" style="margin-top:20px">
          <button class="primary-btn" id="accept-result">这个结果比较符合我</button>
          <button class="ghost-btn" id="adjust-result">我想调整部分结果</button>
          <button class="ghost-btn" id="restart-result">重新测试</button>
        </div>
      </div>
      <div class="result-visual-stack">
        ${renderProfileRadar()}
        <div class="agent-showcase result-card">
          ${botFace(agent.code)}
          <div>
            <h2>${agent.name}</h2>
            <p>${agent.intro}</p>
            <p class="muted">${agent.callout}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function sendAgentMessage(message) {
  state.agentMessages.push({ role: "user", content: message });
  updateTelemetry(state.selectedSection, {
    usedMatchedCompanion: true,
    lastCompanionUsed: state.matchedAgent,
    matchedCompanionQuestions: (chapterTelemetry(state.selectedSection).matchedCompanionQuestions || 0) + 1,
  });
  renderApp();
  try {
    const response = await fetch("/api/coordinator-chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        learningContext: coordinatorLearningContext(),
        messages: state.agentMessages.map((item) => ({ role: item.role, content: item.content })),
      }),
    });
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || [data.error, data.setup].filter(Boolean).join("\n") || "AI 暂时没有返回内容。";
    if (data.coordinator) {
      state.coordinatorDecisions.push({
        ...data.coordinator,
        time: nowText(),
      });
      updateTelemetry(state.selectedSection, {
        coordinatorRoutedTo: data.coordinator.selectedAgent,
        coordinatorSecondaryAgent: data.coordinator.secondaryAgent || "",
        coordinatorReason: data.coordinator.reason || "",
      });
    }
    state.agentMessages.push({ role: "assistant", content, coordinator: data.coordinator || null });
  } catch (error) {
    state.agentMessages.push({ role: "assistant", content: `调用失败：${error.message}` });
  }
  save();
  renderApp();
}

async function sendSectionMessage(section, message) {
  const messages = state.sectionMessages[section.id] || [];
  messages.push({ role: "user", content: message });
  state.sectionMessages[section.id] = messages;
  const discussionMode = isDiscussionSelected(section);
  updateTelemetry(section.id, {
    usedSectionCompanion: true,
    lastCompanionUsed: discussionMode ? "discussion" : "concept",
    sectionCompanionQuestions: (chapterTelemetry(section.id).sectionCompanionQuestions || 0) + 1,
    talkedBeforeDiscussionPost: discussionMode ? true : chapterTelemetry(section.id).talkedBeforeDiscussionPost,
  });
  renderApp();
  try {
    const response = await fetch(discussionMode ? "/api/agent-chat" : "/api/section-chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        discussionMode
          ? {
              agentKey: "discussion",
              messages: [
                {
                  role: "user",
                  content: `当前章节讨论题：${section.discussion}\n请帮我整理讨论发言，但不要替我直接发布。\n\n学习者想法：${message}`,
                },
              ],
            }
          : { sectionId: section.id, sectionTitle: `${section.id} ${section.title}`, message },
      ),
    });
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || [data.error, data.setup].filter(Boolean).join("\n") || "AI 暂时没有返回内容。";
    messages.push({ role: "assistant", content });
  } catch (error) {
    messages.push({ role: "assistant", content: `调用失败：${error.message}` });
  }
  state.sectionMessages[section.id] = messages.slice(-20);
  save();
  renderApp();
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.section) {
    state.selectedSection = button.dataset.section;
    state.activeView = "section";
    state.activeTool = "overview";
    state.selectedResources[button.dataset.section] = 0;
    const firstResource = resourceMap[button.dataset.section]?.[0];
    if (firstResource) updateTelemetry(button.dataset.section, resourceTelemetryPatch(firstResource));
    renderApp();
  }
  if (button.dataset.resourceIndex) {
    const section = currentSection();
    const index = Number(button.dataset.resourceIndex);
    state.selectedResources[section.id] = index;
    updateTelemetry(section.id, resourceTelemetryPatch(resourceMap[section.id]?.[index]));
    save();
    renderApp();
  }
  if (button.dataset.discussionEntry) {
    const sectionId = button.dataset.discussionEntry;
    state.selectedSection = sectionId;
    state.activeView = "section";
    state.activeTool = "overview";
    state.selectedResources[sectionId] = "discussion";
    updateTelemetry(sectionId, {
      enteredDiscussion: true,
      discussionEnteredAt: Date.now(),
      noPostWithinOneMinute: !(state.discussionPosts[sectionId] || []).length,
    });
    save();
    renderApp();
  }
  if (button.dataset.chapter) {
    const chapterIndex = Number(button.dataset.chapter);
    if (state.expandedChapters.includes(chapterIndex)) {
      state.expandedChapters = state.expandedChapters.filter((item) => item !== chapterIndex);
    } else {
      state.expandedChapters = [...state.expandedChapters, chapterIndex];
    }
    renderApp();
  }
  if (button.dataset.tool) {
    state.activeView = "tool";
    state.activeTool = button.dataset.tool;
    if (button.dataset.tool === "tasks") updateTelemetry(state.selectedSection, { openedTaskPanel: true, taskOpenedAt: Date.now() });
    renderApp();
    if (button.dataset.tool === "tasks") openTaskCompanionDialog(currentSection());
  }
  if (button.id === "home-entry") {
    state.activeView = "home";
    state.activeTool = "overview";
    renderApp();
  }
  if (button.dataset.agent) {
    state.matchedAgent = button.dataset.agent;
    save();
    renderApp();
  }
  if (button.dataset.agentPrompt) {
    sendAgentMessage(button.dataset.agentPrompt);
  }
  if (button.dataset.scenario) {
    state.selectedScenario = Number(button.dataset.scenario);
    save();
    renderApp();
    if (qs("#task-companion-dialog")?.open) renderTaskCompanionDialog(currentSection());
  }
  if (button.dataset.scenarioSupportAction) {
    const section = currentSection();
    const key = taskStateKey(section);
    state.scenarioSupportActions[key] = button.dataset.scenarioSupportAction;
    updateTelemetry(section.id, {
      scenarioPartnerUsed: true,
      scenarioPartnerAction: button.textContent.trim(),
      lastCompanionUsed: "scenario",
    });
    save();
    renderApp();
  }
  if (button.dataset.triggerChoice) {
    const [key, ...valueParts] = button.dataset.triggerChoice.split(":");
    state.triggerState[key] = valueParts.join(":");
    if (key.startsWith("taskReview-")) updateTelemetry(key.replace("taskReview-", ""), { taskConceptReviewChoice: state.triggerState[key] });
    save();
    renderApp();
  }
  if (button.dataset.openTaskCompanion) {
    state.taskCompanionDialogs[taskDialogKey(currentSection())] = "active";
    save();
    openTaskCompanionDialog(currentSection(), true);
  }
  if (button.id === "close-task-companion") {
    closeTaskCompanionDialog();
  }
  if (button.dataset.taskReviewAction) {
    const key = taskDialogKey(currentSection());
    const action = button.dataset.taskReviewAction;
    if (action === "review") {
      state.taskReviewMode[key] = "review";
      updateTelemetry(state.selectedSection, { taskConceptReviewChoice: "开始复习" });
      save();
      renderTaskCompanionDialog(currentSection());
    }
    if (action === "skip" || action === "finish-review") {
      state.taskReviewMode[key] = action === "skip" ? "skip" : "reviewed";
      state.taskCompanionDialogs[key] = "dismissed";
      updateTelemetry(state.selectedSection, { taskConceptReviewChoice: action === "skip" ? "直接进入任务" : "已完成复习" });
      save();
      qs("#task-companion-dialog")?.close();
    }
    if (action === "back-choice") {
      state.taskReviewMode[key] = "choice";
      save();
      renderTaskCompanionDialog(currentSection());
    }
  }
  if (button.id === "profile-entry") {
    if (!state.user) openLogin();
    else openProfile();
  }
  if (button.id === "open-weekly-report") {
    openWeeklyReport();
  }
  if (button.id === "home-start-test" && answeredDimensionCount() === questions.length) {
    openProfile();
  }
  if (button.id === "open-test-top" || button.id === "profile-start-test" || (button.id === "home-start-test" && answeredDimensionCount() < questions.length)) {
    qs("#profile-dialog")?.close();
    openTest(true);
  }
  if (button.id === "close-test" || button.id === "later-test") qs("#test-dialog").close();
  if (button.id === "close-login") qs("#login-dialog").close();
  if (button.id === "close-profile") qs("#profile-dialog").close();
  if (button.id === "close-weekly-report") qs("#weekly-report-dialog").close();
  if (button.dataset.supportAdjustment) {
    const key = supportAdjustmentKey(currentSection());
    const labelMap = { accept: "已接受调整", pause: "已暂缓调整", modify: "希望修改支持方式" };
    state.supportAdjustmentStatus[key] = labelMap[button.dataset.supportAdjustment] || "已记录";
    save();
    renderWeeklyReportDialog();
  }
  if (button.id === "begin-test") {
    state.questionIndex = 0;
    renderQuestion();
  }
  if (button.id === "prev-question" && state.questionIndex > 0) {
    state.questionIndex -= 1;
    renderQuestion();
  }
  if (button.dataset.likertItem) {
    const question = questions[state.questionIndex];
    const current = answerFor(question);
    state.answers[question.id] = {
      ...current,
      [button.dataset.likertItem]: Number(button.dataset.likertValue),
    };
    save();
    renderQuestion();
  }
  if (button.id === "next-question") {
    const question = questions[state.questionIndex];
    if (!isQuestionAnswered(question)) return;
    if (state.questionIndex < questions.length - 1) {
      state.questionIndex += 1;
      renderQuestion();
    } else {
      syncMatchedAgent();
      save();
      renderTestResult();
      renderApp();
    }
  }
  if (button.id === "accept-result") {
    qs("#test-dialog").close();
    state.activeView = "tool";
    state.activeTool = "agent";
    renderApp();
  }
  if (button.id === "adjust-result") {
    state.questionIndex = 0;
    renderQuestion();
  }
  if (button.id === "restart-result") {
    state.answers = {};
    state.questionIndex = 0;
    save();
    renderQuestion();
  }
  if (button.id === "logout-user") {
    state.user = null;
    save();
    qs("#profile-dialog").close();
    renderApp();
    openLogin();
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "login-form") {
    event.preventDefault();
    state.user = {
      name: qs("#login-name").value.trim(),
      role: qs("#login-role").value,
      goal: qs("#login-goal").value.trim(),
    };
    state.activeView = "home";
    save();
    qs("#login-dialog").close();
    renderApp();
    if (answeredDimensionCount() < questions.length) {
      openTest(true);
    }
  }
  if (event.target.id === "agent-chat-form") {
    event.preventDefault();
    const input = qs("#agent-chat-input");
    const message = input.value.trim();
    if (!message) return;
    input.value = "";
    sendAgentMessage(message);
  }
  if (event.target.id === "section-chat-form") {
    event.preventDefault();
    const input = qs("#section-chat-input");
    const message = input.value.trim();
    if (!message) return;
    input.value = "";
    sendSectionMessage(currentSection(), message);
  }
  if (event.target.id === "chapter-discussion-form") {
    event.preventDefault();
    const input = qs("#chapter-discussion-input");
    const content = input.value.trim();
    if (!content) return;
    const section = currentSection();
    if (needsCaseCue(content)) {
      state.triggerState[`scenarioCue-${section.id}`] = true;
    }
    updateTelemetry(section.id, {
      postedDiscussion: true,
      discussionPostCount: (chapterTelemetry(section.id).discussionPostCount || 0) + 1,
      noPostWithinOneMinute: false,
      scenarioCueTriggered: needsCaseCue(content) || chapterTelemetry(section.id).scenarioCueTriggered,
    });
    const posts = state.discussionPosts[section.id] || [];
    posts.unshift({
      author: state.user?.name || "我",
      content,
      time: new Date().toLocaleString("zh-CN", { hour12: false }),
    });
    state.discussionPosts[section.id] = posts;
    input.value = "";
    save();
    renderApp();
  }
  if (event.target.id === "case-supplement-form") {
    event.preventDefault();
    const input = qs("#case-supplement-input");
    const content = input.value.trim();
    if (!content) return;
    const section = currentSection();
    const posts = state.discussionPosts[section.id] || [];
    posts.unshift({
      author: state.user?.name || "我",
      content: `补充案例：${content}`,
      time: new Date().toLocaleString("zh-CN", { hour12: false }),
    });
    state.discussionPosts[section.id] = posts;
    state.triggerState[`scenarioCue-${section.id}`] = false;
    updateTelemetry(section.id, {
      supplementedCase: true,
      adoptedAiSuggestion: true,
      discussionPostCount: (chapterTelemetry(section.id).discussionPostCount || 0) + 1,
    });
    input.value = "";
    save();
    renderApp();
  }
  if (event.target.id === "group-message-form") {
    event.preventDefault();
    const input = qs("#group-message-input");
    const content = input.value.trim();
    if (!content) return;
    const section = currentSection();
    const key = groupStateKey(section);
    const messages = groupMessages(section);
    messages.push({
      role: "me",
      author: state.user?.name || "我",
      content,
      time: nowText(),
    });
    const teacherMessage = aiTeacherIntervention(content);
    if (teacherMessage) messages.push(teacherMessage);
    state.groupMessages[key] = messages;
    input.value = "";
    updateTelemetry(section.id, {
      groupReplyCount: (chapterTelemetry(section.id).groupReplyCount || 0) + 1,
      aiTeacherInterventions: (chapterTelemetry(section.id).aiTeacherInterventions || 0) + (teacherMessage ? 1 : 0),
      aiTeacherReason: teacherMessage?.reason || chapterTelemetry(section.id).aiTeacherReason,
    });
    save();
    renderApp();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "collab-editor") {
    const section = currentSection();
    const key = taskStateKey(section);
    const existing = state.collaborativeDocs[key] || {};
    state.collaborativeDocs[key] = {
      ...existing,
      content: event.target.value,
      editCount: (existing.editCount || 0) + 1,
      lastEditor: state.user?.name || "我",
      lastEditedAt: nowText(),
    };
    updateTelemetry(section.id, {
      taskEditStarted: true,
      taskTextWords: event.target.value.trim() ? event.target.value.trim().length : 0,
      collaborativeEditCount: (chapterTelemetry(section.id).collaborativeEditCount || 0) + 1,
    });
    updateCollabMeta(section);
    save();
  }
  if (event.target.dataset.scenarioInput) {
    const section = currentSection();
    const key = taskStateKey(section);
    const existing = state.scenarioSupportInputs[key] || {};
    state.scenarioSupportInputs[key] = {
      ...existing,
      [event.target.dataset.scenarioInput]: event.target.value,
    };
    updateTelemetry(section.id, {
      scenarioThinkingStarted: true,
      scenarioThinkingFields: Object.values(state.scenarioSupportInputs[key]).filter((value) => String(value || "").trim()).length,
    });
    save();
    updateScenarioSupportControls(section);
  }
});

function updateScenarioSupportControls(section) {
  const input = state.scenarioSupportInputs[taskStateKey(section)] || {};
  const canUse = hasScenarioSupportInput(input);
  qsa("[data-scenario-support-action]").forEach((button) => {
    button.disabled = !canUse;
  });
}

function aiTeacherIntervention(content) {
  const base = { role: "teacher", author: "AI教师", time: nowText() };
  if (/自主性|主动支持|学习支持/.test(content)) {
    return {
      ...base,
      content: "你提到的“学习支持”和“自主性”关系很值得展开。能不能结合一个具体学习场景，说明支持到什么程度才合适？",
      reason: "介入原因：发现值得深入讨论的观点，并邀请相关学习者继续说明",
    };
  }
  if (/案例|例如|比如|场景/.test(content)) {
    return {
      ...base,
      content: "这个案例线索很好。小组可以继续补充：案例中的学习者是谁、遇到什么问题、在线教育支持具体解决了什么？",
      reason: "介入原因：推动案例从描述走向分析",
    };
  }
  if (/不会|不确定|不知道|没思路|怎么写/.test(content)) {
    return {
      ...base,
      content: "可以先不用追求完整答案。你可以先写一句判断，再补一个理由或例子，我会帮你们把它变成更清楚的讨论问题。",
      reason: "介入原因：支持不太愿意发言或不知道如何组织语言的学习者",
    };
  }
  return null;
}

function updateCollabMeta(section) {
  const doc = collaborativeDoc(section);
  const meta = qs(".doc-meta");
  if (!meta) return;
  meta.innerHTML = `
    <span>正在编辑：${doc.activeEditors.join("、")}</span>
    <span>已保存 ${doc.editCount || 0} 次</span>
    <span>字数埋点：${doc.wordCount || 0}</span>
    <span>最近编辑：${doc.lastEditor || "暂无"} ${doc.lastEditedAt || ""}</span>
  `;
}

fetchKnowledgeBase();
renderApp();
if (!state.user) openLogin();
