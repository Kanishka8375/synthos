"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { SynthosBadge } from "@/components/ui/openclaw-badge";
import { SynthosMetricsBar } from "@/components/ui/openclaw-metrics-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_EPISODES, MOCK_PIPELINE_STEPS } from "@/lib/mock-data";
import type { Episode, PipelineStep } from "@/lib/types";
import { GitBranch, CheckCircle2, Circle, Loader2, AlertCircle, ChevronRight, Wand2, X, FileText } from "lucide-react";

function getPipelineForEpisode(ep: Episode): PipelineStep[] {
  return MOCK_PIPELINE_STEPS.map((step, i) => {
    if (ep.status === "Completed") return { ...step, status: "Completed", progress: 100 };
    if (ep.status === "Draft")     return { ...step, status: "Waiting",   progress: 0 };
    const threshold = ((i + 1) / MOCK_PIPELINE_STEPS.length) * 100;
    if (ep.progress >= threshold)        return { ...step, status: "Completed", progress: 100 };
    if (ep.progress >= threshold - (100 / MOCK_PIPELINE_STEPS.length))
      return { ...step, status: "Active", progress: Math.round((ep.progress % (100 / MOCK_PIPELINE_STEPS.length)) * MOCK_PIPELINE_STEPS.length) };
    return { ...step, status: "Waiting", progress: 0 };
  });
}

const statusIcon = (status: string) => {
  if (status === "Completed") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (status === "Active")    return <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />;
  if (status === "Error")     return <AlertCircle className="w-4 h-4 text-rose-400" />;
  return <Circle className="w-4 h-4 text-gray-600" />;
};

