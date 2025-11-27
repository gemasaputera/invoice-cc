"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MonthlyTrendData {
  month: string
  revenue: number
  invoiceCount: number
  clientCount: number
  averageInvoiceValue: number
}

interface MonthlyTrendsChartProps {
  data: MonthlyTrendData[]
  title?: string
  height?: number
  metrics?: ('revenue' | 'invoiceCount' | 'clientCount' | 'averageInvoiceValue')[]
}

export function MonthlyTrendsChart({
  data,
  title = "Monthly Trends",
  height = 350,
  metrics = ['revenue', 'invoiceCount']
}: MonthlyTrendsChartProps) {
  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg min-w-[200px]">
          <p className="font-medium">{formatMonth(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Revenue' || entry.name === 'Avg Invoice Value'
                ? formatCurrency(entry.value)
                : entry.value
              }
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const getMetricConfig = (metric: string) => {
    switch (metric) {
      case 'revenue':
        return {
          key: 'revenue',
          name: 'Revenue',
          color: '#10b981',
          yAxisId: 'revenue',
          formatter: (value: number) => formatCurrency(value)
        }
      case 'invoiceCount':
        return {
          key: 'invoiceCount',
          name: 'Invoices',
          color: '#3b82f6',
          yAxisId: 'count',
          formatter: (value: number) => value.toString()
        }
      case 'clientCount':
        return {
          key: 'clientCount',
          name: 'Clients',
          color: '#f59e0b',
          yAxisId: 'count',
          formatter: (value: number) => value.toString()
        }
      case 'averageInvoiceValue':
        return {
          key: 'averageInvoiceValue',
          name: 'Avg Invoice Value',
          color: '#8b5cf6',
          yAxisId: 'revenue',
          formatter: (value: number) => formatCurrency(value)
        }
      default:
        return {
          key: metric,
          name: metric,
          color: '#6b7280',
          yAxisId: 'count',
          formatter: (value: number) => value.toString()
        }
    }
  }

  const hasRevenueMetrics = metrics.includes('revenue') || metrics.includes('averageInvoiceValue')
  const hasCountMetrics = metrics.includes('invoiceCount') || metrics.includes('clientCount')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              className="text-xs"
            />

            {hasRevenueMetrics && (
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tickFormatter={(value) => formatCurrency(value, 'USD')}
                className="text-xs"
              />
            )}

            {hasCountMetrics && (
              <YAxis
                yAxisId="count"
                orientation="right"
                className="text-xs"
              />
            )}

            <Tooltip content={<CustomTooltip />} />

            {metrics.map((metric, index) => {
              const config = getMetricConfig(metric)
              const showLine = metric === 'revenue' || metric === 'averageInvoiceValue'
              const showBar = metric === 'invoiceCount' || metric === 'clientCount'

              return showLine ? (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={config.key}
                  stroke={config.color}
                  strokeWidth={2}
                  name={config.name}
                  yAxisId={config.yAxisId}
                  dot={{ r: 3 }}
                />
              ) : showBar ? (
                <Bar
                  key={metric}
                  dataKey={config.key}
                  fill={config.color}
                  name={config.name}
                  yAxisId={config.yAxisId}
                  radius={[4, 4, 0, 0]}
                />
              ) : null
            })}
          </ComposedChart>
        </ResponsiveContainer>

        {/* Metrics summary */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const config = getMetricConfig(metric)
            const latestValue = (data[data.length - 1] as any)?.[config.key] || 0
            const previousValue = (data[data.length - 2] as any)?.[config.key] || 0
            const change = previousValue > 0 ? ((latestValue - previousValue) / previousValue) * 100 : 0

            return (
              <div key={metric} className="text-center p-2 rounded-lg bg-muted/30">
                <div
                  className="w-2 h-2 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: config.color }}
                />
                <p className="text-xs text-muted-foreground">{config.name}</p>
                <p className="font-medium">{config.formatter(latestValue)}</p>
                {change !== 0 && (
                  <p className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}