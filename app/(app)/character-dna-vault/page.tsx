"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { MOCK_CHARACTERS } from "@/lib/mock-data";
import type { Character } from "@/lib/types";
import { Plus, Lock, Unlock, ChevronDown, Image as ImageIcon, Loader2, Wand2, X, User } from "lucide-react";

interface RichCharacter extends Character {
  portrait_url?: string;
  backstory?: string;
}

const EMOTION_PROFILES = ["Stoic", "Energetic", "Melancholic", "Cheerful", "Cold", "Passionate", "Mysterious", "Gentle"];
const VOICE_TYPES = ["Deep Baritone", "Soft Soprano", "Husky Alto", "Clear Tenor", "Raspy Bass", "Bright Mezzo"];
const ROLES = ["Protagonist", "Antagonist", "Supporting", "Mentor", "Anti-hero", "Comic Relief", "Love Interest"];

export default function CharacterDnaVaultPage() {
  const [characters, setCharacters]         = useState<RichCharacter[]>(MOCK_CHARACTERS);
  const [generatingPortrait, setGeneratingPortrait] = useState<string | null>(null);
  const [generatingBackstory, setGeneratingBackstory] = useState<string | null>(null);
  const [expandedBackstory, setExpandedBackstory] = useState<string | null>(null);

  // New character modal
  const [showModal, setShowModal]   = useState(false);
  const [creating, setCreating]     = useState(false);
  const [newName, setNewName]       = useState("");
  const [newRole, setNewRole]       = useState("Protagonist");
  const [newEmotion, setNewEmotion] = useState("Stoic");
  const [newVoice, setNewVoice]     = useState("Clear Tenor");
  const [newDesc, setNewDesc]       = useState("");

  const toggleLock = (id: string) =>
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, memoryLocked: !c.memoryLocked } : c));

  const generatePortrait = async (char: RichCharacter) => {
    setGeneratingPortrait(char.id);
    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${char.name}, ${char.role}, anime character portrait, ${char.appearance}, ${char.emotionProfile} expression, detailed face, close-up, studio lighting`,
          width: 512,
          height: 512,
        }),
      });
      const data = await res.json();
      if (data.url) {
        setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, portrait_url: data.url } : c));
      }
    } catch { /* silent */ }
    finally { setGeneratingPortrait(null); }
  };

  const generateBackstory = async (char: RichCharacter) => {
    setGeneratingBackstory(char.id);
    try {
      const res = await fetch("/api/generate/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a compelling 3-paragraph origin backstory for this anime character:
Name: ${char.name}
Role: ${char.role}
Personality: ${char.personality}
Appearance: ${char.appearance}
Keep it mysterious, dramatic, and fitting for a ${char.role} character.`,
          genre: "Character Lore",
          style: "Narrative",
        }),
      });
      const data = await res.json();
      if (data.content) {
        setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, backstory: data.content } : c));
        setExpandedBackstory(char.id);
      }
    } catch { /* silent */ }
    finally { setGeneratingBackstory(null); }
  };

  const createCharacter = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const newChar: RichCharacter = {
      id: `char-${Date.now()}`,
      name: newName.trim(),
      role: newRole,
      emotionProfile: newEmotion,
      voiceType: newVoice,
      description: newDesc || `${newRole} character with ${newEmotion.toLowerCase()} disposition.`,
      appearance: `${newEmotion} anime character`,
      personality: newDesc || `A ${newRole.toLowerCase()} with a ${newEmotion.toLowerCase()} personality.`,
      consistency: 100,
      memoryLocked: false,
      avatarColor: "from-indigo-500 to-violet-500",
    };
    setCharacters(prev => [newChar, ...prev]);
    setShowModal(false);
    setNewName(""); setNewDesc("");
    setCreating(false);
    // Auto-generate portrait
    await generatePortrait(newChar);
  };

  return (
    <div>
      <DashHeader
        title="Character DNA Vault"
        description="Lock character profiles for series-wide consistency"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> New Character
          </button>
        }
      />

      {/* New Character Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">New Character</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Character name <span className="text-rose-400">*</span></label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Kaito Mura"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Role</label>
                  <select value={newRole} onChange={e => setNewRole(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors">
                    {ROLES.map(r => <option key={r} value={r} className="bg-[#0a0a17]">{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Emotion</label>
                  <select value={newEmotion} onChange={e => setNewEmotion(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors">
                    {EMOTION_PROFILES.map(e => <option key={e} value={e} className="bg-[#0a0a17]">{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Voice</label>
                  <select value={newVoice} onChange={e => setNewVoice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors">
                    {VOICE_TYPES.map(v => <option key={v} value={v} className="bg-[#0a0a17]">{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Description / appearance</label>
                <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={3}
                  placeholder="e.g. Silver-haired swordsman with cybernetic eye, calm demeanor hiding deep trauma…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
              </div>
              <p className="text-xs text-indigo-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> AI portrait will be generated automatically via Pollinations.ai
              </p>
              <button onClick={createCharacter} disabled={creating || !newName.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all">
                {creating ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creating…</span> : "Create Character"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {characters.map((char) => (
            <div key={char.id} className="glass rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-start gap-4 p-5 border-b border-white/8">
                {/* Portrait */}
                <div className="relative shrink-0">
                  {char.portrait_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={char.portrait_url} alt={char.name}
                      className="w-16 h-16 rounded-2xl object-cover" />
                  ) : (
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${char.avatarColor} flex items-center justify-center text-white text-xl font-bold`}>
                      {char.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                  {generatingPortrait === char.id && (
                    <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white">{char.name}</h3>
                      <p className="text-xs text-gray-500">{char.role}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-center">
                        <div className="text-lg font-bold gradient-text">{char.consistency}%</div>
                        <div className="text-[10px] text-gray-600">DNA Lock</div>
                      </div>
                      <button onClick={() => toggleLock(char.id)}
                        className={`flex items-center gap-1 rounded-lg px-2 py-1 transition-all border text-xs font-medium ${
                          char.memoryLocked
                            ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25"
                            : "glass glass-hover text-gray-500 border-white/10 hover:text-white"
                        }`}
                      >
                        {char.memoryLocked ? <><Lock className="w-3 h-3" /> Locked</> : <><Unlock className="w-3 h-3" /> Lock</>}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">{char.description}</p>

                  {/* AI action buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => generatePortrait(char)}
                      disabled={generatingPortrait === char.id}
                      className="flex items-center gap-1 text-[10px] glass glass-hover rounded-lg px-2 py-1 text-gray-400 hover:text-indigo-300 transition-colors border border-white/10 disabled:opacity-50">
                      {generatingPortrait === char.id
                        ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        : <ImageIcon className="w-2.5 h-2.5" />
                      }
                      {char.portrait_url ? "Regen portrait" : "Generate portrait"}
                    </button>
                    <button onClick={() => generateBackstory(char)}
                      disabled={generatingBackstory === char.id}
                      className="flex items-center gap-1 text-[10px] glass glass-hover rounded-lg px-2 py-1 text-gray-400 hover:text-violet-300 transition-colors border border-white/10 disabled:opacity-50">
                      {generatingBackstory === char.id
                        ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        : <Wand2 className="w-2.5 h-2.5" />
                      }
                      {char.backstory ? "Regen backstory" : "Generate backstory"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile details */}
              <div className="p-5 grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "Emotion Profile", value: char.emotionProfile },
                  { label: "Voice Type",      value: char.voiceType },
                ].map((f) => (
                  <div key={f.label} className="glass rounded-xl p-3">
                    <p className="text-gray-600 mb-1">{f.label}</p>
                    <p className="text-gray-300 font-medium">{f.value}</p>
                  </div>
                ))}
              </div>

              {/* AI Backstory */}
              {char.backstory && (
                <div className="border-t border-white/8">
                  <button
                    onClick={() => setExpandedBackstory(expandedBackstory === char.id ? null : char.id)}
                    className="flex items-center justify-between w-full px-5 py-3 hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="text-xs font-medium text-violet-400 flex items-center gap-1.5">
                      <Wand2 className="w-3 h-3" /> AI Backstory
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform ${expandedBackstory === char.id ? "rotate-180" : ""}`} />
                  </button>
                  {expandedBackstory === char.id && (
                    <div className="px-5 pb-4">
                      <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">{char.backstory}</p>
                    </div>
                  )}
                </div>
              )}

              {[
                { label: "Appearance",  content: char.appearance },
                { label: "Personality", content: char.personality },
              ].map((section) => (
                <details key={section.label} className="border-t border-white/8">
                  <summary className="flex items-center justify-between px-5 py-3 cursor-pointer list-none hover:bg-white/[0.03] transition-colors">
                    <span className="text-xs font-medium text-gray-400">{section.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
                  </summary>
                  <div className="px-5 pb-4">
                    <p className="text-xs text-gray-400 leading-relaxed">{section.content}</p>
                  </div>
                </details>
              ))}

              <div className="px-5 pb-4 flex items-center gap-2">
                <OpenClawBadge label="Bible Keeper" size="sm" />
                {char.memoryLocked && (
                  <span className="text-[10px] text-gray-600">Memory locked · Consistent across all episodes</span>
                )}
                {!char.portrait_url && !generatingPortrait && (
                  <span className="text-[10px] text-gray-600 flex items-center gap-1">
                    <User className="w-2.5 h-2.5" /> No portrait yet
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
