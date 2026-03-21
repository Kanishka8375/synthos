import { Bell, Search, Cpu } from "lucide-react";
import Link from "next/link";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";

interface DashHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashHeader({ title, description, actions }: DashHeaderProps) {
  return (
    <header className="h-14 border-b border-white/8 bg-[#07070f]/60 backdrop-blur-xl flex items-center justify-between px-5 sticky top-0 z-10">
      <div>
        <h1 className="text-sm font-semibold text-white leading-none">{title}</h1>
        {description && <p className="text-xs text-gray-600 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <button className="hidden sm:flex items-center gap-1.5 glass glass-hover rounded-lg px-2.5 py-1.5 text-xs text-gray-500 hover:text-white">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          Ask OpenClaw
          <kbd className="text-[10px] bg-white/8 px-1 py-0.5 rounded text-gray-600">⌘K</kbd>
        </button>
        <button className="glass glass-hover rounded-lg p-1.5 text-gray-500 hover:text-white">
          <Search className="w-4 h-4" />
        </button>
        <Link href="/notifications" className="relative glass glass-hover rounded-lg p-1.5 text-gray-500 hover:text-white">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </Link>
        <Link href="/settings" className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
          JS
        </Link>
      </div>
    </header>
  );
}
