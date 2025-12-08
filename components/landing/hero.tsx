"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  // Different parallax speeds for different elements
  const textY = useTransform(scrollYProgress, [0, 1], [0, 50])
  const statsY = useTransform(scrollYProgress, [0, 1], [0, 30])
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, 70])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <section id="hero" ref={ref} className="relative z-10 px-6 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
          style={{
            scale,
            opacity,
          }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              y: badgeY
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Designed for Freelancers & Influencers
          </motion.div>
          <motion.div style={{ y: textY }}>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block text-foreground">Send Better Invoices.</span>
              <span className="block text-foreground">Get Paid Faster.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              A simple, modern invoice creator built for freelancers and influencers.
              Create, manage, and export beautiful invoices in under 2 minutes.
            </p>
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-4 font-medium group shadow-lg hover:shadow-xl transition-shadow duration-300">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">No credit card required.</p>
        </motion.div>

        {/* Stats with parallax */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          style={{ y: statsY }}
        >
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-3xl font-bold text-foreground mb-2">10K+</div>
            <div className="text-muted-foreground">Invoices Generated</div>
          </motion.div>
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-3xl font-bold text-foreground mb-2">$2M+</div>
            <div className="text-muted-foreground">Revenue Processed</div>
          </motion.div>
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-3xl font-bold text-foreground mb-2">500+</div>
            <div className="text-muted-foreground">Active Freelancers</div>
          </motion.div>
        </motion.div>

        {/* Floating gradient orbs for depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/20 blur-2xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-10 w-40 h-40 rounded-full bg-secondary/20 blur-2xl"
            animate={{
              x: [0, -20, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
      </div>
    </section>
  )
}