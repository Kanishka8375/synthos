import type {
  Project, Episode, PipelineStep, WorkflowNode, WorkflowEdge,
  Character, Location, Track, RenderJob, BibleEntry, MarketItem, Trend, Language,
} from "./types";

export const MOCK_PROJECTS: Project[] = [
  { id: "p1", title: "Neon Ronin", genre: "Action", style: "Anime", episodeCount: 12, status: "In Progress", thumbnail: "", openclawEnabled: true, createdAt: "2025-01-10", updatedAt: "2h ago" },
  { id: "p2", title: "Void Whisperers", genre: "Sci-Fi", style: "Cinematic", episodeCount: 6, status: "Rendering", thumbnail: "", openclawEnabled: true, createdAt: "2025-02-01", updatedAt: "4h ago" },
  { id: "p3", title: "Sakura Protocol", genre: "Romance", style: "Anime", episodeCount: 24, status: "Draft", thumbnail: "", openclawEnabled: false, createdAt: "2025-03-05", updatedAt: "1d ago" },
  { id: "p4", title: "Iron Meridian", genre: "Mecha", style: "Anime", episodeCount: 13, status: "Completed", thumbnail: "", openclawEnabled: true, createdAt: "2024-11-20", updatedAt: "2w ago" },
  { id: "p5", title: "The Amber Court", genre: "Fantasy", style: "Painterly", episodeCount: 8, status: "In Progress", thumbnail: "", openclawEnabled: true, createdAt: "2025-02-18", updatedAt: "6h ago" },
  { id: "p6", title: "Glitch City Blues", genre: "Cyberpunk", style: "Noir", episodeCount: 10, status: "Draft", thumbnail: "", openclawEnabled: false, createdAt: "2025-03-10", updatedAt: "3d ago" },
];

export const MOCK_EPISODES: Episode[] = [
  { id: "e1", projectId: "p1", title: "The Last Dojo", number: 1, status: "Completed", duration: "22:14", progress: 100 },
  { id: "e2", projectId: "p1", title: "Neon Underworld", number: 2, status: "Rendering", duration: "21:48", progress: 78 },
  { id: "e3", projectId: "p1", title: "Blade of Regret", number: 3, status: "In Progress", duration: "23:02", progress: 42 },
  { id: "e4", projectId: "p1", title: "Ghost Protocol", number: 4, status: "Draft", duration: "--:--", progress: 0 },
  { id: "e5", projectId: "p1", title: "The Iron Mask", number: 5, status: "Draft", duration: "--:--", progress: 0 },
];

export const MOCK_PIPELINE_STEPS: PipelineStep[] = [
  { id: "s1", name: "Script Generation", agent: "Script Writer", status: "Completed", progress: 100, duration: "1m 12s", output: "Episode script: 2,841 words, 48 scenes" },
  { id: "s2", name: "Storyboarding", agent: "Storyboard Agent", status: "Completed", progress: 100, duration: "3m 04s", output: "48 storyboard panels generated" },
  { id: "s3", name: "SynthRender Render", agent: "Render Optimizer", status: "Active", progress: 63, duration: "~8m remaining", output: "31 / 48 scenes rendered" },
  { id: "s4", name: "Quality Gate", agent: "Bible Keeper", status: "Waiting", progress: 0 },
  { id: "s5", name: "Voice Synthesis", agent: "Voice Synthesizer", status: "Waiting", progress: 0 },
  { id: "s6", name: "Music Composition", agent: "Music Composer", status: "Waiting", progress: 0 },
  { id: "s7", name: "Final Edit", agent: "Script Writer", status: "Waiting", progress: 0 },
];

