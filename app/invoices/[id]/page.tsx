"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Edit, Download, Send, FileText, MoreHorizontal, CheckCircle, DollarSign, AlertCircle, XCircle } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

interface Invoice {
  id: string
  invoiceNumber: string
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED"
  issueDate: string
  dueDate?: string
  total: number
  subtotal: number
  taxRate: number
  taxAmount: number
  currency: string
  notes?: string
  client: {
    id: string
    name: string
    email?: string
    phone?: string
    company?: string
    address?: string
  }
  user: {
    id: string
    name: string
    businessName?: string
    email: string
    phone?: string
    address?: string
    taxId?: string
  }
  items: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  createdAt: string
  updatedAt: string
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

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

  const handleDownload = async () => {
    if (!invoice) return

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

  const updateInvoiceStatus = async (newStatus: string) => {
    if (!invoice) return

    try {
      const response = await fetch(`/api/invoices/${invoice.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Invoice #${invoice.invoiceNumber} marked as ${newStatus}`)
        fetchInvoice() // Refresh the invoice data
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to update invoice status")
      }
    } catch (error) {
      console.error("Error updating invoice status:", error)
      toast.error("Failed to update invoice status")
    }
  }

  const handleMarkAsSent = () => {
    updateInvoiceStatus("SENT")
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
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  return (
    <AuthGuard>
      <AppLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/invoices")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Invoices
              </Button>
              <h2 className="text-3xl font-bold tracking-tight">
                Invoice #{invoice.invoiceNumber}
              </h2>
              <Badge variant="secondary" className={getStatusColor(invoice.status)}>
                {invoice.status}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              {/* Status Update Dropdown */}
              {(invoice.status === "DRAFT" || invoice.status === "SENT" || invoice.status === "OVERDUE") && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreHorizontal className="mr-2 h-4 w-4" />
                      Update Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {invoice.status === "DRAFT" && (
                      <DropdownMenuItem onClick={() => updateInvoiceStatus("SENT")}>
                        <Send className="mr-2 h-4 w-4" />
                        Mark as Sent
                      </DropdownMenuItem>
                    )}
                    {invoice.status === "DRAFT" && (
                      <DropdownMenuItem onClick={() => updateInvoiceStatus("CANCELLED")}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Invoice
                      </DropdownMenuItem>
                    )}
                    {(invoice.status === "SENT" || invoice.status === "OVERDUE") && (
                      <DropdownMenuItem onClick={() => updateInvoiceStatus("PAID")}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Paid
                      </DropdownMenuItem>
                    )}
                    {(invoice.status === "SENT" || invoice.status === "OVERDUE") && (
                      <DropdownMenuItem onClick={() => updateInvoiceStatus("OVERDUE")}>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Mark as Overdue
                      </DropdownMenuItem>
                    )}
                    {(invoice.status === "SENT" || invoice.status === "OVERDUE") && (
                      <DropdownMenuItem onClick={() => updateInvoiceStatus("CANCELLED")}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Invoice
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>

              {invoice.status === "DRAFT" && (
                <Button
                  onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Invoice
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Invoice Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                    <p>{formatDate(invoice.issueDate)}</p>
                  </div>
                  {invoice.dueDate && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                      <p>{formatDate(invoice.dueDate)}</p>
                    </div>
                  )}
                </div>

                {invoice.notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="whitespace-pre-wrap">{invoice.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle>Bill To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{invoice.client.name}</h4>
                  {invoice.client.company && (
                    <p className="text-muted-foreground">{invoice.client.company}</p>
                  )}
                  {invoice.client.email && <p>{invoice.client.email}</p>}
                  {invoice.client.phone && <p>{invoice.client.phone}</p>}
                  {invoice.client.address && (
                    <p className="whitespace-pre-wrap">{invoice.client.address}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  {invoice.taxRate > 0 && (
                    <div className="flex justify-between">
                      <span>Tax ({invoice.taxRate}%):</span>
                      <span>{formatCurrency(invoice.taxAmount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(invoice.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}