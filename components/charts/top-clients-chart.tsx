"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ClientData {
  id: string
  name: string
  company?: string
  invoiceCount: number
  totalRevenue: number
  averageInvoiceValue: number
  paidInvoiceCount: number
}

interface TopClientsChartProps {
  data: ClientData[]
  title?: string
  height?: number
  maxClients?: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

export function TopClientsChart({
  data,
  title = "Top Clients by Revenue",
  height = 300,
  maxClients = 8
}: TopClientsChartProps) {
  const chartData = data.slice(0, maxClients).map((client, index) => ({
    ...client,
    displayName: client.company || client.name,
    color: COLORS[index % COLORS.length],
    conversionRate: client.invoiceCount > 0 ? (client.paidInvoiceCount / client.invoiceCount) * 100 : 0
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg min-w-[200px]">
          <p className="font-medium">{data.displayName}</p>
          <p className="text-sm text-muted-foreground">Total Revenue: {formatCurrency(data.totalRevenue)}</p>
          <p className="text-sm text-muted-foreground">Invoices: {data.invoiceCount}</p>
          <p className="text-sm text-muted-foreground">Avg. Invoice: {formatCurrency(data.averageInvoiceValue)}</p>
          <p className="text-sm text-muted-foreground">Paid Rate: {data.conversionRate.toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              tickFormatter={(value) => formatCurrency(value, 'USD')}
              className="text-xs"
            />
            <YAxis
              type="category"
              dataKey="displayName"
              width={120}
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="totalRevenue" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Client details table */}
        <div className="mt-4 space-y-2">
          {chartData.slice(0, 5).map((client) => (
            <div key={client.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: client.color }}
                />
                <div>
                  <p className="text-sm font-medium">{client.displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {client.invoiceCount} invoices • {formatCurrency(client.averageInvoiceValue)} avg
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatCurrency(client.totalRevenue)}</p>
                <Badge variant={client.conversionRate >= 80 ? 'default' : client.conversionRate >= 50 ? 'secondary' : 'destructive'} className="text-xs">
                  {client.conversionRate.toFixed(0)}% paid
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}