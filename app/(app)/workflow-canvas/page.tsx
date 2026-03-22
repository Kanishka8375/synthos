"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { MOCK_WORKFLOW_NODES, MOCK_WORKFLOW_EDGES } from "@/lib/mock-data";
import { Plus, Save, Play, RotateCcw, CheckCircle2 } from "lucide-react";

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

export default function WorkflowCanvasPage() {
  const [saved, setSaved]   = useState(false);
  const [running, setRunning] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRun = () => {
    if (running) return;
    setRunning(true);
    setTimeout(() => setRunning(false), 3000);
  };

  // Compute edge paths
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
    { label: "Storyboard", color: "border-violet-500/40 text-violet-300" },
    { label: "Diffusion", color: "border-pink-500/40 text-pink-300" },
    { label: "Voice Sync", color: "border-cyan-500/40 text-cyan-300" },
    { label: "Music", color: "border-emerald-500/40 text-emerald-300" },
    { label: "Filter", color: "border-amber-500/40 text-amber-300" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <DashHeader title="Workflow Canvas" description="Visual node-based pipeline editor"
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => alert("Undo history — coming in v1.1")} className="glass glass-hover p-1.5 rounded-lg text-gray-400 hover:text-white" title="Undo last change"><RotateCcw className="w-3.5 h-3.5" /></button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 glass glass-hover text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs"
            >
              {saved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? "Saved!" : "Save"}
            </button>
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            >
              {running
                ? <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Running…</>
                : <><Play className="w-3.5 h-3.5 fill-current" /> Run</>
              }
            </button>
          </div>
        }
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Node palette */}
        <div className="w-40 border-r border-white/8 bg-[#0a0a17] p-3 overflow-y-auto shrink-0">
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">Node Palette</p>
          <div className="space-y-1.5">
            {palette.map((p) => (
              <button
                key={p.label}
                onClick={() => alert(`Add "${p.label}" node — drag-and-drop editor coming in v1.1`)}
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs w-full text-left ${p.color} bg-white/[0.03] hover:bg-white/[0.06] transition-colors`}>
                <Plus className="w-3 h-3 opacity-50" />
                {p.label}
              </button>
            ))}
          </div>

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
          <svg
            className="absolute top-0 left-0"
            width="1000" height="420"
            style={{ overflow: "visible" }}
          >
            {edges.map((e, i) => (
              <path key={i} d={e.d} fill="none" stroke="rgba(99,102,241,0.35)" strokeWidth="1.5" />
            ))}
          </svg>

          <div className="relative" style={{ width: 1000, height: 420 }}>
            {MOCK_WORKFLOW_NODES.map((node) => {
              const colors = nodeColors[node.type] ?? "border-gray-500/40 text-gray-300";
              const dot = statusDot[node.status] ?? "bg-gray-600";
              return (
                <div
                  key={node.id}
                  className={`absolute flex flex-col gap-1 border rounded-xl px-3 py-2.5 cursor-pointer hover:scale-105 transition-transform ${colors}`}
                  style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
                >
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
            <p className="text-xs font-semibold text-indigo-300 mb-1">AnimeDiffusion</p>
            <p className="text-[10px] text-gray-500 leading-relaxed">AnimeDiffusion v3 · Status: Active · Progress: 63%</p>
          </div>
          <div className="space-y-2">
            {[["Model", "AnimeDiffusion v3"],["Steps", "40"],["CFG Scale", "7.5"],["Sampler", "DPM++ 2M"]].map(([k,v]) => (
              <div key={k} className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{k}</span>
                <span className="text-gray-300 font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/8">
            <OpenClawBadge label="Active" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
