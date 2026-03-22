"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { MOCK_BIBLE_ENTRIES } from "@/lib/mock-data";
import type { BibleEntry, BibleCategory } from "@/lib/types";
import { Plus, Lock, Unlock, Cpu, Sparkles, ChevronDown, Wand2, Loader2, X, CheckCircle2 } from "lucide-react";

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
  const [entries, setEntries]                   = useState<BibleEntry[]>(MOCK_BIBLE_ENTRIES);
  const [activeCategory, setActiveCategory]     = useState<BibleCategory | "All">("All");
  const [generatingId, setGeneratingId]         = useState<string | null>(null);

  // New entry modal
  const [showModal, setShowModal]     = useState(false);
  const [newTitle, setNewTitle]       = useState("");
  const [newCategory, setNewCategory] = useState<BibleCategory>("Lore");
  const [newPrompt, setNewPrompt]     = useState("");
  const [generating, setGenerating]   = useState(false);
  const [genError, setGenError]       = useState("");

  const toggleLock = (id: string) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, locked: !e.locked } : e));

  const expandEntry = async (entry: BibleEntry) => {
    if (entry.content.length > 100) return; // already has content
    setGeneratingId(entry.id);
    try {
      const res = await fetch("/api/generate/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Expand this production bible entry for an anime series:
Title: ${entry.title}
Category: ${entry.category}
Current notes: ${entry.content}
Write 3-4 detailed paragraphs with rich world-building details, rules, and implications.`,
          genre: "World Building",
          style: "Narrative",
        }),
      });
      const data = await res.json();
      if (data.content) {
        setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, content: data.content, aiGenerated: true } : e));
      }
    } catch { /* silent */ }
    finally { setGeneratingId(null); }
  };

  const createEntry = async () => {
    if (!newTitle.trim() || !newPrompt.trim()) return;
    setGenerating(true);
    setGenError("");

    try {
      const res = await fetch("/api/generate/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a detailed production bible entry for an anime series:
Category: ${newCategory}
Title: ${newTitle}
Context: ${newPrompt}
Format as 3-4 paragraphs covering all important rules, details, and world-building specifics.`,
          genre: "World Building",
          style: "Narrative",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      const newEntry: BibleEntry = {
        id:           `bible-${Date.now()}`,
        title:        newTitle.trim(),
        category:     newCategory,
        content:      data.content,
        aiGenerated:  true,
        locked:       false,
      };
      setEntries(prev => [newEntry, ...prev]);
      setShowModal(false);
      setNewTitle(""); setNewPrompt("");
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
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
            <OpenClawBadge label="Bible Keeper · Llama-3.3-70B" />
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
              <Plus className="w-3.5 h-3.5" /> New Entry
            </button>
          </div>
        }
      />

      {/* New Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-white">New Bible Entry</h2>
                <p className="text-xs text-gray-500 mt-0.5">AI-generated via Llama-3.3-70B</p>
              </div>
              <button onClick={() => { setShowModal(false); setGenError(""); }} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Title <span className="text-rose-400">*</span></label>
                  <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. The Neon Accords"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Category</label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value as BibleCategory)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0a0a17]">{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Describe this entry <span className="text-rose-400">*</span></label>
                <textarea value={newPrompt} onChange={e => setNewPrompt(e.target.value)} rows={4}
                  placeholder="e.g. A peace treaty between the three mega-corporations that governs tech sharing, but secretly contains a hidden clause allowing surveillance…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
              </div>
              {genError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">{genError}</div>
              )}
              <button onClick={createEntry} disabled={generating || !newTitle.trim() || !newPrompt.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all">
                {generating
                  ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Writing with Llama-3.3-70B…</span>
                  : <span className="flex items-center justify-center gap-2"><Wand2 className="w-4 h-4" /> Generate Entry</span>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Category sidebar */}
          <div className="glass rounded-2xl p-3 h-fit lg:sticky lg:top-16">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2 px-1">Categories</p>
            <button onClick={() => setActiveCategory("All")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs mb-1 transition-colors ${
                activeCategory === "All" ? "bg-indigo-600/20 text-indigo-300" : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}>
              <span>All categories</span>
              <span className="text-gray-600">{entries.length}</span>
            </button>
            {CATEGORIES.map((cat) => {
              const count = entries.filter(e => e.category === cat).length;
              if (count === 0) return null;
              return (
                <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? "All" : cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                    activeCategory === cat ? "bg-indigo-600/20 text-indigo-300" : "hover:bg-white/5 text-gray-500 hover:text-white"
                  }`}>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${categoryColors[cat]}`}>{cat}</span>
                  <span className="text-gray-600">{count}</span>
                </button>
              );
            })}

            <div className="mt-4 pt-4 border-t border-white/8">
              <button onClick={() => setShowModal(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                <Wand2 className="w-3.5 h-3.5" /> AI Generate Entry
              </button>
            </div>
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
                              <button onClick={(e) => { e.preventDefault(); toggleLock(entry.id); }}
                                className="text-gray-600 hover:text-indigo-400 transition-colors" title={entry.locked ? "Unlock" : "Lock"}>
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
                          <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            {entry.aiGenerated && <OpenClawBadge label="Auto-generated" size="sm" />}
                            {entry.locked && (
                              <span className="flex items-center gap-1 text-[10px] text-indigo-400">
                                <Cpu className="w-3 h-3" /> Enforced by Bible Keeper
                              </span>
                            )}
                            {!entry.aiGenerated && (
                              <button
                                onClick={() => expandEntry(entry)}
                                disabled={generatingId === entry.id}
                                className="flex items-center gap-1 text-[10px] glass glass-hover rounded-lg px-2 py-1 text-gray-500 hover:text-violet-400 transition-colors border border-white/10 disabled:opacity-50"
                              >
                                {generatingId === entry.id
                                  ? <><Loader2 className="w-2.5 h-2.5 animate-spin" /> Expanding…</>
                                  : <><Wand2 className="w-2.5 h-2.5" /> Expand with AI</>
                                }
                              </button>
                            )}
                            {entry.aiGenerated && entry.content.length > 100 && (
                              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> Full lore written
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
