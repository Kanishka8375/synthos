// ─── Project & Episode ────────────────────────────────────────────────────────

export type ProjectStatus = "Draft" | "In Progress" | "Rendering" | "Completed";
export type RenderStatus = "Queued" | "Rendering" | "Completed" | "Failed";
export type AgentStatus = "Waiting" | "Active" | "Completed" | "Error" | "idle";

export interface Project {
  id: string;
  title: string;
  genre: string;
  style: string;
  episodeCount: number;
  status: ProjectStatus;
  thumbnail: string;
  openclawEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  projectId: string;
  title: string;
  number: number;
  status: ProjectStatus;
  duration: string;
  progress: number;
}

// ─── Agent Pipeline ────────────────────────────────────────────────────────────

export interface PipelineStep {
  id: string;
  name: string;
  agent: string;
  status: AgentStatus;
  progress: number;
  duration?: string;
  output?: string;
}

// ─── Workflow Node ─────────────────────────────────────────────────────────────

export type NodeType =
  | "input"
  | "script"
  | "storyboard"
  | "diffusion"
  | "quality"
  | "voice"
  | "music"
  | "editor"
  | "render";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  status: AgentStatus | "idle";
  description: string;
}

export interface WorkflowEdge {
  from: string;
  to: string;
}

// ─── Character ─────────────────────────────────────────────────────────────────

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  emotionProfile: string;
  voiceType: string;
  consistency: number;
  memoryLocked: boolean;
  appearance: string;
  personality: string;
  avatarColor: string;
}

// ─── World / Location ──────────────────────────────────────────────────────────

export type LocationType = "interior" | "exterior" | "fantasy" | "urban" | "nature";
export type TimeOfDay = "Dawn" | "Day" | "Dusk" | "Night";

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  mood: string;
  timeOfDay: TimeOfDay;
  lighting: string;
  locked: boolean;
  description: string;
}

// ─── Emotion Choreography ──────────────────────────────────────────────────────

export type EmotionPreset = "Calm" | "Tense" | "Explosive" | "Melancholy" | "Comedic" | "Epic";

export interface EmotionMarker {
  id: string;
  label: string;
  position: number; // 0–100%
}

export interface EmotionChannel {
  id: string;
  name: string;
  value: number; // 0–100
  color: string;
}

// ─── Soundtrack ────────────────────────────────────────────────────────────────

export interface Track {
  id: string;
  title: string;
  mood: string;
  genre: string;
  duration: string;
  bpm: number;
  status: "Generating" | "Ready" | "Assigned";
  assignedTo?: string;
}

// ─── Render Queue ──────────────────────────────────────────────────────────────

export interface RenderJob {
  id: string;
  episode: string;
  resolution: string;
  gpu: string;
  eta: string;
  progress: number;
  status: RenderStatus;
  cost: string;
  priority: "high" | "normal" | "low";
}

// ─── Production Bible ──────────────────────────────────────────────────────────

export type BibleCategory = "Character" | "Location" | "Lore" | "Rules" | "Timeline" | "Palette";

export interface BibleEntry {
  id: string;
  category: BibleCategory;
  title: string;
  content: string;
  aiGenerated: boolean;
  locked: boolean;
}

// ─── Marketplace ──────────────────────────────────────────────────────────────

export type MarketCategory = "Workflows" | "Templates" | "Presets" | "Characters" | "Soundtracks";

export interface MarketItem {
  id: string;
  title: string;
  category: MarketCategory;
  creator: string;
  rating: number;
  downloads: number;
  price: number | "Free";
  tags: string[];
  description: string;
}

// ─── Trend Radar ──────────────────────────────────────────────────────────────

export type Platform = "TikTok" | "YouTube" | "Douyin" | "Instagram";

export interface Trend {
  id: string;
  title: string;
  platform: Platform;
  rank: number;
  growth: string;
  views: string;
  relevance: number;
  suggestedTemplate?: string;
}

// ─── Multilingual ─────────────────────────────────────────────────────────────

export interface Language {
  code: string;
  name: string;
  flag: string;
  voiceMatch: number;
  lipSync: number;
  status: "Pending" | "Processing" | "Complete" | "Error";
  progress: number;
  translated?: string;
}

// ─── OpenClaw Agent ───────────────────────────────────────────────────────────

export interface OpenClawAgent {
  id: string;
  name: string;
  role: string;
  accuracy: number;
  consistency: number;
  speed: number;
  active: boolean;
  tasksRunning: number;
  tasksCompleted: number;
  uptime: number;
}
