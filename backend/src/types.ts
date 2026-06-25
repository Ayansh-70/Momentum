export interface Task {
  id: string;
  title: string;
  rawInput: string;
  deadline: string; // ISO string
  createdAt: string; // ISO string
  effortEstimateMins: number;
  category: "assignment" | "bill" | "interview" | "meeting" | "custom";
  status: "active" | "completed" | "missed" | "archived";
  completedAt?: string;
  riskState?: "calm" | "watch" | "at_risk" | "critical";
  riskReason: string;
  lastRiskCheckAt: string; // ISO string
  subSteps: SubStep[];
  artifacts: Artifact[];
  chatHistory: ChatMessage[];
  replanHistory: ReplanEvent[];
  lastTouchedAt?: string;
  velocityProfile?: "fast_starter" | "steady" | "procrastinator" | "unknown";
  priority?: "high" | "medium" | "low";
}

export interface SubStep {
  id: string;
  taskId: string;
  title: string;
  order: number;
  subDeadline: string; // ISO string
  estimateMins: number;
  status: "pending" | "in_progress" | "done" | "skipped";
  touchedAt: string | null; // ISO string | null
  artifact: Artifact | null;
}

export interface Artifact {
  id: string;
  type: "outline" | "checklist" | "draft_email" | "info_summary" | "question_list" | "template";
  title: string;
  content: string; // markdown string
  generatedAt: string; // ISO string
  approvedByUser: boolean;
}

export interface ChatMessage {
  id: string;
  taskId: string;
  role: "user" | "agent" | "system";
  content: string;
  createdAt: string; // ISO string
  toolCalls: any[] | null;
}

export interface ReplanEvent {
  id: string;
  triggeredByTaskId: string;
  triggeredAt: string; // ISO string
  reason: string;
  beforeSnapshot: { taskId: string; subDeadlines: string[] }[];
  afterSnapshot: { taskId: string; subDeadlines: string[] }[];
  userApproved: boolean | null;
}
