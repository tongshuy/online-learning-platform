# 知伴学境 - 在线学习平台

**知伴学境** is an AI-supported online learning platform prototype designed for the course **Online Education Principles**. The platform combines learner profiling, adaptive AI companions, chapter-based learning resources, scenario tasks, collaborative discussion, and learning analytics to support personalized online learning.

## Live Demo

Netlify deployment:

[https://zhibanxuejing-online-learning.netlify.app/](https://zhibanxuejing-online-learning.netlify.app/)

## Project Highlights

- Learner profiling based on a five-dimensional diagnostic test.
- Adaptive matching with four AI learning companions.
- Chapter-based course navigation with PPT/PDF learning resources.
- RAG-style chapter Q&A based on course resource excerpts.
- Scenario-based learning tasks that emphasize knowledge transfer.
- Collaborative task workspace with shared writing, contribution tracking, and group discussion.
- AI-supported discussion and an AI teacher intervention prototype.
- Biweekly feedback update flow for learner profile adjustment and learning support rematching.
- Serverless deployment with Netlify Functions for secure AI API proxying.

## Core Features

### 1. Learner Diagnosis

The platform starts with an initial learner diagnostic activity. Learners answer Likert-scale questions across five dimensions, and the system generates a visual learner profile to support personalized learning companion matching.

### 2. AI Learning Companions

The platform includes four role-specific AI companions:

- **Concept Understanding Companion**: explains concepts with examples, misconceptions, and summaries.
- **Task Planning Companion**: helps learners break down tasks, manage progress, and prepare submissions.
- **Scenario Application Companion**: supports knowledge transfer from abstract concepts to real-world educational scenarios.
- **Collaborative Discussion Companion**: helps learners organize ideas before participating in discussion.

The AI companions are designed as learning scaffolds rather than answer generators. Learners are encouraged to think first, write initial ideas, and then request AI support.

### 3. Chapter-Based Learning Resources

Course materials are organized by chapter. Each chapter can include PPT files, textbook readings, extended reading materials, and discussion topics. The selected resource is previewed in the main workspace.

### 4. RAG-Style Knowledge Q&A

Each chapter has a dedicated knowledge Q&A area. The AI response is constrained by the selected chapter and the corresponding resource index. If the available course materials are insufficient, the system is designed to state that limitation instead of fabricating content.

### 5. Task Performance and Collaboration

The task module includes scenario tasks, planning support, collaborative writing, learner role division, contribution indicators, group discussion, and AI teacher prompts. It demonstrates how AI can be embedded into task-based and collaborative online learning.

### 6. Feedback Update

The platform models a two-week learning feedback cycle:

```text
Data collection -> Learner profile update -> AI support rematching -> Learner confirmation
```

The feedback report includes learning strengths, major difficulties, profile changes, AI support adjustment, and next-step recommendations.

## Tech Stack

- **Frontend**: HTML, CSS, vanilla JavaScript
- **Local backend**: Node.js native HTTP server
- **AI integration**: DeepSeek Chat Completions API
- **Serverless backend**: Netlify Functions
- **Deployment**: Netlify
- **Data format**: JSON
- **Client-side persistence**: localStorage
- **Testing and debugging**: Node syntax checks, curl-based API verification

## Project Structure

```text
.
├── app.js
├── index.html
├── styles.css
├── package.json
├── netlify.toml
├── scripts/
│   └── serve.mjs
├── netlify/
│   └── functions/
│       ├── agent-chat.js
│       ├── deepseek.js
│       ├── section-chat.js
│       └── lib/
│           └── deepseek-common.js
├── data/
│   ├── resourceIndex.json
│   └── resourceIndex.example.json
├── 教学资源/
└── 测试图片/
```

## Local Development

Clone the repository:

```bash
git clone https://github.com/tongshuy/online-learning-platform.git
cd online-learning-platform
```

Start the local server:

```bash
npm run start
```

The default local address is:

```text
http://localhost:5174
```

To use a different port:

```bash
PORT=5176 node scripts/serve.mjs
```

## AI Configuration

The frontend does not expose the DeepSeek API key. AI requests are sent through a backend proxy, either the local Node server or Netlify Functions.

For local development, create a `.env.local` file based on `.env.local.example`:

```text
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_MODEL=deepseek-chat
```

Restart the local server after updating environment variables.

For Netlify deployment, configure the same variables in:

```text
Netlify Site configuration -> Environment variables
```

Required variables:

```text
DEEPSEEK_API_KEY
DEEPSEEK_MODEL
```

## Deployment

This project can be deployed as a static site with Netlify Functions.

The `netlify.toml` file maps frontend API routes to serverless functions:

```text
/api/deepseek      -> /.netlify/functions/deepseek
/api/agent-chat   -> /.netlify/functions/agent-chat
/api/section-chat -> /.netlify/functions/section-chat
```

Before deploying, make sure the DeepSeek API key is configured as a Netlify environment variable.

## Security Notes

- Do not commit `.env.local`.
- Do not expose API keys in frontend JavaScript.
- Use server-side or serverless API routes to call external AI APIs.
- Rotate API keys if they are accidentally exposed.

## Status

This project is a functional prototype. Some learning analytics, collaboration data, and adaptive support logic are implemented as prototype-level interactions using localStorage and simulated behavioral data. The architecture leaves room for future integration with a real database, authentication system, vector database, or learning analytics backend.

## Author

Yang Tongshu
