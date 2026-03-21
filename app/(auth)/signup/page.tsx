import Link from "next/link";
import { Zap, Check } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">SYNTHOS</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Start building with SYNTHOS for free</p>
        </div>

        {/* Benefits */}
        <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
          {["Free forever plan", "No credit card", "Cancel anytime"].map((benefit) => (
            <div key={benefit} className="flex items-center gap-1.5 text-sm text-gray-400">
              <Check className="w-4 h-4 text-emerald-400" />
              {benefit}
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-8">
          <form className="space-y-5" action="/dashboard" method="GET">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First name</label>
                <input
                  type="text"
                  placeholder="Jane"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last name</label>
                <input
                  type="text"
                  placeholder="Smith"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Work email</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company (optional)</label>
              <input
                type="text"
                placeholder="Acme Inc."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 accent-violet-500" required />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I agree to the{" "}
                <Link href="#" className="text-violet-400 hover:text-violet-300">Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" className="text-violet-400 hover:text-violet-300">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-violet-600/25"
            >
              Create account
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative text-center">
              <span className="bg-[#0a0a14] px-4 text-sm text-gray-500">or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["GitHub", "Google"].map((provider) => (
              <button
                key={provider}
                className="glass glass-hover py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all"
              >
                {provider}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
