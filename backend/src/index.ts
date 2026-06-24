import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'crypto'; // Actually, let's use standard node crypto or a simple random string for hackathon if no uuid
import crypto from 'crypto';
import { decomposeTask } from './services/gemini';
import { createTask, getTasks } from './db/store';
import { getNow, setSimulatedTime, clearSimulatedTime } from './utils/clock';
import { Task, SubStep, Artifact } from './types';

const app = express();
app.use(cors());
app.use(express.json());

const generateId = () => crypto.randomBytes(16).toString('hex');

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, rawInput, deadline } = req.body;
    if (!title || !deadline) {
      return res.status(400).json({ error: 'Title and deadline are required' });
    }

    const decomposed = await decomposeTask(title, rawInput || '', deadline);
    
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
