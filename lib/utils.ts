import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SUPPORTED_CURRENCIES } from "./validations"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string, currency = 'IDR'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  // Find currency configuration
  const currencyConfig = SUPPORTED_CURRENCIES.find(c => c.value === currency)

  if (!currencyConfig) {
    // Fallback for unsupported currencies
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount)
  }

  // Special formatting for IDR and other currencies that don't use decimals
  if (['IDR', 'VND', 'JPY'].includes(currencyConfig.value)) {
    return `${currencyConfig.symbol}${numAmount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`
  }

  // For currencies with standard decimal formatting
  if (['USD', 'SGD', 'MYR', 'THB', 'PHP', 'HKD', 'AUD', 'CAD'].includes(currencyConfig.value)) {
    return `${currencyConfig.symbol}${numAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // For other currencies, use Intl.NumberFormat with the currency code
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyConfig.value,
      minimumFractionDigits: currencyConfig.value === 'JPY' ? 0 : 2,
      maximumFractionDigits: currencyConfig.value === 'JPY' ? 0 : 2,
    }).format(numAmount)
  } catch {
    // Final fallback - use symbol with basic formatting
    return `${currencyConfig.symbol}${numAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }
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

// Authentication error handling utilities
export function getAuthErrorMessage(error: any): string {
  if (!error) return "An unknown error occurred"

  // Handle Better Auth specific error structures
  if (typeof error === 'object' && error !== null) {
    // Check for Better Auth error message
    if (error.message) {
      return error.message
    }

    // Check for specific Better Auth error types
    if (error.code) {
      switch (error.code) {
        case 'INVALID_CREDENTIALS':
          return "Invalid email or password"
        case 'USER_NOT_FOUND':
          return "No account found with this email address"
        case 'EMAIL_ALREADY_EXISTS':
          return "An account with this email already exists"
        case 'WEAK_PASSWORD':
          return "Password is too weak. Please choose a stronger password"
        case 'INVALID_EMAIL':
          return "Please enter a valid email address"
        case 'SESSION_EXPIRED':
          return "Your session has expired. Please sign in again"
        case 'TOO_MANY_ATTEMPTS':
          return "Too many sign in attempts. Please try again later"
        default:
          return `Authentication error: ${error.code}`
      }
    }

    // Handle string-based error responses
    if (error.error) {
      return typeof error.error === 'string' ? error.error : JSON.stringify(error.error)
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error
  }

  // Handle Error instances
  if (error instanceof Error) {
    return error.message
  }

  // Fallback
  return "An unexpected authentication error occurred"
}
