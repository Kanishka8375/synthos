"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a14]/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SYNTHOS</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">About</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              Get started
            </Link>
          </div>

          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a14] px-4 py-4 space-y-3">
          <Link href="#features" className="block text-gray-400 hover:text-white py-2" onClick={() => setOpen(false)}>Features</Link>
          <Link href="#pricing" className="block text-gray-400 hover:text-white py-2" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="#about" className="block text-gray-400 hover:text-white py-2" onClick={() => setOpen(false)}>About</Link>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link href="/login" className="block text-center text-gray-300 hover:text-white py-2 rounded-lg border border-white/10">Sign in</Link>
            <Link href="/signup" className="block text-center bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-lg font-medium">Get started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
