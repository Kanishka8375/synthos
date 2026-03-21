import { FileText, Image, Users, Waves, Music2, Globe2, TrendingUp, Cpu } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";

const features = [
  { icon: FileText, title: "Script Writer", description: "Generate full episode scripts from a brief. Control tone, pacing, genre, and character voice — all aligned with your Production Bible.", agent: "Script Writer" },
  { icon: Image, title: "AnimeDiffusion", description: "Proprietary diffusion model fine-tuned for anime and cinematic animation. Consistent style across every frame, every episode.", agent: "Render Optimizer" },
  { icon: Users, title: "Character DNA Vault", description: "Lock character appearance, personality, voice, and emotional range into permanent DNA profiles that carry across your entire series.", agent: "Bible Keeper" },
  { icon: Waves, title: "Emotion Choreography", description: "Map your story's emotional arc to facial animation, voice tone, music, and camera movement — scene by scene, shot by shot.", agent: "Voice Synthesizer" },
  { icon: Music2, title: "Soundtrack Forge", description: "AI music composition that adapts to scene mood, pacing, and emotion. Original scores generated per episode, never repeated.", agent: "Music Composer" },
  { icon: Globe2, title: "Multilingual Engine", description: "Full pipeline translation with culturally-adapted dialogue, voice-matched AI actors, and frame-accurate lip sync in 40+ languages.", agent: "Translation Engine" },
  { icon: TrendingUp, title: "Trend Radar", description: "Real-time monitoring of what's trending across TikTok, YouTube, Douyin, and Instagram. Let data inform your next production.", agent: "Trend Analyzer" },
  { icon: Cpu, title: "Workflow Canvas", description: "Visual node-based editor to customize your entire production pipeline. Plug in custom agents, fork workflows per episode, and debug step by step.", agent: "Render Optimizer" },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Core features"
          title="8 pillars of the"
          highlight="AI production studio"
          subtitle="Each feature is powered by a dedicated OpenClaw agent — specialized, fast, and designed to work together."
        />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glass glass-hover rounded-2xl p-5 group flex flex-col">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <f.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-4">{f.description}</p>
              <OpenClawBadge label={f.agent} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
