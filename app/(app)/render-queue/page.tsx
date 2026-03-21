import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_RENDER_JOBS } from "@/lib/mock-data";
import { Cpu, Cloud, Server, AlertCircle, RotateCcw, X, ChevronUp, ChevronDown } from "lucide-react";

export default function RenderQueuePage() {
  const gpuUtil = 67;

  return (
    <div>
      <DashHeader title="Render Queue" description="GPU job management and optimization" />
      <div className="p-5 space-y-5">
        {/* Status tabs + cloud toggle */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {["All", "Queued", "Rendering", "Completed", "Failed"].map((tab) => (
              <button key={tab} className={`text-xs px-3 py-1.5 rounded-xl transition-colors ${tab === "All" ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" : "text-gray-500 hover:text-white glass glass-hover"}`}>{tab}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 glass glass-hover rounded-xl px-3 py-1.5 text-xs text-emerald-400 border border-emerald-500/30">
              <Cloud className="w-3.5 h-3.5" /> Cloud
            </button>
            <button className="flex items-center gap-1.5 glass glass-hover rounded-xl px-3 py-1.5 text-xs text-gray-500 hover:text-white">
              <Server className="w-3.5 h-3.5" /> Local
            </button>
          </div>
        </div>

        {/* GPU + Cost panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* GPU Utilization */}
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
            <p className="text-xs text-gray-500">6 of 8 GPUs active · A100 + H100 cluster</p>
          </div>

          {/* Cost optimization */}
          <div className="glass rounded-2xl p-4 sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-white">Cost Optimization</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                { label: "Today's cost", value: "$4.68", color: "text-white" },
                { label: "This month", value: "$42.10", color: "text-white" },
                { label: "Saved by AI opt.", value: "$18.40", color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl p-3 text-center">
                  <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-gray-600 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Render jobs */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8">
            <h2 className="text-sm font-semibold text-white">Render Jobs</h2>
            <span className="text-xs text-gray-500">{MOCK_RENDER_JOBS.length} jobs</span>
          </div>
          <div className="divide-y divide-white/5">
            {MOCK_RENDER_JOBS.map((job) => (
              <div key={job.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-medium text-white truncate">{job.episode}</p>
                    <StatusBadge status={job.status} />
                    {job.priority === "high" && (
                      <span className="text-[10px] bg-rose-500/15 text-rose-400 px-1.5 py-0.5 rounded">HIGH</span>
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
                        <div className="h-full bg-indigo-500 rounded-full animate-pulse-slow" style={{ width: `${job.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-600">{job.progress}%</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button className="glass glass-hover p-1.5 rounded-lg text-gray-500 hover:text-indigo-400"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <button className="glass glass-hover p-1.5 rounded-lg text-gray-500 hover:text-amber-400"><ChevronDown className="w-3.5 h-3.5" /></button>
                  {job.status === "Failed" && (
                    <button className="glass glass-hover p-1.5 rounded-lg text-gray-500 hover:text-emerald-400"><RotateCcw className="w-3.5 h-3.5" /></button>
                  )}
                  {job.status !== "Completed" && (
                    <button className="glass glass-hover p-1.5 rounded-lg text-gray-500 hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
