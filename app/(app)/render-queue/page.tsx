"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_RENDER_JOBS } from "@/lib/mock-data";
import type { RenderJob } from "@/lib/types";
import { Cpu, Cloud, Server, AlertCircle, RotateCcw, X, ChevronUp, ChevronDown } from "lucide-react";

type TabFilter = "All" | "Queued" | "Rendering" | "Completed" | "Failed";

export default function RenderQueuePage() {
  const [jobs, setJobs] = useState<RenderJob[]>(MOCK_RENDER_JOBS);
  const [tab, setTab] = useState<TabFilter>("All");
  const [mode, setMode] = useState<"Cloud" | "Local">("Cloud");
  const gpuUtil = 67;

  const visible = tab === "All" ? jobs : jobs.filter(j => j.status === tab);

  const cancel = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const retry = (id: string) => {
    setJobs(prev => prev.map(j =>
      j.id === id ? { ...j, status: "Queued", progress: 0, eta: "Queued" } : j
    ));
  };

  const changePriority = (id: string, dir: "up" | "down") => {
    setJobs(prev => {
      const idx = prev.findIndex(j => j.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  };

  return (
    <div>
      <DashHeader title="Render Queue" description="GPU job management and optimization" />
      <div className="p-5 space-y-5">
        {/* Status tabs + mode toggle */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {(["All", "Queued", "Rendering", "Completed", "Failed"] as TabFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-xs px-3 py-1.5 rounded-xl transition-colors ${
                  tab === t
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "text-gray-500 hover:text-white glass glass-hover border border-transparent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {(["Cloud", "Local"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all border ${
                  mode === m
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : "glass glass-hover text-gray-500 hover:text-white border-white/10"
                }`}
              >
                {m === "Cloud" ? <Cloud className="w-3.5 h-3.5" /> : <Server className="w-3.5 h-3.5" />}
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* GPU + Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-4 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-white">GPU Utilization</span>
              <OpenClawBadge label="Optimizer" size="sm" />
            </div>
            <div className="text-3xl font-bold gradient-text mb-1">{gpuUtil}%</div>
            <div className="h-2 bg-white/8 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full" style={{ width: `${gpuUtil}%` }} />
            </div>
            <p className="text-xs text-gray-500">6 of 8 GPUs active · {mode} cluster</p>
          </div>

          <div className="glass rounded-2xl p-4 sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-white">Cost Optimization</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                { label: "Today's cost",      value: "$4.68",  color: "text-white" },
                { label: "This month",        value: "$42.10", color: "text-white" },
                { label: "Saved by AI opt.",  value: "$18.40", color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl p-3 text-center">
                  <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-gray-600 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Job list */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8">
            <h2 className="text-sm font-semibold text-white">Render Jobs</h2>
            <span className="text-xs text-gray-500">{visible.length} job{visible.length !== 1 ? "s" : ""}</span>
          </div>

          {visible.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-10">No jobs with status: {tab}</p>
          ) : (
            <div className="divide-y divide-white/5">
              {visible.map((job) => (
                <div key={job.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-xs font-medium text-white truncate">{job.episode}</p>
                      <StatusBadge status={job.status} />
                      {job.priority === "high" && (
                        <span className="text-[10px] bg-rose-500/15 text-rose-400 px-1.5 py-0.5 rounded font-medium">HIGH</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{job.resolution}</span>
                      <span>{job.gpu}</span>
                      <span>ETA: {job.eta}</span>
                      <span className="text-gray-400">{job.cost}</span>
                    </div>
                    {job.status === "Rendering" && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden w-48">
                          <div
                            className="h-full bg-indigo-500 rounded-full animate-pulse-slow"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-600 mt-0.5 block">{job.progress}% complete</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {job.status === "Queued" && (
                      <>
                        <button
                          onClick={() => changePriority(job.id, "up")}
                          className="glass glass-hover p-1.5 rounded-lg text-gray-500 hover:text-indigo-400"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => changePriority(job.id, "down")}
                          className="glass glass-hover p-1.5 rounded-lg text-gray-500 hover:text-amber-400"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    {job.status === "Failed" && (
                      <button
                        onClick={() => retry(job.id)}
                        className="glass glass-hover p-1.5 rounded-lg text-gray-500 hover:text-emerald-400"
                        title="Retry"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {(job.status === "Rendering" || job.status === "Queued") && (
                      <button
                        onClick={() => cancel(job.id)}
                        className="glass glass-hover p-1.5 rounded-lg text-gray-500 hover:text-rose-400"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
