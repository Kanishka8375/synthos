"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { Waves } from "lucide-react";

const MARKERS = [
  { id: "intro",   label: "Intro",   position: 5 },
  { id: "build",   label: "Build",   position: 25 },
  { id: "climax",  label: "Climax",  position: 55 },
  { id: "fall",    label: "Fall",    position: 75 },
  { id: "resolve", label: "Resolve", position: 92 },
];

const CHANNELS = [
  { id: "facial", name: "Facial Expression", value: 72, color: "bg-indigo-500", trackColor: "bg-indigo-500/20" },
  { id: "voice",  name: "Voice Emotion",     value: 85, color: "bg-pink-500",   trackColor: "bg-pink-500/20" },
  { id: "music",  name: "Music Intensity",   value: 91, color: "bg-violet-500", trackColor: "bg-violet-500/20" },
  { id: "camera", name: "Camera Language",   value: 60, color: "bg-cyan-500",   trackColor: "bg-cyan-500/20" },
];

const PRESETS: Array<{
  name: string;
  color: string;
  channels: Record<string, number>;
}> = [
  { name: "Calm",      color: "border-cyan-500/40 text-cyan-300",     channels: { facial: 30, voice: 28, music: 22, camera: 35 } },
  { name: "Tense",     color: "border-amber-500/40 text-amber-300",   channels: { facial: 65, voice: 70, music: 80, camera: 60 } },
  { name: "Explosive", color: "border-rose-500/40 text-rose-300",     channels: { facial: 95, voice: 92, music: 98, camera: 88 } },
  { name: "Melancholy",color: "border-indigo-500/40 text-indigo-300", channels: { facial: 45, voice: 55, music: 40, camera: 30 } },
  { name: "Comedic",   color: "border-emerald-500/40 text-emerald-300",channels: { facial: 78, voice: 82, music: 65, camera: 70 } },
  { name: "Epic",      color: "border-violet-500/40 text-violet-300", channels: { facial: 85, voice: 80, music: 99, camera: 90 } },
];

// Heat strip gradient positions for demo
const HEAT = [20,35,45,60,85,95,88,72,55,40,30,20,15,25,40,58,72,80,75,65];

export default function EmotionChoreographyPage() {
  const [playhead, setPlayhead] = useState(42);
  const [activePreset, setActivePreset] = useState("Explosive");
  const [channels, setChannels] = useState(CHANNELS);

  const updateChannel = (id: string, value: number) => {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, value } : c));
  };

  return (
    <div>
      <DashHeader title="Emotion Choreography" description="Per-scene emotional arc control" />
      <div className="p-5 space-y-5">
        {/* Presets */}
        <div className="glass rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Emotion Presets</p>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESETS.map((preset) => (
              <button key={preset.name}
                onClick={() => {
                  setActivePreset(preset.name);
                  setChannels(prev => prev.map(c => ({ ...c, value: preset.channels[c.id] ?? c.value })));
                }}
                className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                  activePreset === preset.name
                    ? `${preset.color} bg-white/5`
                    : "border-white/10 text-gray-500 hover:text-white hover:border-white/20"
                }`}>
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Scene Timeline — EP 3: Blade of Regret</h2>
            <OpenClawBadge label="Voice Synthesizer" size="sm" />
          </div>

          {/* Timeline bar */}
          <div className="relative h-10 mb-2">
            {/* Track */}
            <div className="absolute inset-y-3 left-0 right-0 bg-white/5 rounded-full overflow-hidden">
              {/* Heat strip */}
              <div className="h-full flex">
                {HEAT.map((h, i) => (
                  <div key={i} className="flex-1" style={{ background: `rgba(99,102,241,${h / 120})` }} />
                ))}
              </div>
            </div>
            {/* Markers */}
            {MARKERS.map((m) => (
              <div key={m.id} className="absolute top-0 flex flex-col items-center" style={{ left: `${m.position}%` }}>
                <span className="text-[9px] text-gray-500 mb-0.5">{m.label}</span>
                <div className="w-px h-10 bg-indigo-500/50" />
              </div>
            ))}
            {/* Playhead */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-white/80 cursor-ew-resize"
              style={{ left: `${playhead}%` }}>
              <div className="w-3 h-3 bg-white rounded-full absolute -top-1 -left-[5px]" />
            </div>
            {/* Clickable overlay */}
            <div className="absolute inset-0 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setPlayhead(Math.round(((e.clientX - rect.left) / rect.width) * 100));
              }} />
          </div>
          {/* Timestamps match EP 3 duration: 23:02 */}
          <div className="flex justify-between text-[10px] text-gray-600 mb-2">
            <span>00:00</span><span>05:46</span><span>11:31</span><span>17:16</span><span>23:02</span>
          </div>

          {/* Emotion heat label */}
          <div className="flex items-center gap-2 mt-3">
            <Waves className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-gray-400">Emotion flow intensity — playhead at {playhead}%</span>
          </div>
        </div>

        {/* Channels */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Emotion Channels — Current Shot</h2>
          <div className="space-y-4">
            {channels.map((ch) => (
              <div key={ch.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-300">{ch.name}</span>
                  <span className="text-xs font-bold text-white">{ch.value}</span>
                </div>
                <div className={`relative h-6 ${ch.trackColor} rounded-full overflow-hidden`}>
                  <div className={`h-full ${ch.color} rounded-full transition-all`} style={{ width: `${ch.value}%` }} />
                  <input type="range" min="0" max="100" value={ch.value}
                    onChange={(e) => updateChannel(ch.id, Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-shot controls */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Per-Shot Controls — Shot 21 of 48</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Expression", value: "Rage + Desperation" },
              { label: "Camera", value: "Extreme Close-Up" },
              { label: "Voice Tone", value: "Strained / Breaking" },
              { label: "Music Cue", value: "Neon Pulse — Bar 8" },
            ].map((f) => (
              <div key={f.label} className="glass rounded-xl p-3 text-xs">
                <p className="text-gray-600 mb-1">{f.label}</p>
                <p className="text-gray-300 font-medium">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
