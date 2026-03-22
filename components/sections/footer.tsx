import Link from "next/link";
import { Cpu } from "lucide-react";

const FOOTER_LINKS: Record<string, Array<{ label: string; href: string; external?: boolean }>> = {
  Product: [
    { label: "Features",     href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing",      href: "#pricing" },
    { label: "Changelog",    href: "#changelog" },   // anchor to bottom of page / coming soon
  ],
  Studio: [
    { label: "Marketplace",  href: "/signup?plan=creator" },
    { label: "Templates",    href: "/signup?plan=creator" },
    { label: "Characters",   href: "/signup" },
    { label: "Soundtracks",  href: "/signup" },
  ],
  Company: [
    { label: "About",    href: "#about" },
    { label: "Blog",     href: "#blog" },
    { label: "Careers",  href: "#careers" },
    { label: "Contact",  href: "mailto:hello@synthos.ai", external: true },
  ],
};

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

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        className="text-sm text-gray-500 hover:text-white transition-colors"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-sm text-gray-500 hover:text-white transition-colors"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} SYNTHOS. All rights reserved.</p>
            <Link href="/signup" className="text-gray-600 hover:text-white transition-colors">Privacy</Link>
            <Link href="/signup" className="text-gray-600 hover:text-white transition-colors">Terms</Link>
          </div>
          <p>Powered by <span className="text-indigo-400">OpenClaw Engine</span></p>
        </div>
      </div>
    </footer>
  );
}
