"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { OpenClawMetricsBar } from "@/components/ui/openclaw-metrics-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_TRACKS } from "@/lib/mock-data";
import type { Track } from "@/lib/types";
import { Plus, Play, Music2, MoreHorizontal } from "lucide-react";

type TrackFilter = "All" | "Generating" | "Ready" | "Assigned";

// Deterministic waveform heights per track index
function getWaveHeights(seed: number): number[] {
  return Array.from({ length: 32 }, (_, i) => 20 + Math.abs(Math.sin((i + seed) * 0.8) * 12) + ((i * seed) % 8));
}

function Waveform({ color = "bg-indigo-500", seed = 1 }: { color?: string; seed?: number }) {
  const heights = getWaveHeights(seed);
  return (
    <div className="flex items-center gap-px h-8">
      {heights.map((h, i) => (
        <div key={i} className={`w-1 rounded-full ${color} opacity-60`} style={{ height: h }} />
      ))}
    </div>
  );
}

export default function SoundtrackForgePage() {
  const [tracks, setTracks]   = useState<Track[]>(MOCK_TRACKS);
  const [filter, setFilter]   = useState<TrackFilter>("All");
  const [playing, setPlaying] = useState<string | null>(null);

  const visible = filter === "All" ? tracks : tracks.filter(t => t.status === filter);

  const togglePlay = (id: string) => {
    setPlaying(prev => prev === id ? null : id);
  };

  const generateTrack = () => {
    const newTrack: Track = {
      id: `t${Date.now()}`,
      title: "New Composition",
      mood: "Custom",
      genre: "Hybrid",
      duration: "--:--",
      bpm: 0,
      status: "Generating",
    };
    setTracks(prev => [newTrack, ...prev]);
    // Simulate generation completing
    setTimeout(() => {
      setTracks(prev => prev.map(t =>
        t.id === newTrack.id ? { ...t, status: "Ready", duration: "3:12", bpm: 110 } : t
      ));
    }, 3000);
  };

  return (
    <div>
      <DashHeader
        title="Soundtrack Forge"
        description="AI-generated adaptive scene music"
        actions={
          <button
            onClick={generateTrack}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Generate Track
          </button>
        }
      />
      <div className="p-5 space-y-5">
        {/* OpenClaw Music Composer metrics */}
        <div className="glass rounded-2xl p-4 border border-indigo-500/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500/15 rounded-xl flex items-center justify-center">
                <Music2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-white">Music Composer</p>
                  <OpenClawBadge label="Active" />
                </div>
                <OpenClawMetricsBar metrics={[
                  { label: "Accuracy",          value: "88", unit: "%", color: "text-emerald-400" },
                  { label: "Tracks generated",  value: tracks.length.toString() },
                  { label: "Uptime",            value: "98.7", unit: "%", color: "text-emerald-400" },
                ]} />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {tracks.filter(t => t.status === "Generating").length} generating
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          {(["All", "Generating", "Ready", "Assigned"] as TrackFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-xl transition-colors border ${
                filter === f
                  ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/30"
                  : "text-gray-500 hover:text-white glass glass-hover border-transparent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-12">No tracks with status: {filter}</p>
        )}

        {/* Track list */}
        <div className="space-y-3">
          {visible.map((track, idx) => (
            <div key={track.id} className="glass glass-hover rounded-2xl p-4 group">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => track.status !== "Generating" && togglePlay(track.id)}
                  disabled={track.status === "Generating"}
                  className="w-10 h-10 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 flex items-center justify-center text-indigo-300 hover:text-white transition-all shrink-0 disabled:cursor-not-allowed"
                >
                  {track.status === "Generating" ? (
                    <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  ) : playing === track.id ? (
                    <span className="flex gap-0.5">
                      <span className="w-1 h-4 bg-current rounded-full animate-pulse" />
                      <span className="w-1 h-4 bg-current rounded-full animate-pulse delay-75" />
                    </span>
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div>
                      <p className="text-sm font-semibold text-white">{track.title}</p>
                      <p className="text-xs text-gray-500">
                        {track.genre} · {track.mood} · {track.bpm > 0 ? `${track.bpm} BPM` : "—"} · {track.duration}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={track.status} />
                      <button
                        onClick={() => alert(`Options for: ${track.title}`)}
                        className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {track.status !== "Generating" ? (
                    <Waveform
                      color={track.status === "Assigned" ? "bg-emerald-500" : "bg-indigo-500"}
                      seed={idx + 1}
                    />
                  ) : (
                    <div className="h-8 flex items-center gap-2">
                      <div className="flex items-center gap-px">
                        {Array.from({ length: 32 }, (_, i) => (
                          <div key={i} className="w-1 rounded-full bg-amber-500/30" style={{ height: 8 + (i % 4) * 4 }} />
                        ))}
                      </div>
                      <span className="text-xs text-amber-400 animate-pulse">Generating…</span>
                    </div>
                  )}

                  {track.assignedTo && (
                    <p className="text-xs text-emerald-400 mt-1">Assigned to: {track.assignedTo}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
