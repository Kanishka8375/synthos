import { Check, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const features = [
  "Full episode pipeline",
  "Character consistency",
  "AI script writing",
  "AI storyboarding",
  "SynthRender AI rendering",
  "Adaptive music scoring",
  "Voice synthesis",
  "Multilingual lip sync",
  "Production Bible / Lore",
  "Trend Radar",
  "Visual Workflow Canvas",
  "Emotion Choreography",
];

const tools = [
  { name: "SYNTHOS", highlight: true, checks: [true, true, true, true, true, true, true, true, true, true, true, true] },
  { name: "RunwayML", highlight: false, checks: [false, false, false, false, true, false, false, false, false, false, false, false] },
  { name: "Pika", highlight: false, checks: [false, false, false, false, true, false, false, false, false, false, false, false] },
  { name: "Sora", highlight: false, checks: [false, false, false, false, true, false, false, false, false, false, false, false] },
  { name: "Kling AI", highlight: false, checks: [false, false, false, false, true, false, false, false, false, false, false, false] },
];

export function Comparison() {
  return (
    <section id="comparison" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="Comparison"
          title="SYNTHOS vs"
          highlight="everything else"
          subtitle="Other tools give you a camera. SYNTHOS gives you the whole studio."
        />

        <div className="mt-12 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr>
                <th className="text-left py-4 pr-4 text-gray-500 font-medium w-48">Feature</th>
                {tools.map((t) => (
                  <th key={t.name} className={`text-center py-4 px-3 font-semibold ${t.highlight ? "text-white" : "text-gray-500"}`}>
                    {t.highlight ? (
                      <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">{t.name}</span>
                    ) : t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {features.map((feature, fi) => (
                <tr key={feature} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 text-gray-300 text-sm">{feature}</td>
                  {tools.map((t) => (
                    <td key={t.name} className="py-3 px-3 text-center">
                      {t.checks[fi] ? (
                        <Check className={`w-4 h-4 mx-auto ${t.highlight ? "text-indigo-400" : "text-gray-600"}`} />
                      ) : (
                        <X className="w-4 h-4 mx-auto text-gray-700" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
