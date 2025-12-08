"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Alex Rodriguez",
    role: "Freelance Developer",
    content: "InvoiceHub has completely transformed how I handle my billing. What used to take 30 minutes now takes less than 2. The professional templates make me look much more established than I actually am!",
    rating: 5
  },
  {
    name: "Sarah Chen",
    role: "UX Designer",
    content: "I've tried so many invoicing tools and they're always overly complicated. InvoiceHub is exactly what I needed - simple, beautiful, and it just works. My clients even commented on how professional my invoices look.",
    rating: 5
  },
  {
    name: "Mia Thompson",
    role: "Content Creator",
    content: "As an influencer, I need something that's quick and looks professional. InvoiceHub is perfect! I can create invoices between takes and send them immediately. The client management feature saves me so much time.",
    rating: 5
  }
]

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex justify-center gap-1 mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative z-10 px-6 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Loved by Freelancers & Creators
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what our users have to say about InvoiceHub.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border-0">
                <CardContent className="p-8 flex flex-col h-full">
                  <StarRating rating={testimonial.rating} />
                  <blockquote className="text-muted-foreground mb-6 flex-grow italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}