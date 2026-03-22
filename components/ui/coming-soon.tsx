"use client";
import { Clock } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="flex flex-col items-center gap-5 text-center max-w-sm px-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Clock className="w-7 h-7 text-indigo-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Coming Soon
        </span>
      </div>
    </div>
  );
}
