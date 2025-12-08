"use client"

import { motion } from "framer-motion"
import { TrendingUp, Shield, Clock } from "lucide-react"

const benefits = [
  {
    icon: Clock,
    title: "No accounting headaches",
    description: "Focus on your work, not on learning complex accounting software. Our intuitive interface makes invoicing simple."
  },
  {
    icon: TrendingUp,
    title: "Look professional instantly",
    description: "Beautiful templates and automatic calculations make you look like you have a dedicated finance team."
  },
  {
    icon: Shield,
    title: "Optimized for speed",
    description: "Create and send invoices in under 2 minutes. No more wasting time on administrative tasks."
  }
]

export function WhyChooseUsSection() {
  return (
    <section id="why-choose-us" className="relative z-10 px-6 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why Choose InvoiceHub?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built specifically for the modern freelancer and influencer workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto" style={{ backgroundColor: 'var(--primary)' }}>
                <benefit.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}