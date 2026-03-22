import Link from "next/link";
import { SynthosLogo } from "@/components/ui/synthos-logo";

const FOOTER_LINKS: Record<string, Array<{ label: string; href: string; external?: boolean }>> = {
  Product: [
    { label: "Features",     href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing",      href: "#pricing" },
    { label: "Changelog",    href: "#changelog" },
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
              <SynthosLogo size={32} />
              <span className="text-lg font-bold gradient-text">SYNTHOS</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              The AI-native production studio. Synthesize stories, ship scenes, scale everything.
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
          <p>Built with <span className="text-indigo-400">Synthos AI Engine</span></p>
        </div>
      </div>
    </footer>
  );
}
