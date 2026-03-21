import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SYNTHOS — AI-Powered SaaS Platform",
  description:
    "SYNTHOS is the intelligent SaaS platform powered by OpenClaw. Build, automate, and scale your workflows with cutting-edge AI.",
  keywords: ["AI", "SaaS", "automation", "OpenClaw", "productivity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a14] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