export default function EpisodePipelinePage() {
  const [activeEpId, setActiveEpId]     = useState(MOCK_EPISODES[2].id);
  const activeEp                        = MOCK_EPISODES.find(e => e.id === activeEpId) ?? MOCK_EPISODES[2];
  const pipeline                        = getPipelineForEpisode(activeEp);

  // Script generation state
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [scriptPrompt, setScriptPrompt]       = useState("");
  const [scriptGenre, setScriptGenre]         = useState("Action");
  const [generating, setGenerating]           = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [scriptError, setScriptError]         = useState("");

  const generateScript = async () => {
    if (!scriptPrompt.trim()) return;
    setGenerating(true);
    setScriptError("");
    setGeneratedScript(null);

    try {
      const res = await fetch("/api/generate/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${activeEp.title} - Episode ${activeEp.number}: ${scriptPrompt}`,
          genre: scriptGenre,
          style: "Anime",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Script generation failed");
      setGeneratedScript(data.content);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Script generation failed";
      setScriptError(msg);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <DashHeader
        title="Episode Pipeline"
        description="Agent-driven production flow"
        actions={
          <button
            onClick={() => setShowScriptModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <Wand2 className="w-3.5 h-3.5" /> Generate Script
          </button>
        }
      />

      {/* Script Generation Modal */}
      {showScriptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-white">AI Script Generator</h2>
                <p className="text-xs text-gray-500 mt-0.5">Powered by Synthos LLM</p>
              </div>
              <button onClick={() => { setShowScriptModal(false); setGeneratedScript(null); setScriptError(""); }}
                className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {!generatedScript ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Episode for: {activeEp.title}</label>
                  <textarea
                    value={scriptPrompt}
                    onChange={e => setScriptPrompt(e.target.value)}
                    rows={4}
                    placeholder="Describe the episode plot, key scenes, character arcs… e.g. 'Kaito infiltrates the neon fortress, discovers the AI overlord is his missing father, epic rooftop battle ensues'"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Genre</label>
                  <select value={scriptGenre} onChange={e => setScriptGenre(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                    {["Action", "Romance", "Thriller", "Sci-Fi", "Fantasy", "Horror", "Isekai"].map(g =>
                      <option key={g} value={g} className="bg-[#0a0a17]">{g}</option>
                    )}
                  </select>
                </div>
                {scriptError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
                    {scriptError}
                  </div>
                )}
                <button onClick={generateScript}
                  disabled={generating || !scriptPrompt.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all">
                  {generating
                    ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Writing script via Synthos LLM…</span>
                    : <span className="flex items-center justify-center gap-2"><FileText className="w-4 h-4" /> Generate Episode Script</span>
                  }
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-400">Script generated by Synthos LLM · Saved to database</p>
                </div>
                <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto border border-white/8">
                  {generatedScript}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setGeneratedScript(null); setScriptPrompt(""); }}
                    className="flex-1 glass glass-hover text-gray-400 hover:text-white py-2.5 rounded-xl text-xs font-medium transition-all">
                    Generate another
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedScript], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a"); a.href = url;
                      a.download = `${activeEp.title.replace(/\s+/g, "_")}_script.txt`;
                      a.click(); URL.revokeObjectURL(url);
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-medium transition-all">
                    Download script
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-56px)]">
        {/* Episode sidebar */}
        <div className="w-56 border-r border-white/8 overflow-y-auto bg-[#0a0a17] shrink-0">
          <div className="p-3">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2 px-1">Neon Ronin</p>
            {MOCK_EPISODES.map((ep) => (
              <button
                key={ep.id}
                onClick={() => setActiveEpId(ep.id)}
                className={`w-full text-left p-2.5 rounded-xl mb-1 cursor-pointer transition-all ${
                  ep.id === activeEpId
                    ? "bg-indigo-600/20 border border-indigo-500/30"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-xs font-medium ${ep.id === activeEpId ? "text-indigo-300" : "text-gray-400"}`}>
                    EP {ep.number}
                  </p>
                  <StatusBadge status={ep.status} />
                </div>
                <p className="text-xs text-gray-600 truncate">{ep.title}</p>
                {ep.progress > 0 && (
                  <div className="mt-2 h-1 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${ep.progress}%` }} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-white">EP {activeEp.number}: {activeEp.title}</h2>
                <StatusBadge status={activeEp.status} />
              </div>
              <p className="text-xs text-gray-500">Duration estimate: {activeEp.duration}</p>
            </div>
            <SynthosBadge label="Synthos AI Pipeline" />
          </div>

          {/* Overall progress */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-400">Episode Progress</span>
              <span className="text-white font-semibold">{activeEp.progress}%</span>
            </div>
            <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${activeEp.progress}%` }} />
            </div>
          </div>

          {/* Agent Pipeline */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/8">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Agent Pipeline</h3>
            </div>
            <div className="divide-y divide-white/5">
              {pipeline.map((step, i) => (
                <div key={step.id} className="flex items-start gap-4 px-5 py-4">
                  <div className="flex flex-col items-center gap-1 pt-0.5">
                    {statusIcon(step.status)}
                    {i < pipeline.length - 1 && (
                      <div className={`w-px h-6 ${step.status === "Completed" ? "bg-emerald-500/40" : "bg-white/8"}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${step.status === "Waiting" ? "text-gray-500" : "text-white"}`}>
                          {step.name}
                        </p>
                        <span className="text-xs text-gray-600">→ {step.agent}</span>
                        {step.name === "Script" && step.status === "Waiting" && (
                          <button
                            onClick={() => setShowScriptModal(true)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                          >
                            <Wand2 className="w-3 h-3" /> Generate
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {step.duration && step.status !== "Waiting" && <span>{step.duration}</span>}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    {step.output && step.status !== "Waiting" && (
                      <p className="text-xs text-gray-400">{step.output}</p>
                    )}
                    {step.status === "Active" && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-indigo-300">{step.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full animate-pulse-slow"
                            style={{ width: `${step.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Synthos AI Performance */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <SynthosBadge label="Synthos LLM" />
            </div>
            <SynthosMetricsBar metrics={[
              { label: "Script model",       value: "Synthos LLM" },
              { label: "Visual consistency", value: "97", unit: "%" },
              { label: "Render speed",       value: "2.1", unit: "x" },
              { label: "Tasks done",         value: "7,204" },
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
}
