"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { SynthosBadge } from "@/components/ui/openclaw-badge";
import { SynthosMetricsBar } from "@/components/ui/openclaw-metrics-bar";
import { MOCK_TRENDS } from "@/lib/mock-data";
import type { Platform } from "@/lib/types";
import { TrendingUp, ArrowUpRight, Wand2, Loader2, X, CheckCircle2, ChevronDown } from "lucide-react";

const platforms: Platform[] = ["TikTok", "YouTube", "Douyin", "Instagram"];

const platStyle: Record<Platform, { badge: string; active: string }> = {
  TikTok:    { badge: "bg-pink-500/15 text-pink-400 border-pink-500/30",       active: "bg-pink-500/20 text-pink-300 border-pink-500/50" },
  YouTube:   { badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",       active: "bg-rose-500/20 text-rose-300 border-rose-500/50" },
  Douyin:    { badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",       active: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50" },
  Instagram: { badge: "bg-violet-500/15 text-violet-400 border-violet-500/30", active: "bg-violet-500/20 text-violet-300 border-violet-500/50" },
};

interface TrendWithIdea {
  id: string;
  title: string;
  platform: Platform;
  rank: number;
  growth: string;
  views: string;
  relevance: number;
  suggestedTemplate?: string;
  idea?: string;
  generatingIdea?: boolean;
  showIdea?: boolean;
}

export default function TrendRadarPage() {
  const [activePlatform, setActivePlatform] = useState<Platform | "all">("all");
  const [trends, setTrends] = useState<TrendWithIdea[]>(MOCK_TRENDS as TrendWithIdea[]);

  const filtered = activePlatform === "all"
    ? trends
    : trends.filter(t => t.platform === activePlatform);

  const generateIdea = async (trend: TrendWithIdea) => {
    setTrends(prev => prev.map(t => t.id === trend.id ? { ...t, generatingIdea: true, showIdea: false } : t));
    try {
      const res = await fetch("/api/generate/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Based on this trending content format on ${trend.platform}:
"${trend.title}" — ${trend.growth} growth, ${trend.views} views

Generate a specific, actionable content idea for an anime studio to capitalize on this trend.
Format as:
1. EPISODE CONCEPT (2 sentences)
2. KEY SCENES (3 bullet points)
3. PLATFORM HOOKS (what makes it viral on ${trend.platform})
4. ESTIMATED REACH (based on ${trend.growth} trend growth)`,
          genre: "Content Strategy",
          style: "Marketing",
        }),
      });
      const data = await res.json();
      setTrends(prev => prev.map(t =>
        t.id === trend.id
          ? { ...t, idea: data.content ?? "Generation failed. Try again.", generatingIdea: false, showIdea: true }
          : t
      ));
    } catch {
      setTrends(prev => prev.map(t =>
        t.id === trend.id ? { ...t, generatingIdea: false } : t
      ));
    }
  };

  return (
    <div>
      <DashHeader title="Trend Radar" description="Real-time platform trend monitoring + AI content ideation" />
      <div className="p-5 space-y-5">
        {/* Synthos AI Trend Analyzer */}
        <div className="glass rounded-2xl p-4 border border-indigo-500/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-500/15 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-white">Trend Analyzer</p>
                  <SynthosBadge label="24/7 Active" />
                </div>
                <SynthosMetricsBar metrics={[
                  { label: "Accuracy",       value: "82", unit: "%", color: "text-indigo-300" },
                  { label: "Platforms",      value: "4" },
                  { label: "Trends tracked", value: "721" },
                  { label: "Uptime",         value: "99.1", unit: "%", color: "text-emerald-400" },
                ]} />
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">Last updated: 2 min ago</span>
              <p className="text-[10px] text-indigo-400 mt-0.5">Click any trend to generate an AI content idea</p>
            </div>
          </div>
        </div>

        {/* Platform filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setActivePlatform("all")}
            className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
              activePlatform === "all"
                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/30"
                : "text-gray-500 glass glass-hover border-white/10 hover:text-white"
            }`}>
            All Platforms
          </button>
          {platforms.map((p) => (
            <button key={p} onClick={() => setActivePlatform(activePlatform === p ? "all" : p)}
              className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                activePlatform === p ? platStyle[p].active : "text-gray-500 glass glass-hover border-white/10 hover:text-white"
              }`}>
              {p}
            </button>
          ))}
        </div>

        {/* Trend cards */}
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-12">No trends found for this platform.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((trend) => (
              <div key={trend.id} className="glass rounded-2xl overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/30 to-pink-600/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold gradient-text">#{trend.rank}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-white text-sm leading-tight">{trend.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border shrink-0 ${platStyle[trend.platform].badge}`}>
                          {trend.platform}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs mb-3">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" /> {trend.growth}
                        </span>
                        <span className="text-gray-500">{trend.views} views</span>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Relevance to your projects</span>
                          <span className={`font-semibold ${trend.relevance >= 90 ? "text-emerald-400" : trend.relevance >= 75 ? "text-indigo-400" : "text-gray-400"}`}>
                            {trend.relevance}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${trend.relevance >= 90 ? "bg-emerald-500" : trend.relevance >= 75 ? "bg-indigo-500" : "bg-gray-500"}`}
                            style={{ width: `${trend.relevance}%` }} />
                        </div>
                      </div>
                      {trend.suggestedTemplate && (
                        <div className="flex items-center gap-2">
                          <SynthosBadge label="Suggested" size="sm" />
                          <span className="text-xs text-indigo-300">{trend.suggestedTemplate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Idea generation */}
                  <div className="mt-4 pt-4 border-t border-white/8">
                    <button onClick={() => generateIdea(trend)}
                      disabled={trend.generatingIdea}
                      className="w-full flex items-center justify-center gap-2 text-xs bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-300 rounded-xl py-2 border border-indigo-500/20 transition-colors disabled:opacity-60">
                      {trend.generatingIdea
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating idea with Synthos LLM…</>
                        : <><Wand2 className="w-3.5 h-3.5" /> {trend.idea ? "Regenerate idea" : "Generate content idea"}</>
                      }
                    </button>
                  </div>
                </div>

                {/* Generated idea panel */}
                {trend.idea && (
                  <div className="border-t border-white/8">
                    <button onClick={() => setTrends(prev => prev.map(t => t.id === trend.id ? { ...t, showIdea: !t.showIdea } : t))}
                      className="flex items-center justify-between w-full px-5 py-3 hover:bg-white/[0.03] transition-colors">
                      <span className="text-xs font-medium text-indigo-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> AI Content Idea Ready
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform ${trend.showIdea ? "rotate-180" : ""}`} />
                    </button>
                    {trend.showIdea && (
                      <div className="px-5 pb-4">
                        <div className="bg-black/30 rounded-xl p-4 text-xs text-gray-300 whitespace-pre-wrap leading-relaxed border border-white/8 max-h-64 overflow-y-auto">
                          {trend.idea}
                        </div>
                        <button onClick={() => {
                          const blob = new Blob([trend.idea!], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url; a.download = `${trend.title.replace(/\s+/g, "_")}_idea.txt`; a.click();
                          URL.revokeObjectURL(url);
                        }} className="mt-2 text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                          <X className="w-3 h-3 rotate-45" /> Download idea
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
