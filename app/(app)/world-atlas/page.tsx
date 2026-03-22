"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { MOCK_LOCATIONS } from "@/lib/mock-data";
import type { Location } from "@/lib/types";
import { Globe2, Plus, Lock, Unlock, Sun, Moon, Sunrise, Sunset, Image as ImageIcon, Loader2, X } from "lucide-react";

interface RichLocation extends Location {
  art_url?: string;
}

const typeColors: Record<string, string> = {
  interior: "bg-amber-500/15 text-amber-400",
  exterior: "bg-cyan-500/15 text-cyan-400",
  fantasy:  "bg-violet-500/15 text-violet-400",
  urban:    "bg-indigo-500/15 text-indigo-400",
  nature:   "bg-emerald-500/15 text-emerald-400",
};

const timeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Dawn:  Sunrise,
  Day:   Sun,
  Dusk:  Sunset,
  Night: Moon,
};

const LOCATION_TYPES = ["interior", "exterior", "fantasy", "urban", "nature"];
const TIME_OF_DAY    = ["Dawn", "Day", "Dusk", "Night"];
const MOODS          = ["Tense", "Peaceful", "Mysterious", "Melancholic", "Vibrant", "Eerie", "Romantic", "Epic"];
const LIGHTINGS      = ["Neon city glow", "Warm sunlight", "Moonlit shadows", "Overcast grey", "Candlelight", "Fluorescent"];

