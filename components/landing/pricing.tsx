"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Star } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started",
    features: [
      "Up to 3 invoices per month",
      "Basic templates",
      "Client management (up to 5)",
      "PDF export",
      "Email support"
    ],
    highlighted: false,
    buttonText: "Get Started"
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For growing freelancers",
    features: [
      "Unlimited invoices",
      "Premium templates",
      "Unlimited clients",
      "Advanced analytics",
      "Custom branding",
      "Priority support",
      "Invoice tracking",
      "Recurring invoices"
    ],
    highlighted: true,
    buttonText: "Start Free Trial"
  },
  {
    name: "Pro Annual",
    price: "$59",
    period: "/year",
    description: "Best value - Save 45%",
    features: [
      "Everything in Pro",
      "2 months free",
      "Advanced reporting",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "Early feature access",
      "White-label options"
    ],
    highlighted: false,
    buttonText: "Save 45% Now"
  }
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative z-10 px-6 py-20 lg:py-32 bg-card/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that works best for your business. Start free, upgrade anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <Card className={`h-full ${plan.highlighted ? 'border-primary shadow-lg scale-105' : 'border-0 bg-card/50 backdrop-blur-sm'} relative overflow-hidden`}>
                {plan.highlighted && (
                  <div className="absolute inset-0 opacity-5 bg-primary" />
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-lg text-muted-foreground">{plan.period}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href="/sign-up">
                    <Button
                      className={`w-full mb-8 ${plan.highlighted ? 'bg-primary' : 'variant-default'}`}
                      variant={plan.highlighted ? 'default' : 'outline'}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>

                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            All plans include <span className="font-semibold text-foreground">30-day money-back guarantee</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}