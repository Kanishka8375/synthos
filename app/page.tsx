import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Differentiators } from "@/components/sections/differentiators";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Comparison } from "@/components/sections/comparison";
import { Pricing } from "@/components/sections/pricing";
import { WaitlistCTA } from "@/components/sections/waitlist-cta";
import { Footer } from "@/components/sections/footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Problem />
      <Differentiators />
      <Features />
      <HowItWorks />
      <Comparison />
      <Pricing />
      <WaitlistCTA />
      <Footer />
    </>
  );
}
