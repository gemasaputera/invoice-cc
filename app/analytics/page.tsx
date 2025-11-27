"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/layout/app-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import Link from "next/link"
import { RevenueChart } from "@/components/charts/revenue-chart"
import { StatusDistributionChart } from "@/components/charts/status-distribution-chart"
import { TopClientsChart } from "@/components/charts/top-clients-chart"
import { MonthlyTrendsChart } from "@/components/charts/monthly-trends-chart"
import { InvoiceAgingChart } from "@/components/charts/invoice-aging-chart"
import { StatsCards } from "@/components/dashboard/stats-cards"
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Calendar,
  Download,
  RefreshCw
} from "lucide-react"
import { formatCurrency } from '@/lib/utils'

interface EnhancedAnalytics {
  period: string
  dateRange: {
    start: string
    end: string
  }
  keyMetrics: {
    totalRevenue: number
    outstandingAmount: number
    overdueAmount: number
    totalInvoices: number
    paidInvoices: number
    unpaidInvoices: number
    overdueInvoices: number
    totalClients: number
    averageInvoiceValue: number
    conversionRate: number
    revenueGrowth: number
  }
  revenueOverTime: Array<{
    date: string
    revenue: number
    isForecast?: boolean
  }>
  statusDistribution: Array<{
    status: string
    count: number
    revenue: number
    percentage: number
  }>
  topClients: Array<{
    id: string
    name: string
    company?: string
    invoiceCount: number
    totalRevenue: number
    averageInvoiceValue: number
    paidInvoiceCount: number
  }>
  monthlyTrends: Array<{
    month: string
    revenue: number
    invoiceCount: number
    clientCount: number
    averageInvoiceValue: number
  }>
  clientGrowth: Array<{
    month: string
    newClients: number
    totalClients: number
  }>
  invoiceAging: {
    current: { count: number; amount: number }
    days31to60: { count: number; amount: number }
    days61to90: { count: number; amount: number }
    over90: { count: number; amount: number }
  }
  revenueForecast: Array<{
    date: string
    revenue: number
    isForecast: boolean
  }>
}

const PERIOD_OPTIONS = [
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '3months', label: 'Last 3 Months' },
  { value: '6months', label: 'Last 6 Months' },
  { value: '12months', label: 'Last 12 Months' },
  { value: '24months', label: 'Last 24 Months' },
]

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<EnhancedAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('12months')

  const fetchAnalytics = async (selectedPeriod: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/analytics/enhanced?period=${selectedPeriod}`)

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(period)
  }, [period])

  const handleExportData = () => {
    if (!analytics) return

    const exportData = {
      period: analytics.period,
      dateRange: analytics.dateRange,
      keyMetrics: analytics.keyMetrics,
      topClients: analytics.topClients,
      generatedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${analytics.period}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="flex-1 space-y-4 p-4 sm:p-6 pt-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading analytics...</p>
              </div>
            </div>
          </div>
        </AppLayout>
      </AuthGuard>
    )
  }

  if (error || !analytics) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="flex-1 space-y-4 p-4 sm:p-6 pt-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <AlertTriangle className="h-12 w-12 text-destructive" />
                  <div className="text-center">
                    <h3 className="font-semibold">Failed to load analytics</h3>
                    <p className="text-sm text-muted-foreground">{error || 'An unexpected error occurred'}</p>
                  </div>
                  <Button onClick={() => fetchAnalytics(period)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </AppLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="flex-1 space-y-4 p-4 sm:p-6 pt-6">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Detailed insights and trends for your invoice business
              </p>
              <div className="mt-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard" className="text-muted-foreground">
                    ← Back to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[160px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERIOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={() => fetchAnalytics(period)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Key Metrics Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics.keyMetrics.totalRevenue)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {analytics.keyMetrics.revenueGrowth >= 0 ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                  )}
                  {analytics.keyMetrics.revenueGrowth.toFixed(1)}% from previous period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics.keyMetrics.outstandingAmount)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {analytics.keyMetrics.overdueAmount > 0 && (
                    <Badge variant="destructive" className="mr-2">
                      {formatCurrency(analytics.keyMetrics.overdueAmount)} overdue
                    </Badge>
                  )}
                  {analytics.keyMetrics.unpaidInvoices} unpaid invoices
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.keyMetrics.conversionRate.toFixed(1)}%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {analytics.keyMetrics.paidInvoices}/{analytics.keyMetrics.totalInvoices} paid
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.keyMetrics.totalClients}</div>
                <div className="text-xs text-muted-foreground">
                  Avg invoice: {formatCurrency(analytics.keyMetrics.averageInvoiceValue)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="space-y-6">
            {/* Revenue Chart with Forecast */}
            <RevenueChart
              data={[...analytics.revenueOverTime, ...analytics.revenueForecast]}
              showForecast={true}
              height={350}
            />

            {/* Two column layout for medium screens */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Status Distribution */}
              <StatusDistributionChart
                data={analytics.statusDistribution}
                view="bar"
                height={300}
              />

              {/* Invoice Aging */}
              <InvoiceAgingChart
                data={analytics.invoiceAging}
                view="bar"
                height={300}
              />
            </div>

            {/* Monthly Trends */}
            <MonthlyTrendsChart
              data={analytics.monthlyTrends}
              metrics={['revenue', 'invoiceCount', 'clientCount']}
              height={350}
            />

            {/* Top Clients */}
            <TopClientsChart
              data={analytics.topClients}
              maxClients={10}
              height={400}
            />
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}