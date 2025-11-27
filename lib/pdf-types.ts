/* eslint-disable @typescript-eslint/no-explicit-any */
import { Invoice, Client, User } from '@prisma/client'

// Enhanced invoice interface for PDF generation with converted decimal values
export interface PDFInvoice {
  id: string
  invoiceNumber: string
  status: string
  issueDate: Date | string
  dueDate: Date | string | null
  notes: string | null
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  currency: string
  templateId: string | null
  createdAt: Date
  updatedAt: Date
  userId: string
  clientId: string
}

export interface PDFInvoiceItem {
  id: string
  invoiceId: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface PDFUser {
  id: string
  name: string | null
  email: string
  businessName: string | null
  phone: string | null
  address: string | null
  taxId: string | null
  defaultCurrency: string | null
  invoicePrefix: string | null
  nextInvoiceNum: number | null
  logoUrl: string | null
}

export interface PDFClient {
  id: string
  userId: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  address: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

// PDF Component Props interfaces
export interface InvoicePDFProps {
  invoice: PDFInvoice
  client: PDFClient
  user: PDFUser
  items: PDFInvoiceItem[]
}

// Template interface for template selection
export interface InvoiceTemplate {
  id: string
  name: string
  category: string
  description: string | null
  previewUrl: string | null
  isDefault: boolean
  isSystem: boolean
  styles: Record<string, any> | null
  sampleData: Record<string, any> | null
  createdAt: Date
  updatedAt: Date
}

export interface TemplateSelectionProps {
  templates: InvoiceTemplate[]
  selectedTemplateId: string | null
  onTemplateSelect: (template: InvoiceTemplate) => void
  onClose: () => void
  isOpen: boolean
}