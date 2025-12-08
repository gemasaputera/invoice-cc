"use client"

import { motion } from "framer-motion"

export function SocialProofSection() {
  return (
    <section id="social-proof" className="relative z-10 px-6 py-12">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-muted-foreground font-medium">
            Trusted by developers, designers, creators, and small businesses.
          </p>
        </motion.div>
      </div>
    </section>
  )
}