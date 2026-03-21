import DashboardHeader from "@/components/dashboard/header";
import { Camera, Mail, Globe, Twitter, Linkedin, Github, Shield, Key, LogOut, Check } from "lucide-react";

export default function ProfilePage() {
  return (
    <div>
      <DashboardHeader title="Profile" description="Manage your personal account" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="glass rounded-2xl p-6 text-center lg:col-span-1 h-fit">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white mx-auto">
                JS
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-600 hover:bg-violet-500 rounded-xl flex items-center justify-center transition-colors shadow-lg">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-white">Jane Smith</h2>
            <p className="text-sm text-gray-400 mt-1">jane@company.com</p>
            <div className="mt-3">
              <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-medium">Workspace Owner</span>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Projects", value: "8" },
                { label: "Documents", value: "24" },
                { label: "Team", value: "8" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <button key={i} className="glass glass-hover w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-5">
            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-5">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "First name", value: "Jane" },
                  { label: "Last name", value: "Smith" },
                  { label: "Job title", value: "Product Manager" },
                  { label: "Company", value: "Acme Inc." },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs font-medium text-gray-400 mb-2">{field.label}</label>
                    <input
                      defaultValue={field.value}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-2">Bio</label>
                  <textarea
                    rows={3}
                    defaultValue="Building products that people love. AI enthusiast, coffee addict."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
                  />
                </div>
              </div>
              <button className="mt-4 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                <Check className="w-4 h-4" />
                Save changes
              </button>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-5">Contact & Links</h2>
              <div className="space-y-3">
                {[
                  { icon: Mail, label: "Email", value: "jane@company.com", placeholder: "your@email.com" },
                  { icon: Globe, label: "Website", value: "https://janesmith.dev", placeholder: "https://yourwebsite.com" },
                  { icon: Twitter, label: "Twitter / X", value: "@janesmith", placeholder: "@handle" },
                  { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/janesmith", placeholder: "linkedin.com/in/..." },
                ].map((field) => (
                  <div key={field.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 glass rounded-xl flex items-center justify-center shrink-0">
                      <field.icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      defaultValue={field.value}
                      placeholder={field.placeholder}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <button className="mt-4 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                <Check className="w-4 h-4" />
                Save changes
              </button>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-5">Security</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left">
                  <Key className="w-5 h-5 text-gray-400 group-hover:text-violet-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-300 group-hover:text-white">Change password</p>
                    <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left">
                  <Shield className="w-5 h-5 text-gray-400 group-hover:text-violet-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-300 group-hover:text-white">Two-factor authentication</p>
                    <p className="text-xs text-emerald-400">Enabled via authenticator app</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-500/10 transition-colors group text-left">
                  <LogOut className="w-5 h-5 text-gray-400 group-hover:text-rose-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-300 group-hover:text-rose-400">Sign out all devices</p>
                    <p className="text-xs text-gray-500">Invalidates all active sessions</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
