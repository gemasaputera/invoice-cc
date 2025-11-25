"use client"

import { useState, Suspense } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { InvoiceForm } from "@/components/forms/invoice-form"
import { InvoiceFormData } from "@/lib/validations"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

function NewInvoiceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const clientId = searchParams.get("clientId")

  const handleInvoiceSubmit = async (data: InvoiceFormData) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const createdInvoice = await response.json()
        toast.success("Invoice created successfully")
        router.push(`/invoices/${createdInvoice.id}`)
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to create invoice")
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast.error("Failed to create invoice")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/invoices")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create New Invoice</h2>
      </div>

      <InvoiceForm
        onSubmit={handleInvoiceSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        clientId={clientId || undefined}
      />
    </div>
  )
}

export default function NewInvoicePage() {
  return (
    <AuthGuard>
      <AppLayout>
        <Suspense fallback={
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Create New Invoice</h2>
            </div>
            <div>Loading...</div>
          </div>
        }>
          <NewInvoiceContent />
        </Suspense>
      </AppLayout>
    </AuthGuard>
  )
}
