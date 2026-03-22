"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { OpenClawMetricsBar } from "@/components/ui/openclaw-metrics-bar";
import { MOCK_TRENDS } from "@/lib/mock-data";
import type { Platform } from "@/lib/types";
import { TrendingUp, ArrowUpRight } from "lucide-react";

const platforms: Platform[] = ["TikTok", "YouTube", "Douyin", "Instagram"];

const platStyle: Record<Platform, { badge: string; active: string }> = {
  TikTok:    { badge: "bg-pink-500/15 text-pink-400 border-pink-500/30",    active: "bg-pink-500/20 text-pink-300 border-pink-500/50" },
  YouTube:   { badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",    active: "bg-rose-500/20 text-rose-300 border-rose-500/50" },
  Douyin:    { badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",    active: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50" },
  Instagram: { badge: "bg-violet-500/15 text-violet-400 border-violet-500/30", active: "bg-violet-500/20 text-violet-300 border-violet-500/50" },
};

export default function TrendRadarPage() {
  const [activePlatform, setActivePlatform] = useState<Platform | "all">("all");

  const filtered = activePlatform === "all"
    ? MOCK_TRENDS
    : MOCK_TRENDS.filter(t => t.platform === activePlatform);

  return (
    <div>
      <DashHeader title="Trend Radar" description="Real-time platform trend monitoring" />
      <div className="p-5 space-y-5">
        {/* OpenClaw Trend Analyzer */}
        <div className="glass rounded-2xl p-4 border border-indigo-500/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-500/15 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-white">Trend Analyzer</p>
                  <OpenClawBadge label="24/7 Active" />
                </div>
                <OpenClawMetricsBar metrics={[
                  { label: "Accuracy",       value: "82", unit: "%",  color: "text-indigo-300" },
                  { label: "Platforms",      value: "4" },
                  { label: "Trends tracked", value: "721" },
                  { label: "Uptime",         value: "99.1", unit: "%", color: "text-emerald-400" },
                ]} />
              </div>
            </div>
            <span className="text-xs text-gray-500">Last updated: 2 min ago</span>
          </div>
        </div>

        {/* Platform filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActivePlatform("all")}
            className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
              activePlatform === "all"
                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/30"
                : "text-gray-500 glass glass-hover border-white/10 hover:text-white"
            }`}
          >
            All Platforms
          </button>
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setActivePlatform(activePlatform === p ? "all" : p)}
              className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                activePlatform === p
                  ? platStyle[p].active
                  : `text-gray-500 glass glass-hover border-white/10 hover:text-white`
              }`}
            >
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
              <div key={trend.id} className="glass glass-hover rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  {/* Rank */}
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

                    {/* Relevance bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Relevance to your projects</span>
                        <span className={`font-semibold ${trend.relevance >= 90 ? "text-emerald-400" : trend.relevance >= 75 ? "text-indigo-400" : "text-gray-400"}`}>
                          {trend.relevance}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${trend.relevance >= 90 ? "bg-emerald-500" : trend.relevance >= 75 ? "bg-indigo-500" : "bg-gray-500"}`}
                          style={{ width: `${trend.relevance}%` }}
                        />
                      </div>
                    </div>

                    {trend.suggestedTemplate && (
                      <div className="flex items-center gap-2 mt-2">
                        <OpenClawBadge label="Suggested" size="sm" />
                        <span className="text-xs text-indigo-300">{trend.suggestedTemplate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
