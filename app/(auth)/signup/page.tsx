"use client";
import { useState } from "react";
import Link from "next/link";
import { Cpu, Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";

export default function SignupPage() {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const pw = fd.get("password") as string;
    const confirm = fd.get("confirm") as string;
    const newErrors: Record<string, string> = {};

    if (pw.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (pw !== confirm) newErrors.confirm = "Passwords do not match.";
    if (!fd.get("terms")) newErrors.terms = "You must accept the terms.";

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});
    setLoading(true);
    setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
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
          <h1 className="text-3xl font-bold text-white mb-2">Open your studio</h1>
          <p className="text-gray-400 text-sm">Free forever plan — no credit card needed</p>
        </div>

        {/* Benefits */}
        <div className="flex justify-center gap-4 flex-wrap mb-6">
          {["Free plan", "No card required", "Cancel anytime"].map((b) => (
            <span key={b} className="flex items-center gap-1 text-xs text-gray-400">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> {b}
            </span>
          ))}
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">First name</label>
                <input name="firstName" type="text" placeholder="Jane" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Last name</label>
                <input name="lastName" type="text" placeholder="Smith" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Email</label>
              <input name="email" type="email" placeholder="creator@studio.com" required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? "text" : "password"} placeholder="Min. 8 characters" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Confirm password</label>
              <div className="relative">
                <input name="confirm" type={showConfirm ? "text" : "password"} placeholder="Repeat password" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm && <p className="text-xs text-rose-400 mt-1">{errors.confirm}</p>}
            </div>

            <div>
              <div className="flex items-start gap-2">
                <input name="terms" type="checkbox" id="terms" className="w-4 h-4 mt-0.5 accent-indigo-500" />
                <label htmlFor="terms" className="text-xs text-gray-400">
                  I agree to the{" "}
                  <Link href="#" className="text-indigo-400 hover:text-indigo-300">Terms of Service</Link> and{" "}
                  <Link href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</Link>
                </label>
              </div>
              {errors.terms && (
                <p className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                  <AlertCircle className="w-3 h-3" />{errors.terms}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.01] mt-2">
              {loading ? "Creating your studio..." : "Create studio"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Already have a studio?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
