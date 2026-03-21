"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

export function WaitlistCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="waitlist" className="py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <SectionHeading
          eyebrow="Early access"
          title="Join the"
          highlight="studio waitlist"
          subtitle="Get early access to SYNTHOS, founding creator pricing, and a direct line to our team."
        />

        <div className="mt-10">
          {submitted ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-lg font-semibold text-white">You&apos;re on the list!</p>
              <p className="text-sm text-gray-400">We&apos;ll reach out at <span className="text-indigo-300">{email}</span> when your studio is ready.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 shadow-lg shadow-indigo-600/25 whitespace-nowrap"
              >
                Join waitlist <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-xs text-gray-600 mt-4">No spam. Unsubscribe anytime. Founding creators get 40% off Studio plan.</p>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="flex -space-x-2">
            {["#4F46E5","#EC4899","#7C3AED","#0EA5E9","#10B981"].map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#07070f] flex items-center justify-center text-xs font-bold text-white" style={{ background: c }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            <span className="text-white font-semibold">2,400+ creators</span> already waiting
          </p>
        </div>
      </div>
    </section>
  );
}
