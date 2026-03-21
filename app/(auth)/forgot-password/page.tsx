"use client";
import { useState } from "react";
import Link from "next/link";
import { Cpu, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setSent(true); setLoading(false); }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold"><GradientText>SYNTHOS</GradientText></span>
          </Link>
        </div>

        <div className="glass rounded-2xl p-8 text-center">
          {sent ? (
            <div className="py-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-sm text-gray-400 mb-6">
                We&apos;ve sent a reset link to <span className="text-indigo-300 font-medium">{email}</span>.
                The link expires in 15 minutes.
              </p>
              <button onClick={() => setSent(false)} className="text-sm text-indigo-400 hover:text-indigo-300">
                Try a different email
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Mail className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Reset your password</h2>
              <p className="text-sm text-gray-400 mb-6">
                Enter your email and we&apos;ll send a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Email address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@studio.com" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-all">
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/login" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