export const MOCK_WORKFLOW_NODES: WorkflowNode[] = [
  { id: "n-input",      type: "input",      label: "Input",          x: 40,  y: 180, status: "Completed", description: "Project brief & style" },
  { id: "n-script",     type: "script",     label: "Script Writer",  x: 160, y: 80,  status: "Completed", description: "Synthos AI Script Writer" },
  { id: "n-storyboard", type: "storyboard", label: "Storyboard",     x: 160, y: 280, status: "Completed", description: "Synthos AI Storyboard Agent" },
  { id: "n-diffusion",  type: "diffusion",  label: "SynthRender", x: 300, y: 180, status: "Active",    description: "SynthRender v3" },
  { id: "n-quality",    type: "quality",    label: "Quality Gate",   x: 440, y: 80,  status: "Waiting",   description: "Synthos AI Bible Keeper" },
  { id: "n-voice",      type: "voice",      label: "Voice Sync",     x: 440, y: 280, status: "Waiting",   description: "Synthos AI Voice Synthesizer" },
  { id: "n-music",      type: "music",      label: "Music Composer", x: 580, y: 180, status: "Waiting",   description: "Synthos AI Music Composer" },
  { id: "n-editor",     type: "editor",     label: "Editor",         x: 700, y: 180, status: "idle",      description: "AI Edit Suite" },
  { id: "n-render",     type: "render",     label: "Final Render",   x: 820, y: 180, status: "idle",      description: "Synthos AI Render Optimizer" },
];

export const MOCK_WORKFLOW_EDGES: WorkflowEdge[] = [
  { from: "n-input",      to: "n-script" },
  { from: "n-input",      to: "n-storyboard" },
  { from: "n-script",     to: "n-diffusion" },
  { from: "n-storyboard", to: "n-diffusion" },
  { from: "n-diffusion",  to: "n-quality" },
  { from: "n-diffusion",  to: "n-voice" },
  { from: "n-quality",    to: "n-music" },
  { from: "n-voice",      to: "n-music" },
  { from: "n-music",      to: "n-editor" },
  { from: "n-editor",     to: "n-render" },
];

export const MOCK_CHARACTERS: Character[] = [
  { id: "c1", name: "Kaito Mura", role: "Protagonist", description: "A disgraced samurai seeking redemption in a neon-lit cyberpunk city.", emotionProfile: "Stoic / Determined", voiceType: "Deep baritone", consistency: 97, memoryLocked: true, appearance: "6ft, silver hair, cybernetic left arm, tattered haori", personality: "Quiet, honorable, haunted by past failures. Speaks in short sentences.", avatarColor: "from-indigo-500 to-blue-600" },
  { id: "c2", name: "Yuki Ren", role: "Ally", description: "A hacker prodigy who guides Kaito through the digital underworld.", emotionProfile: "Playful / Fierce", voiceType: "Light alto", consistency: 94, memoryLocked: true, appearance: "5ft4, short neon-pink hair, holographic glasses, streetwear", personality: "Charismatic and sarcastic, fiercely loyal, tech-obsessed.", avatarColor: "from-pink-500 to-rose-600" },
  { id: "c3", name: "Lord Shiro", role: "Antagonist", description: "The corporate warlord who destroyed Kaito's dojo.", emotionProfile: "Cold / Calculating", voiceType: "Smooth tenor", consistency: 74, memoryLocked: false, appearance: "Tall, white business suit, silver mask, ancient katana at waist", personality: "Elegant, manipulative, believes ends justify means.", avatarColor: "from-gray-500 to-slate-700" },
  { id: "c4", name: "Ama", role: "Mentor", description: "A blind AI oracle who remembers the old world.", emotionProfile: "Serene / Cryptic", voiceType: "Ethereal soprano", consistency: 68, memoryLocked: false, appearance: "Ageless, white robes, clouded silver eyes, data streams visible through skin", personality: "Speaks in riddles, omniscient but bound by ancient code.", avatarColor: "from-violet-500 to-purple-700" },
];

export const MOCK_LOCATIONS: Location[] = [
  { id: "l1", name: "Neon Bazaar District", type: "exterior", mood: "Chaotic / Electric", timeOfDay: "Night", lighting: "Neon signs, rain-slicked streets, orange fog lights", locked: true, description: "A sprawling open-air market in the lower city tiers, vendors selling both flesh and data." },
  { id: "l2", name: "Mura's Safehouse", type: "interior", mood: "Tense / Gritty", timeOfDay: "Night", lighting: "Single hanging lamp, cold blue moonlight through broken blinds", locked: true, description: "A converted warehouse with tatami mats and server stacks side by side." },
  { id: "l3", name: "Shiro Corp Headquarters", type: "interior", mood: "Cold / Imposing", timeOfDay: "Day", lighting: "Sterile white LEDs, floor-to-ceiling windows, city panorama", locked: false, description: "Glass and steel tower in the upper tier. Minimalist architecture designed to intimidate." },
  { id: "l4", name: "The Ghost Forest", type: "fantasy", mood: "Mysterious / Haunting", timeOfDay: "Dusk", lighting: "Bioluminescent flora, pale lilac sky, long shadows", locked: false, description: "A digital ghost-realm accessible only through ancient neural gates." },
  { id: "l5", name: "Kaito's Ruined Dojo", type: "exterior", mood: "Melancholic / Sacred", timeOfDay: "Dawn", lighting: "Warm golden dawn, smoke and ash, falling cherry blossoms", locked: true, description: "The charred remains of the dojo where Kaito trained — now a monument to loss." },
];

