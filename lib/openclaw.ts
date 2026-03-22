import type { OpenClawAgent } from "./types";

export const OPENCLAW_AGENTS_DATA: OpenClawAgent[] = [
  { id: "script", name: "Script Writer", role: "Generates scene scripts & dialogue from prompts", accuracy: 94, consistency: 91, speed: 87, active: true, tasksRunning: 3, tasksCompleted: 1842, uptime: 99.8 },
  { id: "storyboard", name: "Storyboard Agent", role: "Converts scripts into visual shot sequences", accuracy: 89, consistency: 93, speed: 82, active: true, tasksRunning: 2, tasksCompleted: 1104, uptime: 99.5 },
  { id: "voice", name: "Voice Synthesizer", role: "Clones and generates character voices", accuracy: 96, consistency: 94, speed: 91, active: true, tasksRunning: 5, tasksCompleted: 3211, uptime: 99.9 },
  { id: "music", name: "Music Composer", role: "Generates adaptive scene soundtracks", accuracy: 88, consistency: 85, speed: 79, active: true, tasksRunning: 1, tasksCompleted: 892, uptime: 98.7 },
  { id: "bible", name: "Bible Keeper", role: "Maintains story continuity & lore consistency", accuracy: 97, consistency: 98, speed: 99, active: true, tasksRunning: 0, tasksCompleted: 4102, uptime: 100 },
  { id: "trend", name: "Trend Analyzer", role: "Monitors platform trends & audience signals", accuracy: 82, consistency: 79, speed: 95, active: true, tasksRunning: 1, tasksCompleted: 721, uptime: 99.1 },
  { id: "translate", name: "Translation Engine", role: "Multilingual dubbing with cultural adaptation", accuracy: 93, consistency: 90, speed: 84, active: true, tasksRunning: 0, tasksCompleted: 288, uptime: 97.4 },
  { id: "lipsync", name: "Lip Sync Engine", role: "Frame-accurate lip sync for translated audio", accuracy: 91, consistency: 88, speed: 76, active: true, tasksRunning: 0, tasksCompleted: 231, uptime: 97.2 },
  { id: "render", name: "Render Optimizer", role: "Schedules and optimizes GPU render jobs", accuracy: 99, consistency: 97, speed: 93, active: true, tasksRunning: 7, tasksCompleted: 5821, uptime: 99.9 },
];

export const OPENCLAW_SUMMARY = {
  activeAgents: OPENCLAW_AGENTS_DATA.filter(a => a.active).length,
  totalTasksRunning: OPENCLAW_AGENTS_DATA.reduce((s, a) => s + a.tasksRunning, 0),
  totalTasksCompleted: OPENCLAW_AGENTS_DATA.reduce((s, a) => s + a.tasksCompleted, 0),
  avgAccuracy: Math.round(OPENCLAW_AGENTS_DATA.reduce((s, a) => s + a.accuracy, 0) / OPENCLAW_AGENTS_DATA.length),
  avgUptime: parseFloat((OPENCLAW_AGENTS_DATA.reduce((s, a) => s + a.uptime, 0) / OPENCLAW_AGENTS_DATA.length).toFixed(1)),
};
