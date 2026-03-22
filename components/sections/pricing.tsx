"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { PRICING_TIERS } from "@/lib/constants";

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Pricing"
          title="Start free."
          highlight="Scale your studio."
          subtitle="No hidden fees. Cancel anytime. All plans include Synthos AI Engine access."
        />

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mt-8 mb-14">
          <span className={`text-sm ${!annual ? "text-white" : "text-gray-500"}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-indigo-600" : "bg-white/10"}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${annual ? "left-7" : "left-1"}`} />
          </button>
          <span className={`text-sm ${annual ? "text-white" : "text-gray-500"}`}>
            Annual <span className="text-emerald-400 font-medium">Save 20%</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl p-6 ${
                tier.highlighted
                  ? "bg-gradient-to-b from-indigo-600/30 to-indigo-900/20 border-2 border-indigo-500/50"
                  : "glass"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Zap className="w-3 h-3" /> Most popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-bold text-white text-lg mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  {typeof tier.price === "number" ? (
                    <>
                      <span className="text-3xl font-bold text-white">
                        ${annual ? Math.round(tier.price * 0.8) : tier.price}
                      </span>
                      <span className="text-gray-400 text-sm">/mo</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-white">{tier.price}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{tier.description}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.price === 0 ? "/signup" : "/signup?plan=" + tier.name.toLowerCase()}
                className={`block text-center py-3 rounded-xl font-semibold transition-all text-sm ${
                  tier.highlighted
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25"
                    : "glass glass-hover text-gray-300 hover:text-white"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
