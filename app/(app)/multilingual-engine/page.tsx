import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_LANGUAGES } from "@/lib/mock-data";
import { MOCK_EPISODES } from "@/lib/mock-data";
import { Languages, Loader2, CheckCircle2, AlertCircle, Play } from "lucide-react";

export default function MultilingualEnginePage() {
  const sourceEpisode = MOCK_EPISODES[0]; // EP 1 - completed

  return (
    <div>
      <DashHeader title="Multilingual Engine" description="AI dubbing and lip sync across 40+ languages" />
      <div className="p-5 space-y-5">
        {/* Source selector */}
        <div className="glass rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Source Episode</p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
              <div className="w-8 h-8 bg-indigo-500/15 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-indigo-400 fill-current" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">EP {sourceEpisode.number}: {sourceEpisode.title}</p>
                <p className="text-xs text-gray-500">Neon Ronin · {sourceEpisode.duration} · English (source)</p>
              </div>
            </div>
            <button className="glass glass-hover text-gray-300 hover:text-white px-4 py-2 rounded-xl text-xs font-medium">Change Episode</button>
          </div>
        </div>

        {/* OpenClaw agents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Translation Engine", desc: "Multilingual dubbing with cultural adaptation", accuracy: 93, uptime: 97.4, active: false },
            { label: "Lip Sync Engine", desc: "Frame-accurate lip sync for translated audio", accuracy: 91, uptime: 97.2, active: false },
          ].map((agent) => (
            <div key={agent.label} className="glass rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Languages className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{agent.label}</p>
                    <OpenClawBadge label={agent.active ? "Active" : "Standby"} size="sm" active={agent.active} />
                  </div>
                  <p className="text-xs text-gray-500">{agent.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="glass rounded-lg px-2 py-1"><span className="text-gray-500">Accuracy</span> <span className="text-indigo-300 font-semibold">{agent.accuracy}%</span></span>
                <span className="glass rounded-lg px-2 py-1"><span className="text-gray-500">Uptime</span> <span className="text-emerald-400 font-semibold">{agent.uptime}%</span></span>
              </div>
            </div>
          ))}
        </div>

        {/* Language rows */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8">
            <h2 className="text-sm font-semibold text-white">Language Queue</h2>
            <button className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium transition-all">
              Start All Pending
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {MOCK_LANGUAGES.map((lang) => (
              <div key={lang.code} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors">
                {/* Flag + name */}
                <div className="flex items-center gap-3 w-36 shrink-0">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <p className="text-xs font-medium text-white">{lang.name}</p>
                    <p className="text-[10px] text-gray-600">{lang.code}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="hidden sm:flex items-center gap-3 text-xs">
                    <span className="glass rounded-lg px-2 py-1"><span className="text-gray-600">Voice</span> <span className="text-indigo-300 font-semibold">{lang.voiceMatch}%</span></span>
                    <span className="glass rounded-lg px-2 py-1"><span className="text-gray-600">Lip Sync</span> <span className="text-pink-300 font-semibold">{lang.lipSync}%</span></span>
                  </div>

                  {/* Progress */}
                  {lang.status === "Processing" && (
                    <div className="flex-1 max-w-xs">
                      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full animate-pulse-slow" style={{ width: `${lang.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-600">{lang.progress}%</span>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 shrink-0">
                  {lang.status === "Complete" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {lang.status === "Processing" && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                  {lang.status === "Error" && <AlertCircle className="w-4 h-4 text-rose-400" />}
                  <StatusBadge status={lang.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
