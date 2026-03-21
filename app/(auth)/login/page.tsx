"use client";
import { useState } from "react";
import Link from "next/link";
import { Cpu, Eye, EyeOff, AlertCircle } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simulate auth — redirect to dashboard
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
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
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to your production studio</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-5 text-sm text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Email address</label>
              <input type="email" placeholder="creator@studio.com" required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-400">Password</label>
                <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 accent-indigo-500" />
              <label htmlFor="remember" className="text-xs text-gray-400">Keep me signed in</label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.01]">
              {loading ? "Signing in..." : "Sign in to studio"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/8" /></div>
            <div className="relative text-center"><span className="bg-[#07070f] px-4 text-xs text-gray-600">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["GitHub", "Google"].map((p) => (
              <button key={p} className="glass glass-hover py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-all">{p}</button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Don&apos;t have a studio yet?{" "}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">Create account</Link>
        </p>
      </div>
    </div>
  );
}
