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
  issueDate: z.date(),
  dueDate: z.date().optional(),
  notes: z.string().optional(),
  taxRate: z.number().min(0).max(100).default(0),
  items: z.array(z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0, "Price must be positive"),
  })).min(1, "At least one item is required"),
})

export const userSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  businessName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
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