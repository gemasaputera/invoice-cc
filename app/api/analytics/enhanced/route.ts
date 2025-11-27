import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import dayjs from 'dayjs'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || '12months' // 7days, 30days, 3months, 6months, 12months, 24months

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date
    let dateFormat: string

    switch (period) {
      case '7days':
        startDate = dayjs().subtract(7, 'day').toDate()
        dateFormat = 'YYYY-MM-DD'
        break
      case '30days':
        startDate = dayjs().subtract(30, 'day').toDate()
        dateFormat = 'YYYY-MM-DD'
        break
      case '3months':
        startDate = dayjs().subtract(3, 'month').toDate()
        dateFormat = 'YYYY-MM'
        break
      case '6months':
        startDate = dayjs().subtract(6, 'month').toDate()
        dateFormat = 'YYYY-MM'
        break
      case '24months':
        startDate = dayjs().subtract(24, 'month').toDate()
        dateFormat = 'YYYY-MM'
        break
      default: // 12months
        startDate = dayjs().subtract(12, 'month').toDate()
        dateFormat = 'YYYY-MM'
        break
    }

    // Fetch all invoices in the date range
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startDate,
          lte: now,
        },
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        items: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Fetch all clients for analytics
    const clients = await prisma.client.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        invoices: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
    })

    // Generate revenue over time data
    const revenueOverTime = generateRevenueOverTime(invoices, dateFormat)

    // Generate invoice status distribution
    const statusDistribution = generateStatusDistribution(invoices)

    // Generate top clients data
    const topClients = generateTopClients(clients)

    // Generate monthly trends
    const monthlyTrends = generateMonthlyTrends(invoices)

    // Generate client growth data
    const clientGrowth = generateClientGrowth(clients)

    // Generate invoice aging data
    const invoiceAging = generateInvoiceAging(invoices)

    // Generate key metrics
    const keyMetrics = generateKeyMetrics(invoices, clients, period)

    // Generate revenue forecast (simple linear projection)
    const revenueForecast = generateRevenueForecast(revenueOverTime)

    const enhancedAnalytics = {
      period,
      dateRange: {
        start: startDate,
        end: now,
      },
      keyMetrics,
      revenueOverTime,
      statusDistribution,
      topClients,
      monthlyTrends,
      clientGrowth,
      invoiceAging,
      revenueForecast,
    }

    return NextResponse.json(enhancedAnalytics)
  } catch (error) {
    console.error('Enhanced analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enhanced analytics' },
      { status: 500 }
    )
  }
}

