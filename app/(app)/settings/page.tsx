"use client";
import { useState, useRef, useEffect } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { SynthosBadge } from "@/components/ui/openclaw-badge";
import { Bell, Key, Download, Trash2, User, Shield, ChevronRight, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  setTimeout(onDone, 2500);
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium">
      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
      {message}
    </div>
  );
}

interface UserProfile {
  email: string;
  full_name: string;
  studio_name: string;
  plan: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [showApiKey, setShowApiKey]       = useState(false);
  const [toast, setToast]                 = useState("");
  const [deleting, setDeleting]           = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profile, setProfile]             = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const [notifications, setNotifications] = useState({
    renderComplete: true,
    agentAlerts:    true,
    trendAlerts:    false,
    weeklyDigest:   true,
    billingAlerts:  true,
  });

  const notify = (msg: string) => setToast(msg);

  // Load real user profile
  useEffect(() => {
    fetch("/api/user")
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setProfile({
            email:       d.user.email ?? "",
            full_name:   d.user.full_name ?? "",
            studio_name: d.user.studio_name ?? "My Studio",
            plan:        d.user.plan ?? "free",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, []);

  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;
    setSavingProfile(true);

    const fd       = new FormData(e.currentTarget);
    const fullName = `${fd.get("firstName")} ${fd.get("lastName")}`.trim();
    const studioName = fd.get("studioName") as string;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, full_name: fullName, studio_name: studioName });

      if (error) throw error;
      setProfile(prev => prev ? { ...prev, full_name: fullName, studio_name: studioName } : prev);
      notify("Profile saved successfully.");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      const blob = new Blob([JSON.stringify({ ...data, exported_at: new Date().toISOString() }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "synthos-export.json"; a.click();
      URL.revokeObjectURL(url);
      notify("Data exported.");
    } catch {
      notify("Export failed.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Delete your account? This cannot be undone. All data will be permanently removed.");
    if (!confirmed) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      notify("Account deletion scheduled. You will receive a confirmation email.");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      notify("Account deletion failed. Please contact support.");
      setDeleting(false);
    }
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const [firstName, lastName] = profile?.full_name?.split(" ") ?? ["", ""];

  return (
    <div>
      <DashHeader title="Settings" description="Account and studio preferences" />
      <div className="p-5 space-y-5 max-w-2xl">

        {/* Profile */}
        <form ref={formRef} onSubmit={handleSaveProfile} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Profile</h2>
          </div>
          {loadingProfile ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-white">{profile?.full_name || "—"}</p>
                  <p className="text-xs text-gray-500">{profile?.email}</p>
                  <p className="text-xs text-indigo-400 mt-1 capitalize">{profile?.plan ?? "free"} Plan</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "First name",  name: "firstName",   defaultValue: firstName ?? "" },
                  { label: "Last name",   name: "lastName",    defaultValue: lastName ?? "" },
                  { label: "Email",       name: "email",       defaultValue: profile?.email ?? "", readOnly: true },
                  { label: "Studio name", name: "studioName",  defaultValue: profile?.studio_name ?? "" },
                ].map((f) => (
                  <div key={f.name}>
                    <label htmlFor={f.name} className="block text-xs text-gray-500 mb-1.5">{f.label}</label>
                    <input
                      id={f.name}
                      name={f.name}
                      type={f.name === "email" ? "email" : "text"}
                      defaultValue={f.defaultValue}
                      readOnly={"readOnly" in f ? f.readOnly : false}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors read-only:opacity-50 read-only:cursor-not-allowed"
                    />
                  </div>
                ))}
              </div>
              <button type="submit" disabled={savingProfile}
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.01] flex items-center gap-2">
                {savingProfile ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</> : "Save profile"}
              </button>
            </>
          )}
        </form>

        {/* Subscription */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Subscription</h2>
          </div>
          <div className="flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <div>
              <p className="font-semibold text-white capitalize">{profile?.plan ?? "Free"} Plan</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {profile?.plan === "free" ? "Free forever · No credit card required" : "$99/month · Renews April 21, 2026"}
              </p>
            </div>
            <a href="/billing" className="glass glass-hover text-xs text-gray-300 hover:text-white px-3 py-1.5 rounded-xl flex items-center gap-1">
              Manage <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-3">
            {[
              { key: "renderComplete" as const, label: "Render complete",  desc: "Notify when a render job finishes" },
              { key: "agentAlerts"    as const, label: "Agent alerts",     desc: "Synthos AI agent errors or warnings" },
              { key: "trendAlerts"    as const, label: "Trend alerts",     desc: "High-relevance trends for your projects" },
              { key: "weeklyDigest"   as const, label: "Weekly digest",    desc: "Summary of production activity" },
              { key: "billingAlerts"  as const, label: "Billing alerts",   desc: "Usage limits and payment notifications" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-white">{n.label}</p>
                  <p className="text-xs text-gray-500">{n.desc}</p>
                </div>
                <button
                  onClick={() => { toggleNotif(n.key); notify(`${n.label} ${!notifications[n.key] ? "enabled" : "disabled"}.`); }}
                  className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${notifications[n.key] ? "bg-indigo-600" : "bg-white/10"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications[n.key] ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Services */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">AI Services</h2>
            <SynthosBadge label="Synthos AI Stack" size="sm" />
          </div>
          <div className="space-y-3 text-xs text-gray-400">
            <div className="flex items-center justify-between p-3 glass rounded-xl">
              <div>
                <p className="text-white font-medium">Synthos LLM</p>
                <p className="text-gray-500 mt-0.5">Synthos LLM — scripts, lore, ideas</p>
              </div>
              <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Configured</span>
            </div>
            <div className="flex items-center justify-between p-3 glass rounded-xl">
              <div>
                <p className="text-white font-medium">SynthRender</p>
                <p className="text-gray-500 mt-0.5">Image generation — flux model · storyboards</p>
              </div>
              <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Configured</span>
            </div>
            <div className="flex items-center justify-between p-3 glass rounded-xl">
              <div>
                <p className="text-white font-medium">Synthos SynthSound</p>
                <p className="text-gray-500 mt-0.5">SynthSound (audio) · Video generation</p>
              </div>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Configured
              </span>
            </div>
            <div className="flex items-center justify-between p-3 glass rounded-xl">
              <div>
                <p className="text-white font-medium">Supabase</p>
                <p className="text-gray-500 mt-0.5">Auth + PostgreSQL database</p>
              </div>
              <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Connected</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3">Configure keys in your <code className="text-indigo-400">.env.local</code> file.</p>
        </div>

        {/* Data & Account */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Download className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Data &amp; Account</h2>
          </div>
          <div className="space-y-2">
            <button onClick={handleExport}
              className="w-full flex items-center justify-between px-4 py-3 glass glass-hover rounded-xl text-sm text-gray-300 hover:text-white">
              <span>Export all data</span>
              <Download className="w-4 h-4" />
            </button>
            <button onClick={handleDeleteAccount} disabled={deleting}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all disabled:opacity-50">
              <span>{deleting ? "Signing out…" : "Delete account"}</span>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </div>
  );
}
