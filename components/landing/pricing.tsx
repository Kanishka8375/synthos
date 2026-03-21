import Link from "next/link";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for individuals and small projects.",
    features: [
      "5 active projects",
      "1,000 OpenClaw AI requests/mo",
      "Basic analytics",
      "Community support",
      "2 team members",
    ],
    cta: "Get started free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For growing teams that need more power.",
    features: [
      "Unlimited projects",
      "50,000 OpenClaw AI requests/mo",
      "Advanced analytics & reports",
      "Priority support",
      "25 team members",
      "Custom integrations",
      "API access",
    ],
    cta: "Start free trial",
    href: "/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large organizations with advanced needs.",
    features: [
      "Unlimited everything",
      "Unlimited OpenClaw AI",
      "Dedicated infrastructure",
      "24/7 enterprise support",
      "Unlimited team members",
      "SSO/SAML & audit logs",
      "SLA guarantee",
      "Custom contracts",
    ],
    cta: "Contact sales",
    href: "/signup?plan=enterprise",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            Start free. Upgrade as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? "bg-gradient-to-b from-violet-600/30 to-violet-900/20 border-2 border-violet-500/50"
                  : "glass"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-violet-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Zap className="w-3 h-3" />
                    Most popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm">/{plan.period}</span>
                </div>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25"
                    : "glass glass-hover text-gray-300 hover:text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
