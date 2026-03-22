"use client";
import { useState, useEffect } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { useToast } from "@/components/ui/toast";
import { Globe2, Plus, Lock, Unlock, Sun, Moon, Sunrise, Sunset, Image as ImageIcon, Loader2, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Location {
  id: string;
  name: string;
  type: string;
  time_of_day: string;
  mood: string;
  lighting: string;
  description: string;
  art_url?: string | null;
  locked: boolean;
  created_at?: string;
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
  const toast = useToast();
  const [locations,      setLocations]      = useState<Location[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [generatingArt,  setGeneratingArt]  = useState<string | null>(null);
  const [showModal,      setShowModal]      = useState(false);
  const [creating,       setCreating]       = useState(false);
  const [deletingId,     setDeletingId]     = useState<string | null>(null);

  const [newName,     setNewName]     = useState("");
  const [newType,     setNewType]     = useState("exterior");
  const [newTime,     setNewTime]     = useState("Day");
  const [newMood,     setNewMood]     = useState("Mysterious");
  const [newLighting, setNewLighting] = useState("Neon city glow");
  const [newDesc,     setNewDesc]     = useState("");

  /* Load from Supabase */
  useEffect(() => {
    fetch("/api/world/locations")
      .then(r => r.json())
      .then(d => setLocations(d.locations ?? []))
      .catch(() => toast.error("Failed to load locations"))
      .finally(() => setLoading(false));
  }, []);

  const toggleLock = async (loc: Location) => {
    const updated = !loc.locked;
    setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, locked: updated } : l));
    const res = await fetch(`/api/world/locations/${loc.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked: updated }),
    });
    if (!res.ok) {
      setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, locked: loc.locked } : l));
      toast.error("Failed to update lock status");
    }
  };

  const generateArt = async (loc: Location) => {
    setGeneratingArt(loc.id);
    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${loc.name}, ${loc.type} location, ${loc.time_of_day} lighting, ${loc.mood} atmosphere, ${loc.lighting}, highly detailed, cinematic`,
          style: "cinematic",
          width: 768,
          height: 432,
        }),
      });
      const data = await res.json();
      if (data.url) {
        setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, art_url: data.url } : l));
        await fetch(`/api/world/locations/${loc.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ art_url: data.url }),
        });
        toast.success("Art generated and saved");
      }
    } catch {
      toast.error("Art generation failed");
    } finally {
      setGeneratingArt(null);
    }
  };

  const createLocation = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/world/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:        newName.trim(),
          type:        newType,
          time_of_day: newTime,
          mood:        newMood,
          lighting:    newLighting,
          description: newDesc || `A ${newType} location with ${newMood.toLowerCase()} atmosphere.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const newLoc: Location = data.location;
      setLocations(prev => [newLoc, ...prev]);
      setShowModal(false);
      setNewName(""); setNewDesc("");
      toast.success(`"${newLoc.name}" added to World Atlas`);
      // Auto-generate art
      await generateArt(newLoc);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create location");
    } finally {
      setCreating(false);
    }
  };

  const deleteLocation = async (loc: Location) => {
    if (!window.confirm(`Delete "${loc.name}"?`)) return;
    setDeletingId(loc.id);
    const res = await fetch(`/api/world/locations/${loc.id}`, { method: "DELETE" });
    if (res.ok) {
      setLocations(prev => prev.filter(l => l.id !== loc.id));
      toast.success(`"${loc.name}" deleted`);
    } else {
      toast.error("Failed to delete location");
    }
    setDeletingId(null);
  };

  return (
    <div>
      <DashHeader
        title="World Atlas"
        description="Persistent location profiles for consistent world-building"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> New Location
          </button>
        }
      />

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="glass rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">New Location</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Location name <span className="text-rose-400">*</span></label>
                  <input
                    value={newName} onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Neon Bazaar District"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Type",        value: newType,     set: setNewType,     opts: LOCATION_TYPES },
                    { label: "Time of day", value: newTime,     set: setNewTime,     opts: TIME_OF_DAY    },
                    { label: "Mood",        value: newMood,     set: setNewMood,     opts: MOODS          },
                    { label: "Lighting",    value: newLighting, set: setNewLighting, opts: LIGHTINGS      },
                  ].map(({ label, value, set, opts }) => (
                    <div key={label}>
                      <label className="block text-xs font-medium text-gray-400 mb-2">{label}</label>
                      <select
                        value={value} onChange={e => set(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        {opts.map(o => <option key={o} value={o} className="bg-[#0a0a17] capitalize">{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2}
                    placeholder="e.g. A sprawling underground market lit by holographic signs…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>
                <p className="text-xs text-indigo-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> AI background art generated automatically via Pollinations.ai
                </p>
                <button
                  onClick={createLocation} disabled={creating || !newName.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all"
                >
                  {creating
                    ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving…</span>
                    : "Create Location"
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div className="h-36 bg-white/[0.04]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-white/[0.06] rounded w-2/3" />
                  <div className="h-3 bg-white/[0.04] rounded w-full" />
                  <div className="h-3 bg-white/[0.04] rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {locations.map((loc) => {
                const TimeIcon = timeIcons[loc.time_of_day] ?? Sun;
                return (
                  <motion.div
                    key={loc.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="glass glass-hover rounded-2xl overflow-hidden group"
                  >
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
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[loc.type] ?? typeColors.exterior}`}>
                          {loc.type}
                        </span>
                        <button
                          onClick={() => toggleLock(loc)}
                          className={`flex items-center gap-1 text-xs rounded-full px-1.5 py-0.5 border transition-all ${
                            loc.locked
                              ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25"
                              : "glass text-gray-500 border-white/10 hover:text-white"
                          }`}
                        >
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
                          <span className="text-xs text-gray-300">{loc.time_of_day}</span>
                        </div>
                        <button
                          onClick={() => generateArt(loc)}
                          disabled={generatingArt === loc.id}
                          className="flex items-center gap-1 text-[10px] bg-black/40 hover:bg-indigo-600/60 rounded-lg px-2 py-1 text-gray-300 hover:text-white transition-colors opacity-0 group-hover:opacity-100 border border-white/10 disabled:opacity-50"
                        >
                          <ImageIcon className="w-2.5 h-2.5" />
                          {loc.art_url ? "Regen" : "Generate art"}
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
                          <p className="text-gray-300 font-medium truncate">{loc.lighting?.split(",")[0]}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <OpenClawBadge label="Bible Keeper" size="sm" />
                        <button
                          onClick={() => deleteLocation(loc)}
                          disabled={deletingId === loc.id}
                          className="text-gray-700 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete location"
                        >
                          {deletingId === loc.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />
                          }
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Empty state + add button */}
            {locations.length === 0 && !loading && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                <Globe2 className="w-12 h-12 text-gray-700" />
                <p className="text-gray-600 text-sm">No locations yet</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-xs text-indigo-400 hover:bg-indigo-600/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Create your first location
                </button>
              </div>
            )}

            {locations.length > 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="glass rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 flex flex-col items-center justify-center gap-3 min-h-[200px] transition-all group"
              >
                <Plus className="w-8 h-8 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                <p className="text-xs text-gray-600 group-hover:text-indigo-400 font-medium">Add Location</p>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
