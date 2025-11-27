"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatusData {
  status: string
  count: number
  revenue: number
  percentage: number
}

interface StatusDistributionChartProps {
  data: StatusData[]
  title?: string
  height?: number
  view?: 'pie' | 'bar'
}

const STATUS_COLORS = {
  DRAFT: '#94a3b8',    // slate-400
  SENT: '#3b82f6',    // blue-500
  PAID: '#10b981',    // emerald-500
  OVERDUE: '#f59e0b', // amber-500
  CANCELLED: '#ef4444' // red-500
}

const STATUS_LABELS = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
  CANCELLED: 'Cancelled'
}

export function StatusDistributionChart({
  data,
  title = "Invoice Status Distribution",
  height = 300,
  view = 'pie'
}: StatusDistributionChartProps) {
  const chartData = data.map(item => ({
    ...item,
    label: STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || item.status,
    color: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || '#94a3b8'
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.label}</p>
          <p className="text-sm text-muted-foreground">Count: {data.count}</p>
          <p className="text-sm text-muted-foreground">Revenue: {formatCurrency(data.revenue)}</p>
          <p className="text-sm text-muted-foreground">Percentage: {data.percentage}%</p>
        </div>
      )
    }
    return null
  }

  if (view === 'bar') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#8884d8" name="Count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => `${entry.label}: ${entry.percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => {
                const item = chartData.find(d => d.label === value)
                return `${value} (${item?.count || 0})`
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}