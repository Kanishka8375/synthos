import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  { num: "01", title: "Define your project", description: "Set genre, style, episode count, and target platforms. OpenClaw aligns all agents to your production parameters.", color: "border-indigo-500/40 bg-indigo-500/5" },
  { num: "02", title: "Build characters & worlds", description: "Create Character DNA profiles and World Atlas locations. Every visual attribute is locked for series-wide consistency.", color: "border-pink-500/40 bg-pink-500/5" },
  { num: "03", title: "Script & storyboard with AI", description: "Script Writer generates episode scripts. Storyboard Agent turns scenes into visual shot sequences — in minutes.", color: "border-violet-500/40 bg-violet-500/5" },
  { num: "04", title: "Render with AnimeDiffusion", description: "Your storyboard feeds directly into AnimeDiffusion. 48 scenes render in parallel across cloud GPU clusters.", color: "border-cyan-500/40 bg-cyan-500/5" },
  { num: "05", title: "Sync audio, voice & music", description: "Voice Synthesizer generates character dialogue. Music Composer scores each scene. Everything syncs to frame.", color: "border-emerald-500/40 bg-emerald-500/5" },
  { num: "06", title: "Distribute globally", description: "Multilingual Engine dubs your episode into 40+ languages with lip sync. Export to TikTok, YouTube, and more — one click.", color: "border-amber-500/40 bg-amber-500/5" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="How it works"
          title="Concept to series in"
          highlight="6 automated steps"
          subtitle="The entire production pipeline runs inside SYNTHOS. No external tools. No manual handoffs."
        />

        <div className="mt-16 space-y-4">
          {steps.map((step, i) => (
            <div key={step.num} className={`flex items-start gap-6 glass rounded-2xl p-6 border ${step.color}`}>
              <div className="text-3xl font-bold gradient-text shrink-0 w-12 text-right">{step.num}</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