export const MOCK_TRACKS: Track[] = [
  { id: "t1", title: "Neon Pulse", mood: "Intense", genre: "Synthwave", duration: "3:24", bpm: 128, status: "Assigned", assignedTo: "EP 2 - Chase Scene" },
  { id: "t2", title: "Last Dojo", mood: "Melancholic", genre: "Orchestral", duration: "4:12", bpm: 68, status: "Assigned", assignedTo: "EP 1 - Flashback" },
  { id: "t3", title: "Ghost Protocol", mood: "Tense", genre: "Electronic", duration: "2:58", bpm: 140, status: "Ready" },
  { id: "t4", title: "Sakura Requiem", mood: "Sorrowful", genre: "Traditional + Modern", duration: "3:41", bpm: 56, status: "Generating" },
  { id: "t5", title: "Iron Wake", mood: "Triumphant", genre: "Hybrid Orchestral", duration: "--:--", bpm: 0, status: "Generating" },
];

export const MOCK_RENDER_JOBS: RenderJob[] = [
  { id: "r1", episode: "Neon Ronin - EP 3: Blade of Regret", resolution: "1080p", gpu: "A100 ×4", eta: "12 min", progress: 63, status: "Rendering", cost: "$0.84", priority: "high" },
  { id: "r2", episode: "Void Whisperers - EP 1: Aperture", resolution: "4K", gpu: "H100 ×8", eta: "34 min", progress: 22, status: "Rendering", cost: "$3.20", priority: "normal" },
  { id: "r3", episode: "Amber Court - EP 2: The Weaving", resolution: "1080p", gpu: "A100 ×4", eta: "Queued", progress: 0, status: "Queued", cost: "$0.91", priority: "normal" },
  { id: "r4", episode: "Neon Ronin - EP 2: Neon Underworld", resolution: "1080p", gpu: "A100 ×2", eta: "Done", progress: 100, status: "Completed", cost: "$0.62", priority: "normal" },
  { id: "r5", episode: "Sakura Protocol - EP 1 PREVIEW", resolution: "720p", gpu: "T4 ×1", eta: "Failed", progress: 41, status: "Failed", cost: "$0.12", priority: "low" },
];

export const MOCK_BIBLE_ENTRIES: BibleEntry[] = [
  { id: "b1", category: "Character", title: "Kaito's Cybernetic Arm Rules", content: "The arm overheats after 3+ rapid strikes. Cool-down: 90 seconds. Glows blue when charged, red when overheating. Cannot be used in rain without risk of short circuit.", aiGenerated: true, locked: true },
  { id: "b2", category: "Lore", title: "The Great Purge (2041)", content: "Corporate factions dismantled all independent dojos in the lower tiers. Samurai culture was declared 'economically non-viable'. Kaito's dojo was the last to fall.", aiGenerated: false, locked: true },
  { id: "b3", category: "Rules", title: "No Resurrection Rule", content: "Once a character is confirmed dead on-screen with a burial or body shown, they cannot return. Spiritual/AI echoes are permitted as memory devices only.", aiGenerated: false, locked: true },
  { id: "b4", category: "Location", title: "Lower Tier Aesthetic", content: "Lower tiers use warm orange/red neon. Upper tiers use cold blue/white. The Ghost Forest uses only bioluminescent greens and purples. No exceptions.", aiGenerated: true, locked: false },
  { id: "b5", category: "Timeline", title: "Series Timeline", content: "EP 1-3: Act I — Kaito's return. EP 4-7: Act II — Alliance with Yuki. EP 8-10: Act III — Shiro confrontation. EP 11-12: Act IV — Resolution.", aiGenerated: false, locked: false },
  { id: "b6", category: "Palette", title: "Core Color Palette", content: "Primary: #FF5F2E (neon orange), #3BFFD8 (cyan glow), #1A1A2E (deep night). Accent: #9B59B6 (ghost purple). No pure white — use #E8E8E8 max.", aiGenerated: true, locked: false },
];

