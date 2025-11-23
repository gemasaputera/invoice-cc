"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userSettingsSchema, type UserSettingsFormData } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"

interface UserSettingsFormProps {
  onSubmit?: (data: UserSettingsFormData) => Promise<void>
}

export function UserSettingsForm({ onSubmit }: UserSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const form = useForm<UserSettingsFormData>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      name: "",
      businessName: "",
      email: "",
      phone: "",
      address: "",
      taxId: "",
      invoicePrefix: "INV",
    },
  })

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        businessName: session.user.businessName || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        address: session.user.address || "",
        taxId: session.user.taxId || "",
        invoicePrefix: session.user.invoicePrefix || "INV",
      })
    }
  }, [session, form])

  const handleSubmit = async (data: UserSettingsFormData) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success("Settings updated successfully")
        onSubmit?.(data)
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to update settings")
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast.error("Failed to update settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  {...form.register("name")}
                  disabled={isLoading}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...form.register("email")}
                  disabled={isLoading}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Your business name"
                {...form.register("businessName")}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  {...form.register("phone")}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  placeholder="Your tax ID number"
                  {...form.register("taxId")}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Your business address"
                rows={3}
                {...form.register("address")}
                disabled={isLoading}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Invoice Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
              <Input
                id="invoicePrefix"
                placeholder="INV"
                maxLength={3}
                {...form.register("invoicePrefix")}
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                This prefix will be used for all your invoice numbers (e.g., INV0001)
              </p>
              {form.formState.errors.invoicePrefix && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.invoicePrefix.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </div>
  )
}