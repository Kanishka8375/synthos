import {
  Brain,
  Workflow,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Users,
  Code2,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "OpenClaw AI Engine",
    description:
      "Harness the power of OpenClaw's advanced AI to automate decisions, generate content, and surface actionable insights across every workflow.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Workflow,
    title: "Visual Workflow Builder",
    description:
      "Drag-and-drop automation builder with 200+ integrations. Build complex multi-step workflows without writing a single line of code.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Deep insights into your business metrics. Custom dashboards, live data streams, and AI-generated reports — all in one place.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified, GDPR compliant, with end-to-end encryption. Your data stays yours — always protected, never shared.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: Zap,
    title: "Lightning Performance",
    description:
      "Sub-100ms response times across all operations. Edge-deployed infrastructure ensures your team never waits on the tools they need.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Globe,
    title: "Global Collaboration",
    description:
      "Real-time multiplayer editing, presence awareness, and async collaboration tools built for distributed teams across every timezone.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Users,
    title: "Team Management",
    description:
      "Granular role-based permissions, SSO/SAML support, and audit logs give admins complete control over who accesses what.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: Code2,
    title: "Developer API",
    description:
      "Full-featured REST and GraphQL APIs, webhooks, and SDKs for every major language. Extend SYNTHOS to fit your unique stack.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything you need to{" "}
            <span className="gradient-text">move faster</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            SYNTHOS brings together AI, automation, and analytics in a unified
            platform designed for modern teams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass glass-hover rounded-2xl p-6 group"
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