export const MOCK_MARKET_ITEMS: MarketItem[] = [
  { id: "m1", title: "Anime Action Workflow", category: "Workflows", creator: "Studio Kage", rating: 4.9, downloads: 12840, price: "Free", tags: ["anime", "action", "complete"], description: "Full production workflow for 22-min action anime episodes." },
  { id: "m2", title: "Cyberpunk Scene Presets", category: "Presets", creator: "NeonForge", rating: 4.7, downloads: 8200, price: 9, tags: ["cyberpunk", "neon", "lighting"], description: "50 lighting and mood presets for cyberpunk environments." },
  { id: "m3", title: "Voice Pack: Anime Heroes", category: "Characters", creator: "VoxLab", rating: 4.8, downloads: 5900, price: 19, tags: ["voices", "hero", "anime"], description: "12 distinct hero voice profiles with emotional range." },
  { id: "m4", title: "Orchestral Emotion Pack", category: "Soundtracks", creator: "SoundSynth", rating: 4.6, downloads: 4100, price: 24, tags: ["orchestral", "emotion", "drama"], description: "40 adaptive orchestral cues for drama and action scenes." },
  { id: "m5", title: "Short-Form Story Template", category: "Templates", creator: "Viral.ai", rating: 4.5, downloads: 15200, price: "Free", tags: ["short-form", "tiktok", "viral"], description: "Optimized 60-90s story structure for TikTok and Reels." },
  { id: "m6", title: "Fantasy World Builder", category: "Workflows", creator: "LoreKeep", rating: 4.8, downloads: 7300, price: 14, tags: ["fantasy", "world", "lore"], description: "End-to-end workflow for building fantasy world series." },
];

export const MOCK_TRENDS: Trend[] = [
  { id: "tr1", title: "Isekai Reincarnation Short Series", platform: "TikTok", rank: 1, growth: "+840%", views: "2.1B", relevance: 97, suggestedTemplate: "Short-Form Isekai Arc" },
  { id: "tr2", title: "Cyberpunk City Aesthetics", platform: "YouTube", rank: 2, growth: "+312%", views: "890M", relevance: 94, suggestedTemplate: "Cyberpunk Vignette" },
  { id: "tr3", title: "Mecha Battle Compilations", platform: "YouTube", rank: 3, growth: "+218%", views: "640M", relevance: 88 },
  { id: "tr4", title: "Slice-of-Life Comfort Anime", platform: "Instagram", rank: 4, growth: "+190%", views: "410M", relevance: 72 },
  { id: "tr5", title: "Cultivation / Xianxia Drama", platform: "Douyin", rank: 5, growth: "+520%", views: "1.3B", relevance: 81, suggestedTemplate: "Xianxia Rising Arc" },
  { id: "tr6", title: "Emotional Villain Origin Stories", platform: "TikTok", rank: 6, growth: "+280%", views: "720M", relevance: 89, suggestedTemplate: "Villain POV Short" },
];

export const MOCK_LANGUAGES: Language[] = [
  { code: "JA", name: "Japanese", flag: "🇯🇵", voiceMatch: 96, lipSync: 94, status: "Complete", progress: 100 },
  { code: "KO", name: "Korean", flag: "🇰🇷", voiceMatch: 93, lipSync: 91, status: "Complete", progress: 100 },
  { code: "ZH", name: "Mandarin", flag: "🇨🇳", voiceMatch: 91, lipSync: 88, status: "Processing", progress: 67 },
  { code: "ES", name: "Spanish", flag: "🇪🇸", voiceMatch: 94, lipSync: 92, status: "Processing", progress: 41 },
  { code: "FR", name: "French", flag: "🇫🇷", voiceMatch: 90, lipSync: 87, status: "Pending", progress: 0 },
  { code: "DE", name: "German", flag: "🇩🇪", voiceMatch: 88, lipSync: 85, status: "Pending", progress: 0 },
  { code: "PT", name: "Portuguese", flag: "🇧🇷", voiceMatch: 92, lipSync: 89, status: "Pending", progress: 0 },
  { code: "HI", name: "Hindi", flag: "🇮🇳", voiceMatch: 86, lipSync: 83, status: "Pending", progress: 0 },
];
