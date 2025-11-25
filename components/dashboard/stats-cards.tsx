"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, FileText, Users, Clock, AlertCircle, Info, RefreshCw, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    trend: 'up' | 'down'
  }
  icon: React.ReactNode
  description: string
  detail?: string
  loading?: boolean
}

function StatsCard({ title, value, change, icon, description, detail, loading = false }: StatsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </CardTitle>
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-16 mt-2 animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="cursor-help transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              {title}
              <Info className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            </CardTitle>
            <div className="flex-shrink-0">{icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold truncate">{value}</div>
            {change && (
              <p className="text-xs text-muted-foreground flex items-center">
                {change.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500 flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500 flex-shrink-0" />
                )}
                <span className="truncate">{Math.abs(change.value)}% from last month</span>
              </p>
            )}
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
          {detail && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                <Info className="h-3 w-3 inline mr-1" />
                {detail}
              </p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

interface DashboardStats {
  totalRevenue: number
  totalInvoices: number
  totalClients: number
  outstandingAmount: number
  overdueAmount: number
  revenueChange: number
  invoiceChange: number
  currentMonthRevenue: number
  lastMonthRevenue: number
  statusCounts: {
    DRAFT: number
    SENT: number
    PAID: number
    OVERDUE: number
    CANCELLED: number
  }
  averageInvoiceValue: number
  paidInvoices: number
  sentInvoices: number
  draftInvoices: number
}

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/analytics')

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const getTrendDirection = (change: number): 'up' | 'down' => {
    return change >= 0 ? 'up' : 'down'
  }

  if (error) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Analytics Error</p>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <Button
                onClick={fetchAnalytics}
                variant="outline"
                size="sm"
                className="mt-2 w-full"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={stats ? formatCurrency(stats.totalRevenue) : "-"}
        change={stats ? { value: stats.revenueChange, trend: getTrendDirection(stats.revenueChange) } : undefined}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        description="Total revenue from all paid invoices"
        detail={stats ? `Current: ${formatCurrency(stats.currentMonthRevenue)} | Last month: ${formatCurrency(stats.lastMonthRevenue)}` : undefined}
        loading={loading}
      />
      <StatsCard
        title="Total Invoices"
        value={stats ? stats.totalInvoices : "-"}
        change={stats ? { value: stats.invoiceChange, trend: getTrendDirection(stats.invoiceChange) } : undefined}
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        description="Total number of invoices created"
        detail={stats ? `Draft: ${stats.draftInvoices} | Sent: ${stats.sentInvoices} | Paid: ${stats.paidInvoices}` : undefined}
        loading={loading}
      />
      <StatsCard
        title="Active Clients"
        value={stats ? stats.totalClients : "-"}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        description="Total number of clients you work with"
        detail="Unique clients with at least one invoice"
        loading={loading}
      />
      <StatsCard
        title="Outstanding"
        value={stats ? formatCurrency(stats.outstandingAmount) : "-"}
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        description="Total amount of unpaid sent invoices"
        detail={stats && stats.overdueAmount > 0 ? `⚠️ ${formatCurrency(stats.overdueAmount)} is overdue` : "No overdue payments"}
        loading={loading}
      />
    </div>
  )
}