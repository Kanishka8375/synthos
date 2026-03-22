"use client";
import { useState, useEffect, useRef } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { SynthosBadge } from "@/components/ui/openclaw-badge";
import { SynthosMetricsBar } from "@/components/ui/openclaw-metrics-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_TRACKS } from "@/lib/mock-data";
import type { Track } from "@/lib/types";
import { Plus, Play, Pause, Music2, MoreHorizontal, Loader2, X, Volume2 } from "lucide-react";

type TrackFilter = "All" | "Generating" | "Ready" | "Assigned";

interface RealTrack extends Track {
  audio?: string; // base64 data URL
}

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

const MOODS   = ["Epic", "Melancholic", "Tense", "Romantic", "Mysterious", "Upbeat", "Dark", "Peaceful"];
const GENRES  = ["Orchestral", "Electronic", "Hybrid", "Lo-fi", "Jazz Fusion", "Synthwave", "Traditional"];

export default function SoundtrackForgePage() {
  const [tracks, setTracks]           = useState<RealTrack[]>(MOCK_TRACKS as RealTrack[]);
  const [filter, setFilter]           = useState<TrackFilter>("All");
  const [playing, setPlaying]         = useState<string | null>(null);
  const [showModal, setShowModal]     = useState(false);
  const [generating, setGenerating]   = useState(false);
  const [genError, setGenError]       = useState("");
  const [musicLoading, setMusicLoading] = useState(false);

  // Generate form
  const [genTitle, setGenTitle] = useState("");
  const [genMood, setGenMood]   = useState("Epic");
  const [genGenre, setGenGenre] = useState("Orchestral");
  const [genPrompt, setGenPrompt] = useState("");

  // Audio playback refs
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const visible = filter === "All" ? tracks : tracks.filter(t => t.status === filter);

  const togglePlay = (id: string, audioUrl?: string) => {
    // Stop currently playing
    Object.entries(audioRefs.current).forEach(([k, el]) => {
      if (k !== id) { el.pause(); el.currentTime = 0; }
    });

    if (playing === id) {
      audioRefs.current[id]?.pause();
      setPlaying(null);
      return;
    }

    if (audioUrl) {
      // Real audio
      if (!audioRefs.current[id]) {
        audioRefs.current[id] = new Audio(audioUrl);
        audioRefs.current[id].onended = () => setPlaying(null);
      }
      audioRefs.current[id].play().catch(() => {});
    }
    setPlaying(id);
  };

  // Load real tracks from Supabase on mount
  useEffect(() => {
    fetch("/api/generate/music")
      .then(r => r.json())
      .then(data => {
        if (data.tracks?.length > 0) {
          const realTracks: RealTrack[] = data.tracks.map((t: {
            id: string; title: string; genre: string; mood: string;
            duration: string; bpm: number; status: string; audio_url?: string;
          }) => ({
            id: t.id,
            title: t.title,
            genre: t.genre,
            mood: t.mood,
            duration: t.duration,
            bpm: t.bpm,
            status: t.status as Track["status"],
            audio: t.audio_url,
          }));
          setTracks(prev => [...realTracks, ...prev.filter(p => !realTracks.find(r => r.id === p.id))]);
        }
      })
      .catch(() => {});
  }, []);

  const generateTrack = async () => {
    if (!genPrompt.trim()) return;
    setGenerating(true);
    setGenError("");
    setMusicLoading(true);

    const tempId = `gen-${Date.now()}`;
    const tempTrack: RealTrack = {
      id: tempId,
      title: genTitle || "New Composition",
      mood: genMood,
      genre: genGenre,
      duration: "--:--",
      bpm: 0,
      status: "Generating",
    };
    setTracks(prev => [tempTrack, ...prev]);
    setShowModal(false);

    try {
      const res = await fetch("/api/generate/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: genTitle || "New Composition",
          mood: genMood,
          genre: genGenre,
          prompt: genPrompt,
        }),
      });

      const data = await res.json();

      if (res.status === 202) {
        // Model warming up — show retry message
        setTracks(prev => prev.map(t =>
          t.id === tempId ? { ...t, status: "Ready", duration: "0:00", bpm: 0, title: `[Loading] ${t.title}` } : t
        ));
        setGenError(data.message);
        return;
      }

      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      setTracks(prev => prev.map(t =>
        t.id === tempId
          ? {
              ...t,
              id: data.id ?? tempId,
              status: "Ready",
              duration: data.duration ?? "0:30",
              bpm: data.bpm ?? 100,
              audio: data.audio,
            }
          : t
      ));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      setGenError(msg);
      setTracks(prev => prev.filter(t => t.id !== tempId));
    } finally {
      setGenerating(false);
      setMusicLoading(false);
    }
  };

  return (
    <div>
      <DashHeader
        title="Soundtrack Forge"
        description="AI-generated adaptive scene music via Synthos SynthSound"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Generate Track
          </button>
        }
      />

      {/* Generate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">Generate Music Track</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Track title (optional)</label>
                <input value={genTitle} onChange={e => setGenTitle(e.target.value)}
                  placeholder="e.g. Battle at Neon Bridge"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Mood</label>
                  <select value={genMood} onChange={e => setGenMood(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                    {MOODS.map(m => <option key={m} value={m} className="bg-[#0a0a17]">{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Genre</label>
                  <select value={genGenre} onChange={e => setGenGenre(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                    {GENRES.map(g => <option key={g} value={g} className="bg-[#0a0a17]">{g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Scene description <span className="text-rose-400">*</span></label>
                <textarea value={genPrompt} onChange={e => setGenPrompt(e.target.value)} rows={3}
                  placeholder="e.g. intense sword fight in a neon-lit alley, cyberpunk city at night, rain pouring"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
              </div>
              <div className="flex items-center gap-2 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <p className="text-xs text-gray-400">
                  Powered by <span className="text-indigo-300">Synthos SynthSound</span>.
                  First generation may take 20–30s while model loads.
                </p>
              </div>
              <button onClick={generateTrack}
                disabled={generating || !genPrompt.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all">
                {generating
                  ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Generating…</span>
                  : "Generate with SynthSound"
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-5 space-y-5">
        {genError && (
          <div className="flex items-center justify-between gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-xs text-amber-400">{genError}</p>
            <button onClick={() => setGenError("")}><X className="w-3.5 h-3.5 text-amber-400" /></button>
          </div>
        )}

        {/* Music Composer metrics */}
        <div className="glass rounded-2xl p-4 border border-indigo-500/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500/15 rounded-xl flex items-center justify-center">
                <Music2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-white">Music Composer</p>
                  <SynthosBadge label="Synthos SynthSound" />
                </div>
                <SynthosMetricsBar metrics={[
                  { label: "Model",           value: "musicgen-small" },
                  { label: "Tracks generated", value: tracks.filter(t => t.status === "Ready" || t.status === "Assigned").length.toString() },
                  { label: "Status",           value: musicLoading ? "Generating" : "Ready", color: musicLoading ? "text-amber-400" : "text-emerald-400" },
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
            <button key={f} onClick={() => setFilter(f)}
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
                  onClick={() => track.status !== "Generating" && togglePlay(track.id, track.audio)}
                  disabled={track.status === "Generating"}
                  className="w-10 h-10 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 flex items-center justify-center text-indigo-300 hover:text-white transition-all shrink-0 disabled:cursor-not-allowed"
                >
                  {track.status === "Generating" ? (
                    <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  ) : playing === track.id ? (
                    <Pause className="w-4 h-4 fill-current" />
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
                        {track.audio && <span className="ml-2 text-emerald-400">● Real audio</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={track.status} />
                      <button onClick={() => alert(`Options for: ${track.title}`)}
                        className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {track.status !== "Generating" ? (
                    <Waveform
                      color={track.status === "Assigned" ? "bg-emerald-500" : track.audio ? "bg-violet-500" : "bg-indigo-500"}
                      seed={idx + 1}
                    />
                  ) : (
                    <div className="h-8 flex items-center gap-2">
                      <div className="flex items-center gap-px">
                        {Array.from({ length: 32 }, (_, i) => (
                          <div key={i} className="w-1 rounded-full bg-amber-500/30" style={{ height: 8 + (i % 4) * 4 }} />
                        ))}
                      </div>
                      <span className="text-xs text-amber-400 animate-pulse">Generating via SynthSound…</span>
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
