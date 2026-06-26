import express from 'express';
import cors from 'cors';
import crypto, { randomUUID as uuidv4 } from 'crypto';
import { decomposeTask, riskAssess, cascadeReplan, generateArtifact, agentChat } from './services/gemini';
import { createTask, getTasks, getTaskById, getAllTasks, updateTask, deleteTask } from './db/store';
import { getNow, setSimulatedTime, clearSimulatedTime } from './utils/clock';
import { Task, SubStep, Artifact } from './types';

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL ?? "http://localhost:5173"
}));
app.use(express.json());

const generateId = () => crypto.randomBytes(16).toString('hex');

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, rawInput, deadline } = req.body;
    if (!title || !deadline) {
      return res.status(400).json({ error: 'Title and deadline are required' });
    }

    const decomposed = await decomposeTask(title, rawInput || '', deadline, getNow());
    
    const taskId = generateId();
    
    // Process sub-steps
    const subSteps: SubStep[] = decomposed.subSteps.map((step: any, index: number) => {
      let artifact: Artifact | null = null;
      if (index === 0 && decomposed.starterArtifact) {
        artifact = {
          id: generateId(),
          type: decomposed.starterArtifact.type,
          title: decomposed.starterArtifact.title,
          content: decomposed.starterArtifact.content,
          generatedAt: getNow(),
          approvedByUser: false, // especially important for draft_email, false by default
        };
      }
      
      return {
        id: generateId(),
        taskId,
        title: step.title,
        order: index + 1,
        subDeadline: step.subDeadline,
        estimateMins: step.estimateMins,
        status: "pending",
        touchedAt: null,
        artifact
      };
    });

    const newTask: Task = {
      id: taskId,
      title,
      rawInput: rawInput || '',
      deadline,
      createdAt: getNow(),
      effortEstimateMins: decomposed.effortEstimateMins,
      category: decomposed.category,
      status: "active",
      riskState: "calm",
      riskReason: "",
      lastRiskCheckAt: getNow(),
      subSteps,
      artifacts: [], // other artifacts
      chatHistory: [],
      replanHistory: []
    };

    const savedTask = createTask(newTask);
    res.json(savedTask);
  } catch (error: any) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.get('/api/tasks', (req, res) => {
  res.json(getTasks());
});

app.post("/api/tasks/:id/risk", async (req, res) => {
  try {
    const task = getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const now = Date.now();
    const deadlineMs = new Date(task.deadline).getTime();
    const time_left_hours = Math.max(0, (deadlineMs - now) / 3_600_000);
    const hours_since_last_touched = task.lastTouchedAt
      ? (now - new Date(task.lastTouchedAt).getTime()) / 3_600_000
      : 24;

    const assessment = await riskAssess({
      task_title: task.title,
      total_effort_hours: task.effortEstimateMins / 60,
      time_left_hours,
      substeps_total: task.subSteps.length,
      substeps_completed: task.subSteps.filter((s: any) => s.status === 'done').length,
      hours_since_last_touched,
      user_velocity_profile: task.velocityProfile ?? "unknown",
    });

    updateTask(req.params.id, { 
      riskState: assessment.risk_state, 
      riskReason: assessment.reasoning,
      lastRiskCheckAt: new Date().toISOString()
    });
    res.json(assessment);
  } catch (err) {
    console.error("riskAssess error:", err);
    res.status(500).json({ error: "Risk assessment failed" });
  }
});

app.post("/api/replan", async (req, res) => {
  try {
    const { triggered_by } = req.body;
    const allTasks = getAllTasks();

    const task_queue = allTasks
      .filter((t: any) => t.status !== 'completed')
      .map((t: any) => ({
        id: t.id,
        title: t.title,
        deadline: t.deadline,
        effort_hours_remaining:
          (t.effortEstimateMins / 60) *
          (1 - t.subSteps.filter((s: any) => s.status === 'done').length / t.subSteps.length),
        priority: t.priority ?? "medium",
        substeps: t.subSteps.map((s: any) => ({
          label: s.title,
          completed: s.status === 'done',
        })),
      }));

    const replan = await cascadeReplan({
      triggered_by,
      current_time_iso: new Date().toISOString(),
      task_queue,
    });

    res.json(replan);
  } catch (err) {
    console.error("cascadeReplan error:", err);
    res.status(500).json({ error: "Replan failed" });
  }
});

app.post("/api/tasks/:id/artifact", async (req, res) => {
  try {
    const task = getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const { substep_index, artifact_type = "auto" } = req.body;

    if (substep_index === undefined || substep_index === null) {
      return res.status(400).json({ error: "substep_index is required" });
    }

    const substep = task.subSteps[substep_index];
    if (!substep) {
      return res.status(404).json({ error: "Substep not found at given index" });
    }

    const artifactResp = await generateArtifact({
      task_title: task.title,
      task_category: task.category ?? "custom",
      substep_label: substep.title,
      substep_index,
      total_substeps: task.subSteps.length,
      raw_context: task.rawInput ?? "",
      artifact_type,
    });

    // Persist the artifact back to the substep
    substep.artifact = {
      id: uuidv4(),
      type: artifactResp.artifact_type as any,
      title: artifactResp.substep_label,
      content: artifactResp.artifact_markdown,
      generatedAt: new Date().toISOString(),
      approvedByUser: false
    };
    
    updateTask(req.params.id, { 
      subSteps: task.subSteps,
      lastTouchedAt: new Date().toISOString()
    });

    res.json(artifactResp);
  } catch (err) {
    console.error("generateArtifact error:", err);
    res.status(500).json({ error: "Artifact generation failed" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const success = deleteTask(req.params.id);
    if (!success) return res.status(404).json({ error: "Task not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const patch = req.body;
    const updatedTask = updateTask(req.params.id, patch);
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.json(updatedTask);
  } catch (err) {
    console.error("Patch task error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Clock toggle endpoints
app.post('/api/clock/simulate', (req, res) => {
  const { time } = req.body;
  if (!time) return res.status(400).json({ error: "time is required" });
  setSimulatedTime(time);
  res.json({ message: "Simulated time set", currentTime: getNow() });
});

app.post('/api/clock/real', (req, res) => {
  clearSimulatedTime();
  res.json({ message: "Real time restored", currentTime: getNow() });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const allTasks = getAllTasks();
    const result = await agentChat({
      message,
      tasks: allTasks,
      current_time_iso: new Date().toISOString()
    });

    res.json({ reply: result.reply });
  } catch (error: any) {
    console.error("agentChat error:", error);
    if (error.status === 429) {
      return res.status(429).json({ error: "The Agent Core is currently unavailable due to Gemini API rate limits (15 requests per minute). Please wait a moment and try again." });
    }
    res.status(500).json({ error: "Agent Core failed to reply" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
