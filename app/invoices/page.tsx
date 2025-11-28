"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { InvoiceList } from "@/components/invoices/invoice-list"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { InvoiceFormData } from "@/lib/validations"
import { InvoiceForm } from "@/components/forms/invoice-form"

// Analytics helper
declare global {
  interface Window {
    umami?: (event: string, data?: any) => void;
  }
}

const trackEvent = (event: string, data?: any) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami(event, data)
  }
}

interface Invoice {
  id: string
  invoiceNumber: string
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED"
  issueDate: string
  dueDate?: string
  total: number
  notes?: string
  client: {
    id: string
    name: string
    email?: string
    company?: string
  }
  items: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  createdAt: string
}

export default function InvoicesPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()

  const handleInvoiceCreate = () => {
    router.push('/invoices/new')
  }

  const handleInvoiceEdit = (invoice: Invoice) => {
    router.push(`/invoices/edit/${invoice.id}`)
  }

  const handleInvoiceDelete = async (invoice: Invoice) => {
    if (!confirm(`Are you sure you want to delete invoice #${invoice.invoiceNumber}?`)) {
      return
    }

    try {
      // Track invoice delete attempt
      trackEvent("invoice-delete-attempt", {
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.client.name,
        total: invoice.total,
        status: invoice.status,
        timestamp: new Date().toISOString()
      });

      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Invoice deleted successfully")
        setRefreshKey((prev) => prev + 1) // Trigger refresh

        // Track successful invoice delete
        trackEvent("invoice-delete-success", {
          invoiceNumber: invoice.invoiceNumber,
          clientName: invoice.client.name,
          total: invoice.total,
          status: invoice.status,
          timestamp: new Date().toISOString()
        });
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to delete invoice")

        // Track invoice delete failure
        trackEvent("invoice-delete-failed", {
          invoiceNumber: invoice.invoiceNumber,
          error: error.error || "Unknown error",
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error deleting invoice:", error)
      toast.error("Failed to delete invoice")

      // Track invoice delete error
      trackEvent("invoice-delete-error", {
        error: error?.message || "Unknown error",
        timestamp: new Date().toISOString()
      });
    }
  }

  const handleInvoiceSelect = (invoice: Invoice) => {
    // Track invoice view
    trackEvent("invoice-view", {
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.client.name,
      total: invoice.total,
      status: invoice.status,
      timestamp: new Date().toISOString()
    });

    router.push(`/invoices/${invoice.id}`)
  }

  const handleInvoiceDownload = async (invoice: Invoice) => {
    try {
      // Track PDF download attempt
      trackEvent("invoice-download-attempt", {
        invoiceNumber: invoice.invoiceNumber,
        invoiceTotal: invoice.total,
        clientName: invoice.client.name,
        timestamp: new Date().toISOString()
      });

      const response = await fetch(`/api/invoices/${invoice.id}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${invoice.invoiceNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("PDF downloaded successfully")

        // Track successful PDF download
        trackEvent("invoice-download-success", {
          invoiceNumber: invoice.invoiceNumber,
          invoiceTotal: invoice.total,
          clientName: invoice.client.name,
          timestamp: new Date().toISOString()
        });
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to download PDF")

        // Track PDF download failure
        trackEvent("invoice-download-failed", {
          invoiceNumber: invoice.invoiceNumber,
          error: error.error || "Unknown error",
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast.error("Failed to download PDF")

      // Track PDF download error
      trackEvent("invoice-download-error", {
        invoiceNumber: invoice.invoiceNumber,
        error: error?.message || "Unknown error",
        timestamp: new Date().toISOString()
      });
    }
  }

  const handleInvoiceSend = async (invoice: Invoice) => {
    try {
      // Track invoice send attempt
      trackEvent("invoice-send-attempt", {
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.client.name,
        total: invoice.total,
        timestamp: new Date().toISOString()
      });

      const response = await fetch(`/api/invoices/${invoice.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "SENT" }),
      })

      if (response.ok) {
        toast.success(`Invoice #${invoice.invoiceNumber} marked as sent`)
        setRefreshKey((prev) => prev + 1) // Trigger refresh

        // Track successful invoice send
        trackEvent("invoice-send-success", {
          invoiceNumber: invoice.invoiceNumber,
          clientName: invoice.client.name,
          total: invoice.total,
          timestamp: new Date().toISOString()
        });
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to update invoice status")

        // Track invoice send failure
        trackEvent("invoice-send-failed", {
          invoiceNumber: invoice.invoiceNumber,
          error: error.error || "Unknown error",
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error updating invoice status:", error)
      toast.error("Failed to update invoice status")

      // Track invoice send error
      trackEvent("invoice-send-error", {
        error: error?.message || "Unknown error",
        timestamp: new Date().toISOString()
      });
    }
  }

  const handleInvoiceSubmit = async (data: InvoiceFormData, isEdit = false) => {
    try {
      const url = isEdit ? `/api/invoices/${selectedInvoice?.id}` : "/api/invoices"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const createdInvoice = await response.json()
        toast.success(`Invoice ${isEdit ? "updated" : "created"} successfully`)
        setIsEditDialogOpen(false)
        setSelectedInvoice(null)
        setRefreshKey((prev) => prev + 1) // Trigger refresh

        // Redirect to the invoice detail page for new invoices
        if (!isEdit) {
          router.push(`/invoices/${createdInvoice.id}`)
        }
      } else {
        const error = await response.json()
        toast.error(error.error || `Failed to ${isEdit ? "update" : "create"} invoice`)
      }
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "creating"} invoice:`, error)
      toast.error(`Failed to ${isEdit ? "update" : "create"} invoice`)
    }
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
            <Button onClick={handleInvoiceCreate} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Invoice
            </Button>
          </div>

          <InvoiceList
            key={refreshKey} // Force re-render when refreshKey changes
            onInvoiceEdit={handleInvoiceEdit}
            onInvoiceDelete={handleInvoiceDelete}
            onInvoiceSelect={handleInvoiceSelect}
            onInvoiceDownload={handleInvoiceDownload}
            onInvoiceSend={handleInvoiceSend}
          />

          {/* Edit Invoice Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Invoice</DialogTitle>
              </DialogHeader>
              {selectedInvoice && (
                <InvoiceForm
                  initialData={{
                    clientId: selectedInvoice.client.id,
                    issueDate: new Date(selectedInvoice.issueDate),
                    dueDate: selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate) : undefined,
                    notes: selectedInvoice.notes || "",
                    items: selectedInvoice.items.map(item => ({
                      description: item.description,
                      quantity: item.quantity,
                      unitPrice: Number(item.unitPrice),
                    })),
                  }}
                  onSubmit={(data) => handleInvoiceSubmit(data, true)}
                  onCancel={() => {
                    setIsEditDialogOpen(false)
                    setSelectedInvoice(null)
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}