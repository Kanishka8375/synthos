import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SYNTHOS — AI-Native Production Studio",
  description:
    "Synthesize stories. Ship scenes. Scale everything. The AI-native production studio powered by Synthos AI Engine.",
  keywords: ["AI video", "production studio", "anime", "Synthos AI", "animation", "script", "SYNTHOS"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#07070f] text-[#e2e2f0] antialiased">
        {children}
      </body>
    </html>
  );
}
