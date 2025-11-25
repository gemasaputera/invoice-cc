import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get current date and date ranges
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)

    // Fetch invoice data
    const invoices = await prisma.invoice.findMany({
      where: {
        userId,
      },
      include: {
        client: {
          select: {
            id: true,
          },
        },
      },
    })

    // Get unique clients
    const clients = await prisma.client.count({
      where: {
        userId,
      },
    })

    // Calculate current month stats
    const currentMonthInvoices = invoices.filter(
      (invoice) => new Date(invoice.createdAt) >= currentMonth
    )

    const lastMonthInvoices = invoices.filter(
      (invoice) => {
        const date = new Date(invoice.createdAt)
        return date >= lastMonth && date < currentMonth
      }
    )

    // Calculate revenue
    const totalRevenue = invoices
      .filter((invoice) => invoice.status === 'PAID')
      .reduce((sum, invoice) => sum + Number(invoice.total), 0)

    const currentMonthRevenue = currentMonthInvoices
      .filter((invoice) => invoice.status === 'PAID')
      .reduce((sum, invoice) => sum + Number(invoice.total), 0)

    const lastMonthRevenue = lastMonthInvoices
      .filter((invoice) => invoice.status === 'PAID')
      .reduce((sum, invoice) => sum + Number(invoice.total), 0)

    // Calculate outstanding amount (invoices that are SENT but not PAID)
    const outstandingInvoices = invoices.filter(
      (invoice) => invoice.status === 'SENT'
    )

    const outstandingAmount = outstandingInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.total),
      0
    )

    // Calculate overdue amount (SENT invoices past due date)
    const overdueInvoices = invoices.filter(
      (invoice) => invoice.status === 'SENT' && invoice.dueDate && new Date(invoice.dueDate) < now
    )

    const overdueAmount = overdueInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.total),
      0
    )

    // Calculate change percentages
    const revenueChange = lastMonthRevenue > 0
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : currentMonthRevenue > 0 ? 100 : 0

    const invoiceChange = lastMonthInvoices.length > 0
      ? ((currentMonthInvoices.length - lastMonthInvoices.length) / lastMonthInvoices.length) * 100
      : currentMonthInvoices.length > 0 ? 100 : 0

    // Status breakdown
    const statusCounts = {
      DRAFT: invoices.filter((i) => i.status === 'DRAFT').length,
      SENT: invoices.filter((i) => i.status === 'SENT').length,
      PAID: invoices.filter((i) => i.status === 'PAID').length,
      OVERDUE: invoices.filter((i) => i.status === 'OVERDUE').length,
      CANCELLED: invoices.filter((i) => i.status === 'CANCELLED').length,
    }

    const analytics = {
      totalRevenue,
      totalInvoices: invoices.length,
      totalClients: clients,
      outstandingAmount,
      overdueAmount,
      revenueChange,
      invoiceChange,
      currentMonthRevenue,
      lastMonthRevenue,
      statusCounts,
      averageInvoiceValue: invoices.length > 0 ? totalRevenue / invoices.filter(i => i.status === 'PAID').length : 0,
      paidInvoices: statusCounts.PAID,
      sentInvoices: statusCounts.SENT,
      draftInvoices: statusCounts.DRAFT,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}