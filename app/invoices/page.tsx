"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { InvoiceList } from "@/components/invoices/invoice-list"
import { InvoiceForm } from "@/components/forms/invoice-form"
import { InvoiceFormData } from "@/lib/validations"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()

  const handleInvoiceCreate = () => {
    setIsCreateDialogOpen(true)
  }

  const handleInvoiceEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsEditDialogOpen(true)
  }

  const handleInvoiceDelete = async (invoice: Invoice) => {
    if (!confirm(`Are you sure you want to delete invoice #${invoice.invoiceNumber}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Invoice deleted successfully")
        setRefreshKey((prev) => prev + 1) // Trigger refresh
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to delete invoice")
      }
    } catch (error) {
      console.error("Error deleting invoice:", error)
      toast.error("Failed to delete invoice")
    }
  }

  const handleInvoiceSelect = (invoice: Invoice) => {
    router.push(`/invoices/${invoice.id}`)
  }

  const handleInvoiceDownload = async (invoice: Invoice) => {
    try {
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
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to download PDF")
      }
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast.error("Failed to download PDF")
    }
  }

  const handleInvoiceSend = async (invoice: Invoice) => {
    try {
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
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to update invoice status")
      }
    } catch (error) {
      console.error("Error updating invoice status:", error)
      toast.error("Failed to update invoice status")
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
        setIsCreateDialogOpen(false)
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
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
          </div>

          <InvoiceList
            key={refreshKey} // Force re-render when refreshKey changes
            onInvoiceCreate={handleInvoiceCreate}
            onInvoiceEdit={handleInvoiceEdit}
            onInvoiceDelete={handleInvoiceDelete}
            onInvoiceSelect={handleInvoiceSelect}
            onInvoiceDownload={handleInvoiceDownload}
            onInvoiceSend={handleInvoiceSend}
          />

          {/* Create Invoice Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <InvoiceForm
                onSubmit={(data) => handleInvoiceSubmit(data, false)}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

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