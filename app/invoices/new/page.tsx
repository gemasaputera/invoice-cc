"use client"

import { useState, Suspense } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { InvoiceForm } from "@/components/forms/invoice-form"
import { TemplateSelectionModal } from "@/components/invoices/template-selection-modal"
import { InvoiceFormData } from "@/lib/validations"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

function NewInvoiceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [templateData, setTemplateData] = useState<any>(null)
  const [fetchingTemplate, setFetchingTemplate] = useState(false)
  const clientId = searchParams.get("clientId")

  const handleInvoiceSubmit = async (data: InvoiceFormData) => {
    try {
      setIsLoading(true)

      // Add template information to the data
      const submitData = {
        ...data,
        templateId: selectedTemplate?.id || null
      }

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
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

  const handleSelectTemplate = async (template: any) => {
    setSelectedTemplate(template)
    setShowTemplateModal(false)

    // If a template was selected (not blank), fetch its full data
    if (template && template !== 'blank') {
      try {
        setFetchingTemplate(true)
        const response = await fetch(`/api/invoice-templates/${template.id}`)
        if (response.ok) {
          const data = await response.json()
          setTemplateData(data)
        } else {
          toast.error('Failed to load template data')
        }
      } catch (error) {
        console.error('Error fetching template data:', error)
        toast.error('Failed to load template data')
      } finally {
        setFetchingTemplate(false)
      }
    } else {
      // Blank template
      setTemplateData(null)
    }
  }

  const handleTemplateModalClose = () => {
    if (selectedTemplate === null) {
      // User closed modal without selecting template, go back
      router.push("/invoices")
    } else {
      setShowTemplateModal(false)
    }
  }

  // Don't show the invoice form until a template is selected
  if (showTemplateModal) {
    return (
      <TemplateSelectionModal
        isOpen={showTemplateModal}
        onClose={handleTemplateModalClose}
        onSelectTemplate={handleSelectTemplate}
      />
    )
  }

  // Show loading state while fetching template data
  if (fetchingTemplate) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Create New Invoice</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p>Loading template data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Prepare initial data from template
  const getInitialData = () => {
    const today = new Date()
    const dueDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

    if (templateData?.sampleData) {
      const { sampleData } = templateData
      return {
        clientId: clientId || "",
        issueDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        notes: sampleData.notes || "",
        taxRate: sampleData.taxRate || 0,
        items: sampleData.items || [{ description: "", quantity: 1, unitPrice: 0 }]
      }
    }

    // Default data for blank template
    return {
      clientId: clientId || "",
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      notes: "",
      taxRate: 0,
      items: [{ description: "", quantity: 1, unitPrice: 0 }]
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create New Invoice</h2>
          {selectedTemplate && selectedTemplate !== 'blank' && (
            <p className="text-muted-foreground">Using template: {selectedTemplate.name}</p>
          )}
        </div>
      </div>

      <InvoiceForm
        initialData={getInitialData()}
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
