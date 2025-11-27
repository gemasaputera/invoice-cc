"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { InvoiceForm } from "@/components/forms/invoice-form"
import { InvoiceFormData } from "@/lib/validations"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  issueDate: string
  dueDate?: string
  notes?: string
  taxRate: number
  status: string
  items: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
}

export default function EditInvoicePage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchInvoice()
    }
  }, [params.id])

  const fetchInvoice = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/invoices/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setInvoice(data)
      } else {
        if (response.status === 404) {
          toast.error("Invoice not found")
          router.push("/invoices")
        } else {
          toast.error("Failed to fetch invoice")
        }
      }
    } catch (error) {
      console.error("Error fetching invoice:", error)
      toast.error("Failed to fetch invoice")
    } finally {
      setLoading(false)
    }
  }

  const handleInvoiceUpdate = async (data: InvoiceFormData) => {
    console.log('data', data)
    if (!invoice) return

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedInvoice = await response.json()
        toast.success(`Invoice #${updatedInvoice.invoiceNumber} updated successfully`)
        router.push(`/invoices/${updatedInvoice.id}`)
      } else {
        const error = await response.json()
        console.error('API Error:', error)
        toast.error(error.error || "Failed to update invoice")
      }
    } catch (error) {
      console.error("Error updating invoice:", error)
      toast.error("Failed to update invoice")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/invoices/${params.id}`)
  }

  if (loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </AppLayout>
      </AuthGuard>
    )
  }

  if (!invoice) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Invoice not found</p>
            <Button className="mt-4" onClick={() => router.push("/invoices")}>
              Back to Invoices
            </Button>
          </div>
        </AppLayout>
      </AuthGuard>
    )
  }

  // Only allow editing draft invoices
  if (invoice.status !== "DRAFT") {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Cannot edit invoice that is not in draft status</p>
            <Button className="mt-4" onClick={() => router.push(`/invoices/${invoice.id}`)}>
              Back to Invoice
            </Button>
          </div>
        </AppLayout>
      </AuthGuard>
    )
  }

  // Prepare initial data for the form
  const initialData: Partial<InvoiceFormData> = {
    clientId: invoice.clientId,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    notes: invoice.notes,
    taxRate: invoice.taxRate,
    items: invoice.items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
    })),
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invoice
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">
              Edit Invoice #{invoice.invoiceNumber}
            </h2>
          </div>

          <InvoiceForm
            initialData={initialData}
            onSubmit={handleInvoiceUpdate}
            onCancel={handleCancel}
            isLoading={isSubmitting}
            clientId={invoice.clientId}
          />
        </div>
      </AppLayout>
    </AuthGuard>
  )
}