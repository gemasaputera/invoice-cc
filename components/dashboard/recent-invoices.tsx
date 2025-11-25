"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { FileText, Download, Eye, Plus } from "lucide-react"

interface Invoice {
  id: string
  invoiceNumber: string
  status: string
  issueDate: string
  dueDate?: string
  total: number
  currency: string
  client: {
    id: string
    name: string
    company?: string
  }
}

export function RecentInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecentInvoices()
  }, [])

  const fetchRecentInvoices = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/invoices?limit=5")

      if (!response.ok) {
        throw new Error("Failed to fetch invoices")
      }

      const data = await response.json()
      setInvoices(data.slice(0, 5)) // Get only the 5 most recent
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async (invoiceId: string, invoiceNumber: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`)

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${invoiceNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Error downloading PDF:", err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800"
      case "SENT":
        return "bg-blue-100 text-blue-800"
      case "PAID":
        return "bg-green-100 text-green-800"
      case "OVERDUE":
        return "bg-red-100 text-red-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-red-600 mb-2">Error loading invoices</p>
        <Button onClick={fetchRecentInvoices} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No invoices yet</p>
        <p className="text-sm">Create your first invoice to get started</p>
        <Button className="mt-4" asChild>
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Your most recent invoices
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/invoices">
            View All
          </Link>
        </Button>
      </div>

      {/* Invoice List */}
      <div className="space-y-3">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="p-4 border rounded-lg transition-colors"
          >
            {/* Header with Invoice Number and Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <Link
                  href={`/invoices/${invoice.id}`}
                  className="font-semibold text-base sm:text-lg hover:text-primary transition-colors truncate"
                >
                  {invoice.invoiceNumber}
                </Link>
                <Badge className={`shrink-0 ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </Badge>
              </div>

              {/* Actions - Show on separate line on mobile */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Link href={`/invoices/${invoice.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadPDF(invoice.id, invoice.invoiceNumber)}
                >
                  <Download className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              </div>
            </div>

            {/* Client Info */}
            <div className="text-sm text-muted-foreground mb-2">
              <span className="font-medium">{invoice.client.name}</span>
              {invoice.client.company && (
                <>
                  <span className="mx-1">•</span>
                  <span className="truncate inline-block max-w-[200px]">{invoice.client.company}</span>
                </>
              )}
            </div>

            {/* Footer with Date and Amount */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
              <div className="text-muted-foreground">
                <span>Issued: {formatDate(invoice.issueDate)}</span>
                {invoice.dueDate && (
                  <>
                    <span className="mx-1">•</span>
                    <span>Due: {formatDate(invoice.dueDate)}</span>
                  </>
                )}
              </div>
              <div className="font-semibold text-base sm:text-lg text-right">
                {formatCurrency(invoice.total, invoice.currency)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}