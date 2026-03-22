"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { SynthosBadge } from "@/components/ui/openclaw-badge";
import { MOCK_WORKFLOW_NODES, MOCK_WORKFLOW_EDGES } from "@/lib/mock-data";
import { Plus, Save, Play, RotateCcw, CheckCircle2, Wand2, X, Loader2, Image as ImageIcon, ChevronRight } from "lucide-react";

const nodeColors: Record<string, string> = {
  input:      "border-gray-500/50 bg-gray-500/10 text-gray-300",
  script:     "border-indigo-500/50 bg-indigo-500/15 text-indigo-300",
  storyboard: "border-violet-500/50 bg-violet-500/15 text-violet-300",
  diffusion:  "border-pink-500/50 bg-pink-500/15 text-pink-300",
  quality:    "border-amber-500/50 bg-amber-500/15 text-amber-300",
  voice:      "border-cyan-500/50 bg-cyan-500/15 text-cyan-300",
  music:      "border-emerald-500/50 bg-emerald-500/15 text-emerald-300",
  editor:     "border-blue-500/50 bg-blue-500/15 text-blue-300",
  render:     "border-rose-500/50 bg-rose-500/15 text-rose-300",
};

const statusDot: Record<string, string> = {
  Completed: "bg-emerald-400",
  Active:    "bg-indigo-400 animate-pulse",
  Waiting:   "bg-gray-600",
  idle:      "bg-gray-700",
  Error:     "bg-rose-400",
};

const NODE_W = 110;
const NODE_H = 56;

interface StoryboardFrame {
  scene: string;
  url: string | null;
  error?: string;
}

const DEFAULT_SCENES = [
  "Protagonist arrives at the neon-lit city gate, rain pouring, city glowing in the background",
  "Tense standoff in a dark alley, two figures face each other, holographic ads flicker above",
  "Emotional flashback — childhood memory in warm sunlit field, contrasts sharply with present",
  "Epic rooftop battle, lightning flashes, city skyline stretching to the horizon",
  "Quiet aftermath, protagonist alone on a rooftop ledge, looking at the damaged city below",
  "Final reveal scene — mysterious figure removes hood in dimly lit shrine room",
];

