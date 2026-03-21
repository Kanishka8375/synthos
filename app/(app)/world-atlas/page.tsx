"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { MOCK_LOCATIONS } from "@/lib/mock-data";
import type { Location } from "@/lib/types";
import { Globe2, Plus, Lock, Unlock, Sun, Moon, Sunrise, Sunset } from "lucide-react";

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

export default function WorldAtlasPage() {
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);

  const toggleLock = (id: string) => {
    setLocations(prev =>
      prev.map(l => l.id === id ? { ...l, locked: !l.locked } : l)
    );
  };

  return (
    <div>
      <DashHeader
        title="World Atlas"
        description="Locked location profiles for consistent world-building"
        actions={
          <button
            onClick={() => alert("New Location wizard — coming in v1.1")}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> New Location
          </button>
        }
      />
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {locations.map((loc) => {
            const TimeIcon = timeIcons[loc.timeOfDay] ?? Sun;
            return (
              <div key={loc.id} className="glass glass-hover rounded-2xl overflow-hidden group">
                {/* Visual header */}
                <div className="h-28 bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-purple-900/30 relative flex items-end p-3">
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[loc.type]}`}>{loc.type}</span>
                    <button
                      onClick={() => toggleLock(loc.id)}
                      className={`flex items-center gap-1 text-xs rounded-full px-1.5 py-0.5 border transition-all ${
                        loc.locked
                          ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25"
                          : "glass text-gray-500 border-white/10 hover:text-white"
                      }`}
                    >
                      {loc.locked ? <><Lock className="w-2.5 h-2.5" /> Locked</> : <><Unlock className="w-2.5 h-2.5" /> Lock</>}
                    </button>
                  </div>
                  <Globe2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-indigo-500/20" />
                  <div className="relative flex items-center gap-1.5 bg-black/40 rounded-lg px-2 py-1">
                    <TimeIcon className="w-3 h-3 text-amber-400" />
                    <span className="text-xs text-gray-300">{loc.timeOfDay}</span>
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

          {/* Add new location */}
          <button
            onClick={() => alert("New Location wizard — coming in v1.1")}
            className="glass rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 flex flex-col items-center justify-center gap-3 min-h-[200px] transition-all group"
          >
            <Plus className="w-8 h-8 text-gray-600 group-hover:text-indigo-400 transition-colors" />
            <p className="text-xs text-gray-600 group-hover:text-indigo-400 font-medium">Add Location</p>
          </button>
        </div>
      </div>
    </div>
  );
}
