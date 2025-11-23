"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { invoiceSchema, type InvoiceFormData } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus } from "lucide-react"
import { ClientSelect } from "@/components/clients/client-select"
import { formatCurrency } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
}

interface InvoiceFormProps {
  initialData?: Partial<InvoiceFormData>
  onSubmit: (data: InvoiceFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  clientId?: string
}

export function InvoiceForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  clientId,
}: InvoiceFormProps) {
  const [items, setItems] = useState<InvoiceItem[]>(
    initialData?.items || [{ description: "", quantity: 1, unitPrice: 0 }]
  )

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: clientId || initialData?.clientId || "",
      issueDate: initialData?.issueDate ? new Date(initialData.issueDate) : new Date(),
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
      notes: initialData?.notes || "",
      taxRate: initialData?.taxRate || 0,
      items: items,
    },
  })

  useEffect(() => {
    // Update form items when items state changes
    form.setValue("items", items)
  }, [items, form])

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length === 1) return // Keep at least one item
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    if (field === "quantity" || field === "unitPrice") {
      const numValue = typeof value === "string" ? parseFloat(value) || 0 : value
      newItems[index] = { ...newItems[index], [field]: numValue }
    } else {
      newItems[index] = { ...newItems[index], [field]: value as string }
    }
    setItems(newItems)
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    const taxRate = form.watch("taxRate") || 0
    return subtotal * (taxRate / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSubmit = async (data: InvoiceFormData) => {
    try {
      await onSubmit({
        ...data,
        items,
      })
    } catch (error) {
      console.error("Submit error:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client *</Label>
              <ClientSelect
                value={form.watch("clientId")}
                onValueChange={(value) => form.setValue("clientId", value)}
                disabled={isLoading}
              />
              {form.formState.errors.clientId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.clientId.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Invoice Items</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid gap-4 md:grid-cols-5">
                <div className="md:col-span-2">
                  <Label htmlFor={`description-${index}`}>Description *</Label>
                  <Input
                    id={`description-${index}`}
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    placeholder="Service description"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor={`quantity-${index}`}>Quantity *</Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                    min="1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor={`price-${index}`}>Unit Price *</Label>
                  <Input
                    id={`price-${index}`}
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label>Total</Label>
                    <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted text-sm">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={isLoading || items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    {...form.register("issueDate", { valueAsDate: true })}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    {...form.register("dueDate", { valueAsDate: true })}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    placeholder="0"
                    step="0.1"
                    min="0"
                    max="100"
                    {...form.register("taxRate", { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Payment terms, notes, etc."
                  rows={4}
                  {...form.register("notes")}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
              </div>
              {(form.watch("taxRate") || 0) > 0 && (
                <div className="flex justify-between">
                  <span>Tax ({form.watch("taxRate") || 0}%):</span>
                  <span className="font-medium">{formatCurrency(calculateTax())}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-6">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                onClick={form.handleSubmit(handleSubmit)}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {initialData ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  initialData ? "Update Invoice" : "Create Invoice"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}