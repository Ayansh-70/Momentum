"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const crypto_1 = __importStar(require("crypto"));
const gemini_1 = require("./services/gemini");
const store_1 = require("./db/store");
const clock_1 = require("./utils/clock");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173"
}));
app.use(express_1.default.json());
const generateId = () => crypto_1.default.randomBytes(16).toString('hex');
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, rawInput, deadline } = req.body;
        if (!title || !deadline) {
            return res.status(400).json({ error: 'Title and deadline are required' });
        }
        const decomposed = await (0, gemini_1.decomposeTask)(title, rawInput || '', deadline, (0, clock_1.getNow)());
        const taskId = generateId();
        // Process sub-steps
        const subSteps = decomposed.subSteps.map((step, index) => {
            let artifact = null;
            if (index === 0 && decomposed.starterArtifact) {
                artifact = {
                    id: generateId(),
                    type: decomposed.starterArtifact.type,
                    title: decomposed.starterArtifact.title,
                    content: decomposed.starterArtifact.content,
                    generatedAt: (0, clock_1.getNow)(),
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
        const newTask = {
            id: taskId,
            title,
            rawInput: rawInput || '',
            deadline,
            createdAt: (0, clock_1.getNow)(),
            effortEstimateMins: decomposed.effortEstimateMins,
            category: decomposed.category,
            status: "active",
            riskState: "calm",
            riskReason: "",
            lastRiskCheckAt: (0, clock_1.getNow)(),
            subSteps,
            artifacts: [], // other artifacts
            chatHistory: [],
            replanHistory: []
        };
        const savedTask = (0, store_1.createTask)(newTask);
        res.json(savedTask);
    }
    catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});
app.get('/api/tasks', (req, res) => {
    res.json((0, store_1.getTasks)());
});
app.post("/api/tasks/:id/risk", async (req, res) => {
    try {
        const task = (0, store_1.getTaskById)(req.params.id);
        if (!task)
            return res.status(404).json({ error: "Task not found" });
        const now = Date.now();
        const deadlineMs = new Date(task.deadline).getTime();
        const time_left_hours = Math.max(0, (deadlineMs - now) / 3_600_000);
        const hours_since_last_touched = task.lastTouchedAt
            ? (now - new Date(task.lastTouchedAt).getTime()) / 3_600_000
            : 24;
        const assessment = await (0, gemini_1.riskAssess)({
            task_title: task.title,
            total_effort_hours: task.effortEstimateMins / 60,
            time_left_hours,
            substeps_total: task.subSteps.length,
            substeps_completed: task.subSteps.filter((s) => s.status === 'done').length,
            hours_since_last_touched,
            user_velocity_profile: task.velocityProfile ?? "unknown",
        });
        (0, store_1.updateTask)(req.params.id, {
            riskState: assessment.risk_state,
            riskReason: assessment.reasoning,
            lastRiskCheckAt: new Date().toISOString()
        });
        res.json(assessment);
    }
    catch (err) {
        console.error("riskAssess error:", err);
        res.status(500).json({ error: "Risk assessment failed" });
    }
});
app.post("/api/replan", async (req, res) => {
    try {
        const { triggered_by } = req.body;
        const allTasks = (0, store_1.getAllTasks)();
        const task_queue = allTasks
            .filter((t) => t.status !== 'completed')
            .map((t) => ({
            id: t.id,
            title: t.title,
            deadline: t.deadline,
            effort_hours_remaining: (t.effortEstimateMins / 60) *
                (1 - t.subSteps.filter((s) => s.status === 'done').length / t.subSteps.length),
            priority: t.priority ?? "medium",
            substeps: t.subSteps.map((s) => ({
                label: s.title,
                completed: s.status === 'done',
            })),
        }));
        const replan = await (0, gemini_1.cascadeReplan)({
            triggered_by,
            current_time_iso: new Date().toISOString(),
            task_queue,
        });
        res.json(replan);
    }
    catch (err) {
        console.error("cascadeReplan error:", err);
        res.status(500).json({ error: "Replan failed" });
    }
});
app.post("/api/tasks/:id/artifact", async (req, res) => {
    try {
        const task = (0, store_1.getTaskById)(req.params.id);
        if (!task)
            return res.status(404).json({ error: "Task not found" });
        const { substep_index, artifact_type = "auto" } = req.body;
        if (substep_index === undefined || substep_index === null) {
            return res.status(400).json({ error: "substep_index is required" });
        }
        const substep = task.subSteps[substep_index];
        if (!substep) {
            return res.status(404).json({ error: "Substep not found at given index" });
        }
        const artifactResp = await (0, gemini_1.generateArtifact)({
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
            id: (0, crypto_1.randomUUID)(),
            type: artifactResp.artifact_type,
            title: artifactResp.substep_label,
            content: artifactResp.artifact_markdown,
            generatedAt: new Date().toISOString(),
            approvedByUser: false
        };
        (0, store_1.updateTask)(req.params.id, {
            subSteps: task.subSteps,
            lastTouchedAt: new Date().toISOString()
        });
        res.json(artifactResp);
    }
    catch (err) {
        console.error("generateArtifact error:", err);
        res.status(500).json({ error: "Artifact generation failed" });
    }
});
app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const success = (0, store_1.deleteTask)(req.params.id);
        if (!success)
            return res.status(404).json({ error: "Task not found" });
        res.json({ success: true });
    }
    catch (err) {
        console.error("Delete task error:", err);
        res.status(500).json({ error: "Failed to delete task" });
    }
});
app.patch("/api/tasks/:id", async (req, res) => {
    try {
        const patch = req.body;
        const updatedTask = (0, store_1.updateTask)(req.params.id, patch);
        if (!updatedTask)
            return res.status(404).json({ error: "Task not found" });
        res.json(updatedTask);
    }
    catch (err) {
        console.error("Patch task error:", err);
        res.status(500).json({ error: "Failed to update task" });
    }
});
// Clock toggle endpoints
app.post('/api/clock/simulate', (req, res) => {
    const { time } = req.body;
    if (!time)
        return res.status(400).json({ error: "time is required" });
    (0, clock_1.setSimulatedTime)(time);
    res.json({ message: "Simulated time set", currentTime: (0, clock_1.getNow)() });
});
app.post('/api/clock/real', (req, res) => {
    (0, clock_1.clearSimulatedTime)();
    res.json({ message: "Real time restored", currentTime: (0, clock_1.getNow)() });
});
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const allTasks = (0, store_1.getAllTasks)();
        const result = await (0, gemini_1.agentChat)({
            message,
            tasks: allTasks,
            current_time_iso: new Date().toISOString()
        });
        res.json({ reply: result.reply });
    }
    catch (error) {
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
//# sourceMappingURL=index.js.map