"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react'

interface AgingData {
  current: { count: number; amount: number }
  days31to60: { count: number; amount: number }
  days61to90: { count: number; amount: number }
  over90: { count: number; amount: number }
}

interface InvoiceAgingChartProps {
  data: AgingData
  title?: string
  height?: number
  view?: 'bar' | 'pie'
}

const AGING_COLORS = {
  current: '#10b981',     // emerald-500
  days31to60: '#f59e0b',  // amber-500
  days61to90: '#f97316',  // orange-500
  over90: '#ef4444'       // red-500
}

const AGING_LABELS = {
  current: 'Current (0-30 days)',
  days31to60: '31-60 days',
  days61to90: '61-90 days',
  over90: 'Over 90 days'
}

export function InvoiceAgingChart({
  data,
  title = "Invoice Aging Report",
  height = 300,
  view = 'bar'
}: InvoiceAgingChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    key,
    label: AGING_LABELS[key as keyof typeof AGING_LABELS],
    count: value.count,
    amount: value.amount,
    color: AGING_COLORS[key as keyof typeof AGING_COLORS]
  }))

  const totalOutstanding = Object.values(data).reduce((sum, item) => sum + item.amount, 0)
  const totalInvoices = Object.values(data).reduce((sum, item) => sum + item.count, 0)

  const getRiskLevel = () => {
    const over90Percentage = totalInvoices > 0 ? (data.over90.count / totalInvoices) * 100 : 0
    const over90AmountPercentage = totalOutstanding > 0 ? (data.over90.amount / totalOutstanding) * 100 : 0

    if (over90Percentage > 20 || over90AmountPercentage > 30) return { level: 'High', color: 'destructive', icon: AlertTriangle }
    if (over90Percentage > 10 || over90AmountPercentage > 15) return { level: 'Medium', color: 'secondary', icon: Clock }
    return { level: 'Low', color: 'default', icon: CheckCircle }
  }

  const riskLevel = getRiskLevel()

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = totalOutstanding > 0 ? (data.amount / totalOutstanding) * 100 : 0
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.label}</p>
          <p className="text-sm text-muted-foreground">Count: {data.count}</p>
          <p className="text-sm text-muted-foreground">Amount: {formatCurrency(data.amount)}</p>
          <p className="text-sm text-muted-foreground">Percentage: {percentage.toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  const RiskLevelBadge = () => (
    <Badge variant={riskLevel.color as any} className="ml-2">
      <riskLevel.icon className="w-3 h-3 mr-1" />
      {riskLevel.level} Risk
    </Badge>
  )

  if (view === 'pie') {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {title}
            <RiskLevelBadge />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Total Outstanding</p>
              <p className="text-lg font-semibold">{formatCurrency(totalOutstanding)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-lg font-semibold">{totalInvoices}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.label}: ${((entry.amount / totalOutstanding) * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {title}
          <RiskLevelBadge />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {chartData.map((item) => {
            const percentage = totalOutstanding > 0 ? (item.amount / totalOutstanding) * 100 : 0
            const Icon = item.key === 'current' ? CheckCircle : item.key === 'over90' ? AlertTriangle : Clock

            return (
              <div key={item.key} className="text-center p-3 rounded-lg bg-muted/30 border-l-4" style={{ borderLeftColor: item.color }}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
                <p className="font-semibold">{formatCurrency(item.amount)}</p>
                <p className="text-xs text-muted-foreground">{item.count} invoices</p>
                <p className="text-xs font-medium" style={{ color: item.color }}>{percentage.toFixed(1)}%</p>
              </div>
            )
          })}
        </div>

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              className="text-xs"
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value, 'USD')}
              className="text-xs"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Risk Assessment */}
        <div className="mt-4 p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <riskLevel.icon className="w-5 h-5" />
              <span className="font-medium">Collection Risk Assessment</span>
            </div>
            <Badge variant={riskLevel.color as any}>{riskLevel.level}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {riskLevel.level === 'High' && 'Immediate attention required. Consider follow-up calls or collection agencies for overdue invoices.'}
            {riskLevel.level === 'Medium' && 'Monitor aging invoices closely. Send payment reminders and follow up on overdue amounts.'}
            {riskLevel.level === 'Low' && 'Good collection performance. Continue monitoring and maintain current payment terms.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}