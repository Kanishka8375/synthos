"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ChevronLeft, Sparkles } from "lucide-react";
import { SynthosLogo } from "@/components/ui/synthos-logo";
import { useState } from "react";
import { NAV_SECTIONS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import clsx from "clsx";

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    const ok = window.confirm("Sign out of your studio?");
    if (!ok) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className={clsx(
      "flex flex-col h-screen bg-[#0a0a17] border-r border-white/8 sticky top-0 transition-all duration-300 shrink-0",
      collapsed ? "w-[60px]" : "w-[220px]"
    )}>
      {/* Logo */}
      <div className={clsx("h-14 flex items-center border-b border-white/8 px-3", collapsed ? "justify-center" : "gap-2.5")}>
        <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
          <SynthosLogo size={28} />
        </div>
        {!collapsed && <span className="font-bold text-base gradient-text">SYNTHOS</span>}
      </div>

      {/* Create CTA */}
      <div className={clsx("px-2 pt-2 pb-1", collapsed && "px-1.5")}>
        <Link
          href="/create"
          className={clsx(
            "flex items-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all",
            "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500",
            "text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35",
            "active:scale-95",
            collapsed ? "justify-center px-2" : "px-3"
          )}
          title={collapsed ? "Create" : undefined}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Create</span>}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-2 mb-1.5">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={clsx(
                    "flex items-center gap-2.5 px-2 py-2 rounded-xl text-xs font-medium transition-all mb-0.5",
                    active
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                      : "text-gray-500 hover:text-white hover:bg-white/5",
                    collapsed && "justify-center"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/8">
        <button
          onClick={handleSignOut}
          className={clsx("flex items-center gap-2.5 px-2 py-2 rounded-xl text-xs text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all mb-0.5 w-full", collapsed && "justify-center")}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && "Sign out"}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx("flex items-center gap-2.5 px-2 py-2 rounded-xl text-xs text-gray-600 hover:text-white hover:bg-white/5 transition-all w-full", collapsed && "justify-center")}
        >
          <ChevronLeft className={clsx("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && "Collapse sidebar"}
        </button>
      </div>
    </aside>
  );
}
