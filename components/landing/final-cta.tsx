"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function FinalCTASection() {
  return (
    <section id="final-cta" className="relative z-10 px-6 py-20 lg:py-32">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-3xl p-12 lg:p-16 text-primary-foreground relative overflow-hidden"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Stop wrestling with messy templates.
            </h2>
            <p className="text-xl mb-4 opacity-90">
              Start sending invoices you&apos;re proud of.
            </p>
            <p className="text-lg mb-8 opacity-80">
              Join thousands of freelancers who've transformed their invoicing process.
            </p>

            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 font-medium hover:bg-accent group">
                Create Your Free Account
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="mt-4 text-sm opacity-75">No credit card required • Setup in 2 minutes</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}