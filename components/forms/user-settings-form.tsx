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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"
import { SUPPORTED_CURRENCIES } from "@/lib/validations"
import { LogoUpload } from "./logo-upload"

interface UserSettingsFormProps {
  onSubmit?: (data: UserSettingsFormData) => Promise<void>
}

export function UserSettingsForm({ onSubmit }: UserSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingData, setIsFetchingData] = useState(true)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
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
      defaultCurrency: "IDR",
      invoicePrefix: "INV",
    },
  })

  useEffect(() => {
    fetchUserSettings()
  }, [])

  const fetchUserSettings = async () => {
    try {
      setIsFetchingData(true)
      const response = await fetch("/api/users/profile")

      if (response.ok) {
        const userData = await response.json()

        // Set logo URL state
        setLogoUrl(userData.logoUrl || null)

        // Use the fetched data to populate the form
        form.reset({
          name: userData.name || "",
          businessName: userData.businessName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          taxId: userData.taxId || "",
          defaultCurrency: userData.defaultCurrency || "IDR",
          invoicePrefix: userData.invoicePrefix || "INV",
        })
      } else {
        console.error("Failed to fetch user settings")
        // Fall back to session data if API fails
        if (session?.user) {
          const user = session.user as any
          setLogoUrl(user.logoUrl || null)
          form.reset({
            name: user.name || "",
            businessName: user.businessName || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            taxId: user.taxId || "",
            defaultCurrency: user.defaultCurrency || "IDR",
            invoicePrefix: user.invoicePrefix || "INV",
          })
        }
      }
    } catch (error) {
      console.error("Error fetching user settings:", error)
      toast.error("Failed to load user settings")
    } finally {
      setIsFetchingData(false)
    }
  }

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

  if (isFetchingData) {
    return (
      <div className="space-y-6">
        {/* Loading Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading your settings...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Settings</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUserSettings}
          disabled={isFetchingData}
          className="w-full sm:w-auto"
        >
          {isFetchingData ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          <span className="sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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

      {/* Logo Upload */}
      <LogoUpload
        currentLogoUrl={logoUrl}
        onLogoChange={setLogoUrl}
        disabled={isLoading || isFetchingData}
      />

      {/* Invoice Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Select
                value={form.watch("defaultCurrency")}
                onValueChange={(value) => form.setValue("defaultCurrency", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your default currency" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{currency.label}</span>
                        <span className="text-muted-foreground">({currency.symbol})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                This currency will be used as the default for all new invoices
              </p>
              {form.formState.errors.defaultCurrency && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.defaultCurrency.message}
                </p>
              )}
            </div>

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
      <div className="flex justify-start sm:justify-end">
        <Button
          type="submit"
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isLoading || isFetchingData}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isFetchingData ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </div>
  )
}