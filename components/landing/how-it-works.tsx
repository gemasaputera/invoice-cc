"use client"

import { motion } from "framer-motion"
import { Plus, Users, Download } from "lucide-react"

const steps = [
  {
    number: "1",
    icon: Plus,
    title: "Add your service details",
    description: "List your services, set rates, and customize your invoice template."
  },
  {
    number: "2",
    icon: Users,
    title: "Select or create your client",
    description: "Choose from existing clients or add new ones with their contact information."
  },
  {
    number: "3",
    icon: Download,
    title: "Export your invoice",
    description: "Download as PDF or share via email. Get paid faster with professional invoices."
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative z-10 px-6 py-20 lg:py-32 bg-card/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started with InvoiceHub in three simple steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -translate-y-1/2" />
              )}

              <div className="bg-card rounded-2xl p-8 text-center relative">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.number}
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full mb-4 mx-auto" style={{ backgroundColor: 'var(--primary)' }}>
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}