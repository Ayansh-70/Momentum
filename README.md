# Momentum — AI Productivity Agent

> Your tasks, already done.

Momentum is an autonomous AI productivity agent powered by Gemini 
2.5 Flash. It doesn't remind you to work — it prepares the work 
before you even start.

Built solo for a hackathon in 6 days.

---

## Demo

> Live demo link: https://momentum-three-jet.vercel.app/

---

## What Makes It Different

Most productivity tools track tasks. Momentum thinks ahead of them.

The moment you add a task, four specialized AI agents activate:

| Agent | Trigger | What It Does |
|---|---|---|
| `decomposeTask` | On task creation | Breaks goal into 3–7 substeps, estimates effort, generates starter artifact |
| `riskAssess` | Continuously | Evaluates time left, completion %, inactivity — returns calm/watch/at_risk/critical |
| `cascadeReplan` | On critical state | Reshuffles entire task queue, returns before/after diff for one-tap approval |
| `generateArtifact` | On demand | Generates targeted outline/checklist/template for any specific substep |
| `agentChat` | On demand | Answers natural language questions about your full task queue |

---

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7

### Backend
- Node.js + Express
- JSON file store

### AI
- Gemini 2.5 Flash via `@google/genai`
- Structured JSON output via `responseSchema`
- Validated in Google AI Studio Playground

---

## Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   └── gemini.ts    # AI Agent Core (all 5 agents)
│   │   ├── index.ts         # Express server & API endpoints
│   │   └── types.ts         # Shared TypeScript interfaces
│   └── data.json            # Local JSON datastore
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── dashboard/   # Dashboard UI components
    │   ├── pages/
    │   │   └── LandingPage.tsx
    │   ├── App.tsx          # React Router setup
    │   ├── index.css        # Tailwind variables & glassmorphism styling
    │   └── types.ts         # Shared TypeScript interfaces
    └── vite.config.ts
```

---

## Agent Core — How It Works

### 1. decomposeTask()
Triggered once when a task is created. Takes the task title,
raw brain-dump context, and deadline. Returns structured JSON
with category, effort estimate, 3–7 ordered substeps with
calculated sub-deadlines, and a starter artifact for step one.

### 2. riskAssess()
Runs on every active task. Evaluates:
- Time remaining vs effort left
- Completion percentage
- Hours since last touched
- User velocity profile (fast_starter/steady/procrastinator/unknown)

Returns one of four states with reasoning and a replan suggestion flag.

### 3. cascadeReplan()
Triggered when any task hits critical. Evaluates the entire
active task queue holistically. Respects priority ordering,
shifts only what needs to move, returns a before/after diff
so the user can approve with one tap.

### 4. generateArtifact()
On-demand per substep. Uses the task's category, raw context,
and the specific substep label to generate a targeted markdown
artifact. Never generic — always built for that exact step.

### 5. agentChat()
Conversational interface over the full task queue. Answers
natural language questions with specific task names, risk
signals, and concrete recommendations.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task + run decomposeTask() |
| PATCH | `/api/tasks/:id` | Update task fields |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/tasks/:id/risk` | Run riskAssess() for a task |
| POST | `/api/tasks/:id/artifact` | Run generateArtifact() for a substep |
| POST | `/api/replan` | Run cascadeReplan() for full queue |
| POST | `/api/chat` | Run agentChat() with a message |
| POST | `/api/clock/simulate` | Simulate time for testing |
| POST | `/api/clock/real` | Reset to real time |

---

## Running Locally

### Prerequisites
- Node.js 18+
- A Gemini API key from Google AI Studio

### Backend
```bash
cd backend
npm install
echo "GEMINI_API_KEY=your_key_here" > .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env.local` file in the `frontend/` directory:
```
VITE_API_URL=http://localhost:3000
```

For production, set `VITE_API_URL` to your deployed 
backend URL in your hosting platform's environment 
variable settings.

Frontend runs on http://localhost:5173
Backend runs on http://localhost:3000

---

## Design System

- **Theme**: Dark glassmorphism ("Sentinel AI")
- **Font**: Sora (Google Fonts)
- **Accent**: Neon Violet `hsl(252, 100%, 68%)`
- **Effects**: backdrop-blur, glassmorphism cards, 
  neon glow focus rings, staggered fade-up animations
- **Background**: Slow-moving abstract dark particle video

---

## Google Technologies Used

- **Gemini 2.5 Flash** — powers all 5 agent functions
- **@google/genai SDK** — official Node.js client
- **Structured Output** — responseSchema for type-safe JSON
- **Google AI Studio** — used for prompt validation and 
  calibration of riskAssess before backend integration

---

## Built By

**Ayansh Sharma** — designed, architected, and built solo.

- GitHub: [Ayansh-70](https://github.com/Ayansh-70)
- LinkedIn: [Ayansh Sharma](https://www.linkedin.com/in/ayansh-sharma/)
- Email: ayanshsharma140011@gmail.com

---

*Built at hackathon · Powered by Gemini 2.5 Flash · Zero setup required*
