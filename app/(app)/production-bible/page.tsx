"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { MOCK_BIBLE_ENTRIES } from "@/lib/mock-data";
import type { BibleEntry, BibleCategory } from "@/lib/types";
import { Plus, Lock, Unlock, Cpu, Sparkles, ChevronDown } from "lucide-react";

const categoryColors: Record<BibleCategory, string> = {
  Character: "bg-indigo-500/15 text-indigo-400",
  Location:  "bg-cyan-500/15 text-cyan-400",
  Lore:      "bg-violet-500/15 text-violet-400",
  Rules:     "bg-rose-500/15 text-rose-400",
  Timeline:  "bg-amber-500/15 text-amber-400",
  Palette:   "bg-pink-500/15 text-pink-400",
};

const CATEGORIES: BibleCategory[] = ["Character", "Location", "Lore", "Rules", "Timeline", "Palette"];

export default function ProductionBiblePage() {
  const [entries, setEntries]           = useState<BibleEntry[]>(MOCK_BIBLE_ENTRIES);
  const [activeCategory, setActiveCategory] = useState<BibleCategory | "All">("All");

  const toggleLock = (id: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, locked: !e.locked } : e));
  };

  const visibleCategories = (activeCategory === "All" ? CATEGORIES : [activeCategory])
    .filter(cat => entries.some(e => e.category === cat));

  return (
    <div>
      <DashHeader
        title="Production Bible"
        description="Auto-maintained story lore and rules"
        actions={
          <div className="flex items-center gap-2">
            <OpenClawBadge label="Bible Keeper" />
            <button
              onClick={() => alert("New Bible Entry — coming in v1.1")}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> New Entry
            </button>
          </div>
        }
      />
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Category sidebar */}
          <div className="glass rounded-2xl p-3 h-fit lg:sticky lg:top-16">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2 px-1">Categories</p>
            <button
              onClick={() => setActiveCategory("All")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs mb-1 transition-colors ${
                activeCategory === "All"
                  ? "bg-indigo-600/20 text-indigo-300"
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>All categories</span>
              <span className="text-gray-600">{entries.length}</span>
            </button>
            {CATEGORIES.map((cat) => {
              const count = entries.filter(e => e.category === cat).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? "All" : cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                    activeCategory === cat
                      ? "bg-indigo-600/20 text-indigo-300"
                      : "hover:bg-white/5 text-gray-500 hover:text-white"
                  }`}
                >
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${categoryColors[cat]}`}>{cat}</span>
                  <span className="text-gray-600">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Entries */}
          <div className="lg:col-span-3 space-y-4">
            {visibleCategories.map((cat) => {
              const catEntries = entries.filter(e => e.category === cat);
              return (
                <div key={cat} className="glass rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${categoryColors[cat]}`}>{cat}</span>
                    <span className="text-xs text-gray-600">{catEntries.length} entries</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {catEntries.map((entry) => (
                      <details key={entry.id} className="group">
                        <summary className="flex items-start justify-between px-5 py-4 cursor-pointer list-none hover:bg-white/[0.03]">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-white">{entry.title}</p>
                              <button
                                onClick={(e) => { e.preventDefault(); toggleLock(entry.id); }}
                                className="text-gray-600 hover:text-indigo-400 transition-colors"
                                title={entry.locked ? "Unlock" : "Lock"}
                              >
                                {entry.locked ? <Lock className="w-3 h-3 text-indigo-400" /> : <Unlock className="w-3 h-3" />}
                              </button>
                              {entry.aiGenerated && (
                                <span className="flex items-center gap-1 text-[10px] bg-violet-500/15 text-violet-400 px-1.5 py-0.5 rounded">
                                  <Sparkles className="w-2.5 h-2.5" /> AI
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-600 group-open:rotate-180 transition-transform mt-0.5 shrink-0 ml-3" />
                        </summary>
                        <div className="px-5 pb-4">
                          <p className="text-xs text-gray-400 leading-relaxed">{entry.content}</p>
                          <div className="flex items-center gap-2 mt-3">
                            {entry.aiGenerated && <OpenClawBadge label="Auto-generated" size="sm" />}
                            {entry.locked && (
                              <span className="flex items-center gap-1 text-[10px] text-indigo-400">
                                <Cpu className="w-3 h-3" /> Enforced by Bible Keeper
                              </span>
                            )}
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
