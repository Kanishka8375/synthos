import Link from "next/link";
import { Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">SYNTHOS</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              The AI-native production studio. Powered by OpenClaw Engine.
            </p>
          </div>
          {[
            { title: "Product", links: ["Features", "How it works", "Pricing", "Changelog"] },
            { title: "Studio", links: ["Marketplace", "Templates", "Characters", "Soundtracks"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} SYNTHOS. All rights reserved.</p>
          <p>Powered by <span className="text-indigo-400">OpenClaw Engine</span></p>
        </div>
      </div>
    </footer>
  );
}
