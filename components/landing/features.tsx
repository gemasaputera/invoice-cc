"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Users, Download, Zap, Shield, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning-Fast Invoice Creation",
    description: "Create professional invoices in under 2 minutes with our intuitive interface and smart templates."
  },
  {
    icon: Users,
    title: "Smart Client Management",
    description: "Save client information, track invoice history, and manage relationships all in one place."
  },
  {
    icon: FileText,
    title: "Professional PDF Templates",
    description: "Choose from beautiful, customizable templates that make your brand look professional."
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track revenue, monitor invoice status, and get insights into your business performance."
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your data is encrypted and backed up. Access your invoices anywhere, anytime."
  },
  {
    icon: Download,
    title: "Easy Export & Sharing",
    description: "Download invoices as PDFs or share them directly with clients via email links."
  }
]

const FeatureCard = ({ icon: Icon, title, description }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--primary)' }}>
            <Icon className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'var(--primary)', opacity: '0.05' }} />
      </Card>
    </motion.div>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 px-6 py-20 lg:py-32 bg-card/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Get Paid
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful features designed to help freelancers and influencers manage their invoicing efficiently.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}