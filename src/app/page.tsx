"use client"

import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero"
import { StatsBar, TrustBar } from "@/components/landing/stats"
import { HowItWorksSection } from "@/components/landing/how-it-works"
import { EarningsCalculatorSection } from "@/components/landing/earnings-calculator"
import { ForCreatorsSection } from "@/components/landing/for-creators"
import { TestimonialsSection } from "@/components/landing/testimonials"
import { FAQSection } from "@/components/landing/faq"
import { FinalCTASection } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"
import { MobileStickyCTA } from "@/components/landing/mobile-cta"

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--ink)" }}>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <TrustBar />
        <HowItWorksSection />
        <EarningsCalculatorSection />
        <ForCreatorsSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  )
}