function generateRevenueOverTime(invoices: any[], dateFormat: string) {
  const revenueMap = new Map<string, number>()

  // Initialize all date periods with 0
  const now = dayjs()
  let current = dayjs().subtract(12, 'month').startOf('month')

  while (current.isBefore(now) || current.isSame(now)) {
    const key = current.format(dateFormat)
    revenueMap.set(key, 0)
    current = current.add(1, dateFormat === 'YYYY-MM-DD' ? 'day' : 'month')
  }

  // Aggregate revenue by date period
  invoices
    .filter(invoice => invoice.status === 'PAID')
    .forEach(invoice => {
      const dateKey = dayjs(invoice.createdAt).format(dateFormat)
      const currentRevenue = revenueMap.get(dateKey) || 0
      revenueMap.set(dateKey, currentRevenue + Number(invoice.total))
    })

  return Array.from(revenueMap.entries())
    .map(([date, revenue]) => ({
      date,
      revenue: Number(revenue.toFixed(2)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

function generateStatusDistribution(invoices: any[]) {
  const statusCounts = {
    DRAFT: 0,
    SENT: 0,
    PAID: 0,
    OVERDUE: 0,
    CANCELLED: 0,
  }

  const statusRevenue = {
    DRAFT: 0,
    SENT: 0,
    PAID: 0,
    OVERDUE: 0,
    CANCELLED: 0,
  }

  invoices.forEach(invoice => {
    statusCounts[invoice.status as keyof typeof statusCounts]++
    statusRevenue[invoice.status as keyof typeof statusRevenue] += Number(invoice.total)
  })

  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    revenue: Number(statusRevenue[status as keyof typeof statusRevenue].toFixed(2)),
    percentage: Number((count / invoices.length * 100).toFixed(1)),
  }))
}

function generateTopClients(clients: any[]) {
  return clients
    .map((client: any) => ({
      id: client.id,
      name: client.name,
      company: client.company,
      invoiceCount: client.invoices.length,
      totalRevenue: client.invoices
        .filter((inv: any) => inv.status === 'PAID')
        .reduce((sum: number, inv: any) => sum + Number(inv.total), 0),
      averageInvoiceValue: client.invoices.length > 0
        ? client.invoices.reduce((sum: number, inv: any) => sum + Number(inv.total), 0) / client.invoices.length
        : 0,
      paidInvoiceCount: client.invoices.filter((inv: any) => inv.status === 'PAID').length,
    }))
    .filter((client: any) => client.totalRevenue > 0)
    .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10)
    .map((client: any) => ({
      ...client,
      totalRevenue: Number(client.totalRevenue.toFixed(2)),
      averageInvoiceValue: Number(client.averageInvoiceValue.toFixed(2)),
    }))
}

function generateMonthlyTrends(invoices: any[]) {
  const monthlyData = new Map<string, any>()

  // Initialize last 12 months
  const now = dayjs()
  for (let i = 11; i >= 0; i--) {
    const month = now.subtract(i, 'month').format('YYYY-MM')
    monthlyData.set(month, {
      month,
      revenue: 0,
      invoiceCount: 0,
      clientCount: new Set<string>(),
      averageInvoiceValue: 0,
    })
  }

  // Aggregate monthly data
  invoices.forEach((invoice: any) => {
    const month = dayjs(invoice.createdAt).format('YYYY-MM')
    const data = monthlyData.get(month)

    if (data) {
      data.invoiceCount++
      data.clientCount.add(invoice.clientId)
      if (invoice.status === 'PAID') {
        data.revenue += Number(invoice.total)
      }
    }
  })

  // Calculate average invoice value and convert Set to count
  return Array.from(monthlyData.values())
    .map((data: any) => ({
      month: data.month,
      revenue: Number(data.revenue.toFixed(2)),
      invoiceCount: data.invoiceCount,
      clientCount: data.clientCount.size,
      averageInvoiceValue: data.invoiceCount > 0
        ? Number((data.revenue / data.invoiceCount).toFixed(2))
        : 0,
    }))
    .sort((a: any, b: any) => a.month.localeCompare(b.month))
}

function generateClientGrowth(clients: any[]) {
  const monthlyGrowth = new Map<string, number>()

  // Initialize last 12 months
  const now = dayjs()
  for (let i = 11; i >= 0; i--) {
    const month = now.subtract(i, 'month').format('YYYY-MM')
    monthlyGrowth.set(month, 0)
  }

  // Count clients by creation month
  clients.forEach((client: any) => {
    const month = dayjs(client.createdAt).format('YYYY-MM')
    if (monthlyGrowth.has(month)) {
      monthlyGrowth.set(month, (monthlyGrowth.get(month) || 0) + 1)
    }
  })

  // Calculate cumulative client count
  let cumulative = 0
  return Array.from(monthlyGrowth.entries())
    .map(([month, newClients]: [string, number]) => {
      cumulative += newClients
      return {
        month,
        newClients,
        totalClients: cumulative,
      }
    })
    .sort((a: any, b: any) => a.month.localeCompare(b.month))
}

function generateInvoiceAging(invoices: any[]) {
  const aging = {
    current: { count: 0, amount: 0 },      // 0-30 days
    days31to60: { count: 0, amount: 0 },    // 31-60 days
    days61to90: { count: 0, amount: 0 },    // 61-90 days
    over90: { count: 0, amount: 0 },       // 90+ days
  }

  const now = dayjs()

  invoices
    .filter((invoice: any) => invoice.status === 'SENT')
    .forEach((invoice: any) => {
      const daysOverdue = now.diff(dayjs(invoice.dueDate), 'day')
      const amount = Number(invoice.total)

      if (daysOverdue <= 0) {
        aging.current.count++
        aging.current.amount += amount
      } else if (daysOverdue <= 30) {
        aging.current.count++
        aging.current.amount += amount
      } else if (daysOverdue <= 60) {
        aging.days31to60.count++
        aging.days31to60.amount += amount
      } else if (daysOverdue <= 90) {
        aging.days61to90.count++
        aging.days61to90.amount += amount
      } else {
        aging.over90.count++
        aging.over90.amount += amount
      }
    })

  // Convert amounts to fixed decimal
  Object.keys(aging).forEach((key: string) => {
    aging[key as keyof typeof aging].amount = Number(
      aging[key as keyof typeof aging].amount.toFixed(2)
    )
  })

  return aging
}

function generateKeyMetrics(invoices: any[], clients: any[], period: string) {
  const paidInvoices = invoices.filter((inv: any) => inv.status === 'PAID')
  const unpaidInvoices = invoices.filter((inv: any) => inv.status === 'SENT')
  const overdueInvoices = invoices.filter((inv: any) =>
    inv.status === 'SENT' && dayjs().isAfter(dayjs(inv.dueDate))
  )

  const totalRevenue = paidInvoices.reduce((sum: number, inv: any) => sum + Number(inv.total), 0)
  const outstandingAmount = unpaidInvoices.reduce((sum: number, inv: any) => sum + Number(inv.total), 0)
  const overdueAmount = overdueInvoices.reduce((sum: number, inv: any) => sum + Number(inv.total), 0)

  // Calculate growth rates
  const now = dayjs()
  const currentPeriodStart = period.includes('day')
    ? now.subtract(parseInt(period), 'day')
    : now.subtract(parseInt(period), 'month')

  const previousPeriodStart = period.includes('day')
    ? currentPeriodStart.subtract(parseInt(period), 'day')
    : currentPeriodStart.subtract(parseInt(period), 'month')

  const currentPeriodInvoices = invoices.filter((inv: any) =>
    dayjs(inv.createdAt).isAfter(currentPeriodStart)
  )
  const previousPeriodInvoices = invoices.filter((inv: any) =>
    dayjs(inv.createdAt).isAfter(previousPeriodStart) &&
    dayjs(inv.createdAt).isBefore(currentPeriodStart)
  )

  const currentRevenue = currentPeriodInvoices
    .filter((inv: any) => inv.status === 'PAID')
    .reduce((sum: number, inv: any) => sum + Number(inv.total), 0)
  const previousRevenue = previousPeriodInvoices
    .filter((inv: any) => inv.status === 'PAID')
    .reduce((sum: number, inv: any) => sum + Number(inv.total), 0)

  const revenueGrowth = previousRevenue > 0
    ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
    : 0

  const averageInvoiceValue = paidInvoices.length > 0
    ? totalRevenue / paidInvoices.length
    : 0

  const conversionRate = invoices.length > 0
    ? (paidInvoices.length / invoices.length) * 100
    : 0

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    outstandingAmount: Number(outstandingAmount.toFixed(2)),
    overdueAmount: Number(overdueAmount.toFixed(2)),
    totalInvoices: invoices.length,
    paidInvoices: paidInvoices.length,
    unpaidInvoices: unpaidInvoices.length,
    overdueInvoices: overdueInvoices.length,
    totalClients: clients.length,
    averageInvoiceValue: Number(averageInvoiceValue.toFixed(2)),
    conversionRate: Number(conversionRate.toFixed(1)),
    revenueGrowth: Number(revenueGrowth.toFixed(1)),
  }
}

function generateRevenueForecast(revenueOverTime: any[]) {
  if (revenueOverTime.length < 3) {
    return []
  }

  // Simple linear regression for forecasting next 3 months
  const n = revenueOverTime.length
  const x = Array.from({ length: n }, (_, i) => i)
  const y = revenueOverTime.map((d: any) => d.revenue)

  // Calculate linear regression coefficients
  const sumX = x.reduce((a: number, b: number) => a + b, 0)
  const sumY = y.reduce((a: number, b: number) => a + b, 0)
  const sumXY = x.reduce((sum: number, xi: number, i: number) => sum + xi * y[i], 0)
  const sumX2 = x.reduce((sum: number, xi: number) => sum + xi * xi, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Generate forecast for next 3 months
  const forecast = []
  for (let i = 1; i <= 3; i++) {
    const nextX = n + i - 1
    const predictedRevenue = slope * nextX + intercept
    const lastDate = dayjs(revenueOverTime[revenueOverTime.length - 1].date)
    const nextDate = lastDate.add(i, 'month').format('YYYY-MM')

    forecast.push({
      date: nextDate,
      revenue: Math.max(0, Number(predictedRevenue.toFixed(2))),
      isForecast: true,
    })
  }

  return forecast
}