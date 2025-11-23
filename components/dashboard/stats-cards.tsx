"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, FileText, Users, Clock } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    trend: 'up' | 'down'
  }
  icon: React.ReactNode
}

function StatsCard({ title, value, change, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center">
            {change.trend === 'up' ? (
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
            )}
            {Math.abs(change.value)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface DashboardStats {
  totalRevenue: number
  totalInvoices: number
  totalClients: number
  outstandingAmount: number
  revenueChange: number
  invoiceChange: number
}

export function StatsCards() {
  // Mock data - replace with actual API calls
  const stats: DashboardStats = {
    totalRevenue: 45231.89,
    totalInvoices: 124,
    totalClients: 47,
    outstandingAmount: 12420.50,
    revenueChange: 20.1,
    invoiceChange: 15.3,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        change={{ value: stats.revenueChange, trend: 'up' }}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Invoices"
        value={stats.totalInvoices}
        change={{ value: stats.invoiceChange, trend: 'up' }}
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Active Clients"
        value={stats.totalClients}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Outstanding"
        value={formatCurrency(stats.outstandingAmount)}
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}