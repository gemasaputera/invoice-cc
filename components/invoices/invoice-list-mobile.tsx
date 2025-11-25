"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Eye, Trash2, Download, Send } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"

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

interface InvoiceListProps {
  onInvoiceSelect?: (invoice: Invoice) => void
  onInvoiceEdit?: (invoice: Invoice) => void
  onInvoiceDelete?: (invoice: Invoice) => void
  onInvoiceSend?: (invoice: Invoice) => void
  onInvoiceDownload?: (invoice: Invoice) => void
  onInvoiceCreate?: () => void
  invoices?: Invoice[]
  searchTerm?: string
  statusFilter?: string
  onSearchChange?: (term: string) => void
  onStatusFilterChange?: (status: string) => void
}

export function InvoiceList({
  onInvoiceSelect,
  onInvoiceEdit,
  onInvoiceDelete,
  onInvoiceSend,
  onInvoiceDownload,
  onInvoiceCreate,
  invoices: externalInvoices = [],
  searchTerm: externalSearchTerm,
  statusFilter: externalStatusFilter,
  onSearchChange,
  onStatusFilterChange,
}: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm || "")
  const [statusFilter, setStatusFilter] = useState(externalStatusFilter || "all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!externalSearchTerm) {
      setSearchTerm("")
    }
    if (!externalStatusFilter) {
      setStatusFilter("all")
    }
  }, [externalSearchTerm, externalStatusFilter])

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/invoices")
        if (response.ok) {
          const data = await response.json()
          setInvoices(data)
        } else {
          console.error("Failed to fetch invoices")
        }
      } catch (error) {
        console.error("Failed to fetch invoices:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange?.(value)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    onStatusFilterChange?.(value)
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

  const isOverdue = (invoice: Invoice) => {
    if (!invoice.dueDate || invoice.status === "PAID" || invoice.status === "CANCELLED") {
      return false
    }
    return new Date(invoice.dueDate) < new Date()
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = searchTerm === "" ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.company?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg sm:text-xl">Invoices</CardTitle>
          <Button onClick={onInvoiceCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Invoice</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 w-full"
            />
          </div>

          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" ? (
                <>
                  <p>No invoices found</p>
                  <Button variant="link" onClick={() => {
                    handleSearchChange("")
                    handleStatusFilterChange("all")
                  }}>
                    Clear filters
                  </Button>
                </>
              ) : (
                <>
                  <p>No invoices yet</p>
                  <p className="text-sm">Create your first invoice to get started</p>
                  <Button className="mt-4" onClick={onInvoiceCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Cards Layout */}
            <div className="space-y-3 sm:hidden">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="p-4 border rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-200 dark:hover:bg-gray-800/50"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="flex items-center gap-2 min-w-0 cursor-pointer"
                      onClick={() => onInvoiceSelect?.(invoice)}
                    >
                      <span className="font-semibold text-base truncate">#{invoice.invoiceNumber}</span>
                      <Badge
                        variant="secondary"
                        className={`flex-shrink-0 ${getStatusColor(invoice.status)}`}
                      >
                        {invoice.status}
                        {isOverdue(invoice) && (
                          <span className="ml-1 animate-pulse">⚠️</span>
                        )}
                      </Badge>
                    </div>
                    <div className="flex-shrink-0 font-semibold">
                      {formatCurrency(invoice.total)}
                    </div>
                  </div>

                  {/* Client Info */}
                  <div
                    className="text-sm text-muted-foreground mb-2 cursor-pointer"
                    onClick={() => onInvoiceSelect?.(invoice)}
                  >
                    <div className="font-medium">{invoice.client.name}</div>
                    {invoice.client.company && (
                      <div className="truncate">{invoice.client.company}</div>
                    )}
                  </div>

                  {/* Dates */}
                  <div
                    className="text-sm text-muted-foreground mb-3 cursor-pointer"
                    onClick={() => onInvoiceSelect?.(invoice)}
                  >
                    <div>Issued: {formatDate(invoice.issueDate)}</div>
                    {invoice.dueDate && (
                      <div className={isOverdue(invoice) ? 'text-red-600 font-medium' : ''}>
                        Due: {formatDate(invoice.dueDate)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onInvoiceSelect?.(invoice)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {invoice.status === "DRAFT" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onInvoiceEdit?.(invoice)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onInvoiceSend?.(invoice)}
                          className="flex-1"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadPDF(invoice.id, invoice.invoiceNumber)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onInvoiceSelect?.(invoice)}
                    >
                      <TableCell className="font-medium">
                        #{invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.client.name}</div>
                          {invoice.client.company && (
                            <div className="text-sm text-muted-foreground">
                              {invoice.client.company}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(invoice.status)}
                        >
                          {invoice.status}
                          {isOverdue(invoice) && (
                            <span className="ml-1 animate-pulse">⚠️</span>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{formatDate(invoice.issueDate)}</div>
                          {invoice.dueDate && (
                            <div className={`text-sm ${
                              isOverdue(invoice) ? 'text-red-600 font-medium' : 'text-muted-foreground'
                            }`}>
                              Due: {formatDate(invoice.dueDate)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(invoice.total)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onInvoiceSelect?.(invoice)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            {invoice.status === "DRAFT" && (
                              <>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onInvoiceEdit?.(invoice)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onInvoiceSend?.(invoice)
                                  }}
                                >
                                  <Send className="mr-2 h-4 w-4" />
                                  Mark as Sent
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                downloadPDF(invoice.id, invoice.invoiceNumber)
                              }}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {invoice.status === "DRAFT" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onInvoiceDelete?.(invoice)
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}