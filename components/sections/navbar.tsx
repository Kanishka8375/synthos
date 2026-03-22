"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SynthosLogo } from "@/components/ui/synthos-logo";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#07070f]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <SynthosLogo size={32} />
          <span className="text-lg font-bold gradient-text">SYNTHOS</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          {[["#features","Features"],["#how-it-works","How it works"],["#comparison","Compare"],["#pricing","Pricing"]].map(([href,label]) => (
            <Link key={label} href={href} className="text-gray-400 hover:text-white transition-colors">{label}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-xl transition-colors">Sign in</Link>
          <Link href="/signup" className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-medium transition-all">
            Start free
          </Link>
        </div>

        <button className="md:hidden text-gray-400" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/8 bg-[#07070f] px-4 py-4 space-y-2">
          {[["#features","Features"],["#how-it-works","How it works"],["#comparison","Compare"],["#pricing","Pricing"]].map(([href,label]) => (
            <Link key={label} href={href} className="block text-gray-400 hover:text-white py-2 text-sm" onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <div className="pt-3 border-t border-white/8 flex flex-col gap-2">
            <Link href="/login" className="block text-center text-gray-400 border border-white/10 py-2 rounded-xl text-sm">Sign in</Link>
            <Link href="/signup" className="block text-center bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium">Start free</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
