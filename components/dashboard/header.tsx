"use client";
import { Bell, Search, Sparkles } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  title: string;
  description?: string;
}

export default function DashboardHeader({ title, description }: HeaderProps) {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0a0a14]/80 backdrop-blur-lg flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* OpenClaw AI shortcut */}
        <button className="hidden sm:flex items-center gap-2 glass glass-hover rounded-xl px-3 py-1.5 text-sm text-gray-400 hover:text-white">
          <Sparkles className="w-4 h-4 text-violet-400" />
          Ask OpenClaw
          <kbd className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-gray-500">⌘K</kbd>
        </button>

        {/* Search */}
        <button className="glass glass-hover rounded-xl p-2 text-gray-400 hover:text-white">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <Link href="/dashboard/notifications" className="relative glass glass-hover rounded-xl p-2 text-gray-400 hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
        </Link>

        {/* Avatar */}
        <Link href="/dashboard/profile" className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
          JS
        </Link>
      </div>
    </header>
  );
}
