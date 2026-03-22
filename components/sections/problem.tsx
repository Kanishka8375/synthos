import { Camera, X, Building2, Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const tools = [
  { name: "RunwayML", pain: "Clips only — no story continuity" },
  { name: "Pika", pain: "No character consistency across shots" },
  { name: "Sora", pain: "No production pipeline or audio" },
  { name: "Kling AI", pain: "No script, soundtrack, or lore control" },
];

export function Problem() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="The problem"
          title="Every AI video tool is a camera."
          highlight="You need a studio."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Pain side */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-rose-500/15 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="font-semibold text-white">AI video tools today</p>
                <p className="text-xs text-gray-500">One-off clips. No continuity.</p>
              </div>
            </div>
            <div className="space-y-3">
              {tools.map((t) => (
                <div key={t.name} className="flex items-start gap-3 p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl">
                  <X className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-white">{t.name}</span>
                    <span className="text-sm text-gray-400"> — {t.pain}</span>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl text-sm text-gray-400">
                <strong className="text-rose-400">Result:</strong> You spend 80% of time stitching broken
                tools together. Characters look different shot to shot. No soundtrack. No lore. No pipeline.
              </div>
            </div>
          </div>

          {/* SYNTHOS side */}
          <div className="glass rounded-2xl p-6 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-500/15 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="font-semibold text-white">SYNTHOS Production Studio</p>
                <p className="text-xs text-gray-500">End-to-end. Automated. Consistent.</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "Script → Storyboard → Animation → Audio → Export in one pipeline",
                "Character DNA Vault keeps every character consistent across every shot",
                "Synthos AI Music Composer scores every scene adaptively",
                "Bible Keeper enforces lore, rules, and timeline consistency",
                "One-click multilingual dubbing with frame-accurate lip sync",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3 p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-xl">
                  <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-300">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