export default function WorkflowCanvasPage() {
  const [saved, setSaved]     = useState(false);
  const [running, setRunning] = useState(false);

  // Storyboard panel
  const [showStoryboard, setShowStoryboard]   = useState(false);
  const [scenes, setScenes]                   = useState<string[]>(DEFAULT_SCENES);
  const [generating, setGenerating]           = useState(false);
  const [frames, setFrames]                   = useState<StoryboardFrame[]>([]);
  const [genError, setGenError]               = useState("");
  const [style, setStyle]                     = useState("anime");

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleRun  = () => { if (running) return; setRunning(true); setTimeout(() => setRunning(false), 3000); };

  const edges = MOCK_WORKFLOW_EDGES.map((e) => {
    const from = MOCK_WORKFLOW_NODES.find(n => n.id === e.from)!;
    const to   = MOCK_WORKFLOW_NODES.find(n => n.id === e.to)!;
    const x1 = from.x + NODE_W;
    const y1 = from.y + NODE_H / 2;
    const x2 = to.x;
    const y2 = to.y + NODE_H / 2;
    const mx = (x1 + x2) / 2;
    return { ...e, d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}` };
  });

  const palette = [
    { label: "Script Writer", color: "border-indigo-500/40 text-indigo-300" },
    { label: "Storyboard",    color: "border-violet-500/40 text-violet-300" },
    { label: "Diffusion",     color: "border-pink-500/40 text-pink-300" },
    { label: "Voice Sync",    color: "border-cyan-500/40 text-cyan-300" },
    { label: "Music",         color: "border-emerald-500/40 text-emerald-300" },
    { label: "Filter",        color: "border-amber-500/40 text-amber-300" },
  ];

  const generateStoryboard = async () => {
    const activeScenes = scenes.filter(s => s.trim());
    if (!activeScenes.length) return;
    setGenerating(true);
    setGenError("");
    setFrames([]);

    try {
      const res = await fetch("/api/generate/storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenes: activeScenes.slice(0, 6), style }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Storyboard generation failed");
      setFrames(data.frames);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const updateScene = (i: number, val: string) =>
    setScenes(prev => prev.map((s, idx) => idx === i ? val : s));

  const addScene    = () => setScenes(prev => [...prev, ""]);
  const removeScene = (i: number) => setScenes(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <DashHeader title="Workflow Canvas" description="Visual node-based pipeline editor"
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => setShowStoryboard(true)}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
              <ImageIcon className="w-3.5 h-3.5" /> Storyboard
            </button>
            <button onClick={() => alert("Undo history — coming in v1.1")} className="glass glass-hover p-1.5 rounded-lg text-gray-400 hover:text-white" title="Undo"><RotateCcw className="w-3.5 h-3.5" /></button>
            <button onClick={handleSave} className="flex items-center gap-1.5 glass glass-hover text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs">
              {saved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? "Saved!" : "Save"}
            </button>
            <button onClick={handleRun} disabled={running}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
              {running
                ? <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Running…</>
                : <><Play className="w-3.5 h-3.5 fill-current" /> Run</>
              }
            </button>
          </div>
        }
      />

      {/* Storyboard Panel */}
      {showStoryboard && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/8">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-violet-400" /> AI Storyboard Generator
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Powered by SynthRender</p>
              </div>
              <button onClick={() => setShowStoryboard(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-5">
              {/* Style selector */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-gray-400 shrink-0">Art style:</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {["anime", "manga", "cinematic", "dark fantasy", "watercolor", "cyberpunk"].map(s => (
                    <button key={s} onClick={() => setStyle(s)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-colors capitalize ${
                        style === s
                          ? "bg-violet-600/20 text-violet-300 border-violet-500/30"
                          : "text-gray-500 glass glass-hover border-white/10 hover:text-white"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scene inputs */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-gray-400">Scenes ({scenes.filter(s => s.trim()).length}/6)</label>
                  <button onClick={addScene} disabled={scenes.length >= 6}
                    className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-40 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add scene
                  </button>
                </div>
                <div className="space-y-2">
                  {scenes.map((scene, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-5 shrink-0">{i + 1}.</span>
                      <input value={scene} onChange={e => updateScene(i, e.target.value)}
                        placeholder={`Scene ${i + 1} description…`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors" />
                      <button onClick={() => removeScene(i)} disabled={scenes.length <= 1}
                        className="text-gray-600 hover:text-rose-400 transition-colors disabled:opacity-30">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {genError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">{genError}</div>
              )}

              <button onClick={generateStoryboard}
                disabled={generating || !scenes.some(s => s.trim())}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all">
                {generating
                  ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Generating {scenes.filter(s => s.trim()).length} frames…</span>
                  : <span className="flex items-center justify-center gap-2"><Wand2 className="w-4 h-4" /> Generate Storyboard</span>
                }
              </button>

              {/* Generated frames */}
              {frames.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <p className="text-xs text-emerald-400">{frames.filter(f => f.url).length} frames generated</p>
                    <SynthosBadge label="SynthRender" size="sm" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {frames.map((frame, i) => (
                      <div key={i} className="glass rounded-xl overflow-hidden">
                        {frame.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={frame.url} alt={`Scene ${i + 1}`} className="w-full aspect-video object-cover" />
                        ) : (
                          <div className="w-full aspect-video bg-rose-500/10 flex items-center justify-center">
                            <p className="text-xs text-rose-400">Failed</p>
                          </div>
                        )}
                        <div className="p-2">
                          <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                            <span className="text-gray-400 font-medium">Scene {i + 1}:</span> {frame.scene}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setFrames([])}
                      className="flex-1 glass glass-hover text-gray-400 hover:text-white py-2 rounded-xl text-xs font-medium transition-all">
                      Clear frames
                    </button>
                    <button onClick={generateStoryboard}
                      className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" /> Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Node palette */}
        <div className="w-40 border-r border-white/8 bg-[#0a0a17] p-3 overflow-y-auto shrink-0">
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">Node Palette</p>
          <div className="space-y-1.5">
            {palette.map((p) => (
              <button key={p.label} onClick={() => alert(`Add "${p.label}" node — drag-and-drop editor coming in v1.1`)}
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs w-full text-left ${p.color} bg-white/[0.03] hover:bg-white/[0.06] transition-colors`}>
                <Plus className="w-3 h-3 opacity-50" />{p.label}
              </button>
            ))}
          </div>

          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mt-5 mb-2">AI Tools</p>
          <button onClick={() => setShowStoryboard(true)}
            className="flex items-center gap-2 p-2 rounded-lg border text-xs w-full text-left border-violet-500/40 text-violet-300 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <ImageIcon className="w-3 h-3" /> Storyboard
          </button>
          <button onClick={() => window.location.href = "/episode-pipeline"}
            className="flex items-center gap-2 p-2 rounded-lg border text-xs w-full text-left border-indigo-500/40 text-indigo-300 bg-white/[0.03] hover:bg-white/[0.06] transition-colors mt-1.5">
            <ChevronRight className="w-3 h-3" /> Script Gen
          </button>

          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mt-5 mb-2">Status</p>
          <div className="space-y-1.5 text-xs">
            {[["Completed","bg-emerald-400"],["Active","bg-indigo-400"],["Waiting","bg-gray-600"],["Error","bg-rose-400"]].map(([s,c]) => (
              <div key={s} className="flex items-center gap-2 text-gray-400">
                <span className={`w-2 h-2 rounded-full ${c}`} /> {s}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-[#07070f] relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <svg className="absolute top-0 left-0" width="1000" height="420" style={{ overflow: "visible" }}>
            {edges.map((e, i) => (
              <path key={i} d={e.d} fill="none" stroke="rgba(99,102,241,0.35)" strokeWidth="1.5" />
            ))}
          </svg>
          <div className="relative" style={{ width: 1000, height: 420 }}>
            {MOCK_WORKFLOW_NODES.map((node) => {
              const colors = nodeColors[node.type] ?? "border-gray-500/40 text-gray-300";
              const dot    = statusDot[node.status] ?? "bg-gray-600";
              return (
                <div key={node.id}
                  className={`absolute flex flex-col gap-1 border rounded-xl px-3 py-2.5 cursor-pointer hover:scale-105 transition-transform ${colors}`}
                  style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold leading-none">{node.label}</p>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  </div>
                  <p className="text-[9px] text-gray-500 leading-tight truncate">{node.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Properties panel */}
        <div className="w-52 border-l border-white/8 bg-[#0a0a17] p-3 overflow-y-auto shrink-0">
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">Selected Node</p>
          <div className="glass rounded-xl p-3 mb-3">
            <p className="text-xs font-semibold text-indigo-300 mb-1">SynthRender</p>
            <p className="text-[10px] text-gray-500 leading-relaxed">SynthRender v3 · Status: Active · Progress: 63%</p>
          </div>
          <div className="space-y-2">
            {[["Model", "SynthRender v3"],["Steps", "40"],["CFG Scale", "7.5"],["Sampler", "DPM++ 2M"]].map(([k,v]) => (
              <div key={k} className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{k}</span>
                <span className="text-gray-300 font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/8 space-y-2">
            <SynthosBadge label="Active" size="sm" />
            <button onClick={() => setShowStoryboard(true)}
              className="w-full flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 glass glass-hover rounded-xl px-3 py-2 border border-violet-500/20 transition-colors">
              <ImageIcon className="w-3.5 h-3.5" /> Generate Storyboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
