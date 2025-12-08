"use client"

import Link from "next/link"
import { FileText } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative z-10 px-6 py-12 bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <FileText className="w-6 h-6" style={{ color: 'var(--primary)' }} />
            <span className="text-lg font-semibold text-foreground">InvoiceHub</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="/sign-in" className="hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="hover:text-primary transition-colors">
              Sign Up
            </Link>
            <span>© 2024 InvoiceHub. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}