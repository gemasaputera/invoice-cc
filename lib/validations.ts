import { z } from "zod"

export const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export const invoiceSchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  issueDate: z.string().or(z.date()),
  dueDate: z.string().or(z.date()).optional(),
  notes: z.string().optional(),
  taxRate: z.number().min(0).max(100).default(0),
  items: z.array(z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0, "Price must be positive"),
  })).min(1, "At least one item is required"),
})

// Supported currencies list
export const SUPPORTED_CURRENCIES = [
  { value: "IDR", label: "IDR - Indonesian Rupiah (Rp)", symbol: "Rp" },
  { value: "USD", label: "USD - US Dollar ($)", symbol: "$" },
  { value: "EUR", label: "EUR - Euro (€)", symbol: "€" },
  { value: "GBP", label: "GBP - British Pound (£)", symbol: "£" },
  { value: "JPY", label: "JPY - Japanese Yen (¥)", symbol: "¥" },
  { value: "CNY", label: "CNY - Chinese Yuan (¥)", symbol: "¥" },
  { value: "SGD", label: "SGD - Singapore Dollar ($)", symbol: "$" },
  { value: "MYR", label: "MYR - Malaysian Ringgit (RM)", symbol: "RM" },
  { value: "THB", label: "THB - Thai Baht (฿)", symbol: "฿" },
  { value: "VND", label: "VND - Vietnamese Dong (₫)", symbol: "₫" },
  { value: "PHP", label: "PHP - Philippine Peso (₱)", symbol: "₱" },
  { value: "HKD", label: "HKD - Hong Kong Dollar ($)", symbol: "$" },
  { value: "AUD", label: "AUD - Australian Dollar ($)", symbol: "$" },
  { value: "CAD", label: "CAD - Canadian Dollar ($)", symbol: "$" },
  { value: "CHF", label: "CHF - Swiss Franc (Fr)", symbol: "Fr" },
  { value: "INR", label: "INR - Indian Rupee (₹)", symbol: "₹" },
] as const

export const userSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  businessName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
  defaultCurrency: z.enum(SUPPORTED_CURRENCIES.map(c => c.value) as [string, ...string[]]).default("IDR"),
  invoicePrefix: z.string().max(3, "Prefix must be 3 characters or less").default("INV"),
})

export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const registerSchema = authSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type ClientFormData = z.infer<typeof clientSchema>
export type InvoiceFormData = z.infer<typeof invoiceSchema>
export type UserSettingsFormData = z.infer<typeof userSettingsSchema>
export type AuthFormData = z.infer<typeof authSchema>
export type RegisterFormData = z.infer<typeof registerSchema>