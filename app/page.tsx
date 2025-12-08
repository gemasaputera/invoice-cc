"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero"
import { SocialProofSection } from "@/components/landing/social-proof"
import { ProblemSolutionSection } from "@/components/landing/problem-solution"
import { FeaturesSection } from "@/components/landing/features"
import { WhyChooseUsSection } from "@/components/landing/why-choose-us"
import { HowItWorksSection } from "@/components/landing/how-it-works"
import { TestimonialsSection } from "@/components/landing/testimonials"
import { PricingSection } from "@/components/landing/pricing"
import { FinalCTASection } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"
import { ParticleBackground } from "@/components/landing/particle-background"

export default function LandingPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      cursorX.set(x - 16)
      cursorY.set(y - 16)
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [session, router, cursorX, cursorY])

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (session) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 relative overflow-hidden">
      {/* Custom Cursor */}
      <motion.div
        className="fixed w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference hidden lg:block"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          backgroundColor: 'var(--primary)',
        }}
      />

      {/* Particle Background */}
      <ParticleBackground />

      {/* Landing Page Components */}
      <Navbar />
      <HeroSection />
      <SocialProofSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FinalCTASection />
      <Footer />
    </div>
  )
}