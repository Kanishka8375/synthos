import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Pricing from "@/components/landing/pricing";
import Footer from "@/components/landing/footer";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />

      {/* OpenClaw Integration Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass rounded-3xl p-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-600/10 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 text-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                OpenClaw AI Engine
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Intelligence at the core of everything
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                OpenClaw powers every feature in SYNTHOS — from smart suggestions and
                automated workflows to predictive analytics and natural language interfaces.
                AI isn&apos;t a feature; it&apos;s the foundation.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              >
                Experience OpenClaw <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Pricing />

      {/* CTA Section */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to transform<br />
            <span className="gradient-text">how you work?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join 50,000+ teams already using SYNTHOS to build faster, smarter, and better.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-violet-600/25"
            >
              Start for free today <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">No credit card required. Free forever plan available.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
