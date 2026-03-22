import { Cpu, Lock, Globe2, Workflow, Layers, Zap } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const diffs = [
  { icon: Cpu, title: "9-Agent AI Orchestra", description: "Synthos AI coordinates 9 specialized agents — Script, Storyboard, Voice, Music, Bible, Trend, Translation, Lip Sync, and Render — as a unified production pipeline.", color: "text-indigo-400 bg-indigo-500/10" },
  { icon: Lock, title: "DNA-Locked Consistency", description: "Character DNA Vault and World Atlas lock every visual attribute so your protagonist looks identical in shot 1 and shot 10,000.", color: "text-pink-400 bg-pink-500/10" },
  { icon: Workflow, title: "Visual Workflow Canvas", description: "Node-based pipeline editor lets you customize your production flow, add custom agents, and inspect every step in real-time.", color: "text-violet-400 bg-violet-500/10" },
  { icon: Layers, title: "Emotion Choreography", description: "Per-scene control over facial animation, voice tone, music mood, and camera language — all synced to your story's emotional arc.", color: "text-cyan-400 bg-cyan-500/10" },
  { icon: Globe2, title: "40+ Language Studio", description: "Translate, dub, and lip-sync your entire series into 40+ languages with voice-matched AI actors. One render, global audience.", color: "text-emerald-400 bg-emerald-500/10" },
  { icon: Zap, title: "Trend-Driven Production", description: "Trend Radar monitors TikTok, YouTube, Douyin, and Instagram 24/7 so you can align your next episode with what audiences actually want.", color: "text-amber-400 bg-amber-500/10" },
];

export function Differentiators() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Why SYNTHOS"
          title="Not a tool."
          highlight="A complete production system."
          subtitle="SYNTHOS is what happens when every step of the animation pipeline gets a dedicated AI agent and they all talk to each other."
        />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {diffs.map((d) => (
            <div key={d.title} className="glass glass-hover rounded-2xl p-6 group">
              <div className={`w-12 h-12 ${d.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <d.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{d.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{d.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