export default function WorldAtlasPage() {
  const [locations, setLocations]           = useState<RichLocation[]>(MOCK_LOCATIONS);
  const [generatingArt, setGeneratingArt]   = useState<string | null>(null);
  const [showModal, setShowModal]           = useState(false);
  const [creating, setCreating]             = useState(false);

  // New location form
  const [newName, setNewName]         = useState("");
  const [newType, setNewType]         = useState("exterior");
  const [newTime, setNewTime]         = useState("Day");
  const [newMood, setNewMood]         = useState("Mysterious");
  const [newLighting, setNewLighting] = useState("Neon city glow");
  const [newDesc, setNewDesc]         = useState("");

  const toggleLock = (id: string) =>
    setLocations(prev => prev.map(l => l.id === id ? { ...l, locked: !l.locked } : l));

  const generateArt = async (loc: RichLocation) => {
    setGeneratingArt(loc.id);
    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${loc.name}, ${loc.type} location, ${loc.timeOfDay} lighting, ${loc.mood} atmosphere, ${loc.lighting}, anime background art, highly detailed, cinematic`,
          width: 768,
          height: 432,
        }),
      });
      const data = await res.json();
      if (data.url) {
        setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, art_url: data.url } : l));
      }
    } catch { /* silent */ }
    finally { setGeneratingArt(null); }
  };

  const createLocation = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const newLoc: RichLocation = {
      id:          `loc-${Date.now()}`,
      name:        newName.trim(),
      type:        newType as Location["type"],
      timeOfDay:   newTime as Location["timeOfDay"],
      mood:        newMood,
      lighting:    newLighting,
      description: newDesc || `A ${newType} ${newName} with ${newMood.toLowerCase()} atmosphere.`,
      locked:      false,
    };
    setLocations(prev => [newLoc, ...prev]);
    setShowModal(false);
    setNewName(""); setNewDesc("");
    setCreating(false);
    // Auto-generate art
    await generateArt(newLoc);
  };

  return (
    <div>
      <DashHeader
        title="World Atlas"
        description="Locked location profiles for consistent world-building"
        actions={
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
            <Plus className="w-3.5 h-3.5" /> New Location
          </button>
        }
      />

      {/* New Location Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">New Location</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Location name <span className="text-rose-400">*</span></label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Neon Bazaar District"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Type</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                    {LOCATION_TYPES.map(t => <option key={t} value={t} className="bg-[#0a0a17] capitalize">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Time of day</label>
                  <select value={newTime} onChange={e => setNewTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                    {TIME_OF_DAY.map(t => <option key={t} value={t} className="bg-[#0a0a17]">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Mood</label>
                  <select value={newMood} onChange={e => setNewMood(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                    {MOODS.map(m => <option key={m} value={m} className="bg-[#0a0a17]">{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Lighting</label>
                  <select value={newLighting} onChange={e => setNewLighting(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                    {LIGHTINGS.map(l => <option key={l} value={l} className="bg-[#0a0a17]">{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Description</label>
                <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2}
                  placeholder="e.g. A sprawling underground market lit by holographic signs, overrun by street vendors…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
              </div>
              <p className="text-xs text-indigo-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> AI background art will be generated automatically via Pollinations.ai
              </p>
              <button onClick={createLocation} disabled={creating || !newName.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all">
                {creating ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creating…</span> : "Create Location"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {locations.map((loc) => {
            const TimeIcon = timeIcons[loc.timeOfDay] ?? Sun;
            return (
              <div key={loc.id} className="glass glass-hover rounded-2xl overflow-hidden group">
                {/* Visual header */}
                <div className="h-36 relative flex items-end p-3 overflow-hidden">
                  {loc.art_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={loc.art_url} alt={loc.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-purple-900/30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[loc.type]}`}>{loc.type}</span>
                    <button onClick={() => toggleLock(loc.id)}
                      className={`flex items-center gap-1 text-xs rounded-full px-1.5 py-0.5 border transition-all ${
                        loc.locked
                          ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25"
                          : "glass text-gray-500 border-white/10 hover:text-white"
                      }`}>
                      {loc.locked ? <><Lock className="w-2.5 h-2.5" /> Locked</> : <><Unlock className="w-2.5 h-2.5" /> Lock</>}
                    </button>
                  </div>

                  {generatingArt === loc.id && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                      <div className="text-center">
                        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mx-auto mb-1" />
                        <p className="text-xs text-gray-300">Generating art…</p>
                      </div>
                    </div>
                  )}

                  {!loc.art_url && generatingArt !== loc.id && (
                    <Globe2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-indigo-500/20" />
                  )}

                  <div className="relative flex items-center justify-between w-full z-10">
                    <div className="flex items-center gap-1.5 bg-black/40 rounded-lg px-2 py-1">
                      <TimeIcon className="w-3 h-3 text-amber-400" />
                      <span className="text-xs text-gray-300">{loc.timeOfDay}</span>
                    </div>
                    <button
                      onClick={() => generateArt(loc)}
                      disabled={generatingArt === loc.id}
                      className="flex items-center gap-1 text-[10px] bg-black/40 hover:bg-indigo-600/60 rounded-lg px-2 py-1 text-gray-300 hover:text-white transition-colors opacity-0 group-hover:opacity-100 border border-white/10 disabled:opacity-50">
                      <ImageIcon className="w-2.5 h-2.5" />
                      {loc.art_url ? "Regen art" : "Generate art"}
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm mb-1">{loc.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{loc.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="glass rounded-lg p-2">
                      <p className="text-gray-600 mb-0.5">Mood</p>
                      <p className="text-gray-300 font-medium">{loc.mood}</p>
                    </div>
                    <div className="glass rounded-lg p-2">
                      <p className="text-gray-600 mb-0.5">Lighting</p>
                      <p className="text-gray-300 font-medium truncate">{loc.lighting.split(",")[0]}</p>
                    </div>
                  </div>
                  <OpenClawBadge label="Bible Keeper" size="sm" />
                </div>
              </div>
            );
          })}

          <button onClick={() => setShowModal(true)}
            className="glass rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 flex flex-col items-center justify-center gap-3 min-h-[200px] transition-all group">
            <Plus className="w-8 h-8 text-gray-600 group-hover:text-indigo-400 transition-colors" />
            <p className="text-xs text-gray-600 group-hover:text-indigo-400 font-medium">Add Location</p>
          </button>
        </div>
      </div>
    </div>
  );
}
