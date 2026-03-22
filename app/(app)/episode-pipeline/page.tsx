"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { OpenClawMetricsBar } from "@/components/ui/openclaw-metrics-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_EPISODES, MOCK_PIPELINE_STEPS } from "@/lib/mock-data";
import type { Episode, PipelineStep } from "@/lib/types";
import { GitBranch, CheckCircle2, Circle, Loader2, AlertCircle, ChevronRight } from "lucide-react";

// Build a pipeline per episode based on its progress
function getPipelineForEpisode(ep: Episode): PipelineStep[] {
  return MOCK_PIPELINE_STEPS.map((step, i) => {
    if (ep.status === "Completed") return { ...step, status: "Completed", progress: 100 };
    if (ep.status === "Draft")     return { ...step, status: "Waiting",   progress: 0 };
    // In Progress / Rendering — map to the episode's progress
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
  const [activeEpId, setActiveEpId] = useState(MOCK_EPISODES[2].id);
  const activeEp = MOCK_EPISODES.find(e => e.id === activeEpId) ?? MOCK_EPISODES[2];
  const pipeline  = getPipelineForEpisode(activeEp);

  return (
    <div>
      <DashHeader title="Episode Pipeline" description="Agent-driven production flow" />
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
            <OpenClawBadge label="OpenClaw Pipeline" />
          </div>

          {/* Overall progress */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-400">Episode Progress</span>
              <span className="text-white font-semibold">{activeEp.progress}%</span>
            </div>
            <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${activeEp.progress}%` }}
              />
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
                          <div
                            className="h-full bg-indigo-500 rounded-full animate-pulse-slow"
                            style={{ width: `${step.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OpenClaw Performance */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <OpenClawBadge label="Performance Metrics" />
            </div>
            <OpenClawMetricsBar metrics={[
              { label: "Script accuracy",     value: "94", unit: "%" },
              { label: "Visual consistency",  value: "97", unit: "%" },
              { label: "Render speed",        value: "2.1", unit: "x" },
              { label: "Tasks done",          value: "7,204" },
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
}
