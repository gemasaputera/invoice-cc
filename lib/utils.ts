import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string, currency = 'USD'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(numAmount)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function generateInvoiceNumber(prefix: string, nextNumber: number): string {
  const paddedNumber = nextNumber.toString().padStart(4, '0')
  return `${prefix}${paddedNumber}`
}

export function calculateInvoiceTotal(items: Array<{ quantity: number; unitPrice: number }>): {
  subtotal: number
  taxAmount: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const taxAmount = 0 // TODO: Implement tax calculation based on taxRate
  const total = subtotal + taxAmount

  return { subtotal, taxAmount, total }
}
