"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";
import { SynthosLogo } from "@/components/ui/synthos-logo";
import { createClient } from "@/lib/supabase/client";

const PLAN_LABELS: Record<string, string> = {
  free:       "Free",
  creator:    "Creator · $29/mo",
  studio:     "Studio · $99/mo",
  enterprise: "Enterprise",
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function SignupForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const plan         = searchParams.get("plan") ?? "free";
  const planLabel    = PLAN_LABELS[plan] ?? "Free";
  const isFree       = plan === "free" || !PLAN_LABELS[plan];

  const [showPw, setShowPw]          = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]        = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors]          = useState<Record<string, string>>({});
  const [success, setSuccess]        = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setErrors({});
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (oauthError) {
      setErrors({ general: oauthError.message });
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd        = new FormData(e.currentTarget);
    const firstName = fd.get("firstName") as string;
    const lastName  = fd.get("lastName") as string;
    const email     = fd.get("email") as string;
    const pw        = fd.get("password") as string;
    const confirm   = fd.get("confirm") as string;
    const newErrors: Record<string, string> = {};

    if (pw.length < 8)    newErrors.password = "Password must be at least 8 characters.";
    if (pw !== confirm)   newErrors.confirm  = "Passwords do not match.";
    if (!fd.get("terms")) newErrors.terms    = "You must accept the terms to continue.";

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password: pw,
      options: {
        data: {
          full_name:   `${firstName} ${lastName}`.trim(),
          studio_name: `${firstName}'s Studio`,
          plan,
        },
      },
    });

    if (authError) {
      setErrors({ general: authError.message });
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (!signInError) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-gray-400 text-sm mb-6">
            We sent a confirmation link to your email address. Click it to activate your studio.
          </p>
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <SynthosLogo size={40} />
            <span className="text-2xl font-bold"><GradientText>SYNTHOS</GradientText></span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Open your studio</h1>
          <p className="text-gray-400 text-sm">
            {isFree
              ? "Free plan — no credit card required"
              : <>Starting on the <span className="text-indigo-400 font-medium">{planLabel}</span> plan</>
            }
          </p>
        </div>

        <div className="flex justify-center gap-4 flex-wrap mb-6">
          {[
            isFree ? "Free forever plan" : planLabel,
            "No lock-in",
            "Cancel anytime",
          ].map((b) => (
            <span key={b} className="flex items-center gap-1 text-xs text-gray-400">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> {b}
            </span>
          ))}
        </div>

        <div className="glass rounded-2xl p-8">
          {errors.general && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-5 text-sm text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.general}
            </div>
          )}

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed text-gray-800 py-3 rounded-xl font-semibold text-sm transition-all mb-5 shadow-sm"
          >
            <GoogleIcon />
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-gray-600">or sign up with email</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

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
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Password <span className="text-gray-600 font-normal">(8 characters minimum)</span>
              </label>
              <div className="relative">
                <input name="password" type={showPw ? "text" : "password"} placeholder="Create a strong password" required
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
                <input name="confirm" type={showConfirm ? "text" : "password"} placeholder="Repeat your password" required
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
                  <span className="text-indigo-400 underline underline-offset-2">Terms of Service</span>
                  {" "}and{" "}
                  <span className="text-indigo-400 underline underline-offset-2">Privacy Policy</span>
                </label>
              </div>
              {errors.terms && (
                <p className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                  <AlertCircle className="w-3 h-3" />{errors.terms}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading || googleLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.01] mt-2">
              {loading ? "Creating your studio…" : "Create studio"}
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-gray-500 text-sm">Loading…</span></div>}>
      <SignupForm />
    </Suspense>
  );
}
