import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { MOCK_CHARACTERS } from "@/lib/mock-data";
import { Plus, Lock, Unlock, ChevronDown } from "lucide-react";

export default function CharacterDnaVaultPage() {
  return (
    <div>
      <DashHeader title="Character DNA Vault" description="Lock character profiles for series-wide consistency"
        actions={
          <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
            <Plus className="w-3.5 h-3.5" /> New Character
          </button>
        }
      />
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {MOCK_CHARACTERS.map((char) => (
            <div key={char.id} className="glass rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-start gap-4 p-5 border-b border-white/8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${char.avatarColor} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
                  {char.name.split(" ").map(n => n[0]).join("")}
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
                      {char.memoryLocked ? (
                        <div className="flex items-center gap-1 bg-indigo-500/15 border border-indigo-500/30 rounded-lg px-2 py-1">
                          <Lock className="w-3 h-3 text-indigo-400" />
                          <span className="text-xs text-indigo-300">Locked</span>
                        </div>
                      ) : (
                        <button className="flex items-center gap-1 glass glass-hover rounded-lg px-2 py-1">
                          <Unlock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">Lock</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">{char.description}</p>
                </div>
              </div>

              {/* Profile details */}
              <div className="p-5 grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "Emotion Profile", value: char.emotionProfile },
                  { label: "Voice Type", value: char.voiceType },
                ].map((f) => (
                  <div key={f.label} className="glass rounded-xl p-3">
                    <p className="text-gray-600 mb-1">{f.label}</p>
                    <p className="text-gray-300 font-medium">{f.value}</p>
                  </div>
                ))}
              </div>

              {/* Expandable sections */}
              {[
                { label: "Appearance", content: char.appearance },
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
                {char.memoryLocked && <span className="text-[10px] text-gray-600">Memory locked · Consistent across all episodes</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
