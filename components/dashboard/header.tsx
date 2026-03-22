"use client";

import { useState, useEffect } from "react";
import { Bell, Search, X, Cpu } from "lucide-react";
import Link from "next/link";
import { useChatPanel } from "@/components/ui/openclaw-chat";

interface DashHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashHeader({ title, description, actions }: DashHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [initials, setInitials] = useState("AI");
  const chat = useChatPanel();

  /* Load real user initials */
  useEffect(() => {
    fetch("/api/user")
      .then(r => r.json())
      .then((d: { user?: { full_name?: string; email?: string } }) => {
        const name  = d?.user?.full_name ?? d?.user?.email ?? "";
        const parts = name.split(/[\s@]+/).filter(Boolean);
        if (parts.length >= 2) setInitials((parts[0][0] + parts[1][0]).toUpperCase());
        else if (parts.length === 1) setInitials(parts[0].slice(0, 2).toUpperCase());
      })
      .catch(() => {});
  }, []);

  return (
    <header className="h-14 border-b border-white/8 bg-[#07070f]/60 backdrop-blur-xl flex items-center justify-between px-5 sticky top-0 z-10">
      <div>
        <h1 className="text-sm font-semibold text-white leading-none">{title}</h1>
        {description && <p className="text-xs text-gray-600 mt-0.5">{description}</p>}
      </div>

      <div className="flex items-center gap-2">
        {actions}

        {/* Search */}
        {searchOpen ? (
          <div className="flex items-center gap-2 glass rounded-lg px-2.5 py-1.5">
            <Search className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search…"
              className="bg-transparent outline-none text-white text-xs w-36 placeholder-gray-600"
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-gray-600 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="glass glass-hover rounded-lg p-1.5 text-gray-500 hover:text-white"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* Ask OpenClaw — opens the real AI chat panel */}
        <button
          onClick={chat.open}
          className="hidden sm:flex items-center gap-1.5 glass glass-hover rounded-lg px-2.5 py-1.5 text-xs text-gray-500 hover:text-white transition-colors"
        >
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          Ask OpenClaw
          <kbd className="text-[10px] bg-white/8 px-1 py-0.5 rounded text-gray-600">⌘K</kbd>
        </button>

        {/* Notifications */}
        <Link
          href="/dashboard"
          className="relative glass glass-hover rounded-lg p-1.5 text-gray-500 hover:text-white"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </Link>

        {/* Real user avatar */}
        <Link
          href="/settings"
          className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-[11px] font-bold tracking-tight"
          title="Settings"
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}
