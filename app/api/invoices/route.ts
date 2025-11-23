import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { invoiceSchema } from '@/lib/validations'
import { z } from 'zod'
import { generateInvoiceNumber, calculateInvoiceTotal } from '@/lib/utils'

// GET /api/invoices - Get all invoices for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status: status as any }),
        ...(clientId && { clientId }),
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    try {
      const validatedData = invoiceSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationError.errors },
          { status: 400 }
        )
      }
    }

    const validatedData = invoiceSchema.parse(body)

    // Get user's next invoice number
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { nextInvoiceNum: true, invoicePrefix: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate totals
    const { subtotal, taxAmount, total } = calculateInvoiceTotal(validatedData.items)

    // Create invoice with transaction
    const result = await prisma.$transaction(async (tx) => {
      const invoiceNumber = generateInvoiceNumber(user.invoicePrefix || 'INV', user.nextInvoiceNum)

      // Create invoice
      const invoice = await tx.invoice.create({
        data: {
          userId: session.user.id,
          clientId: validatedData.clientId,
          invoiceNumber,
          issueDate: validatedData.issueDate,
          dueDate: validatedData.dueDate,
          notes: validatedData.notes,
          subtotal,
          taxRate: validatedData.taxRate,
          taxAmount,
          total,
          status: 'DRAFT',
        },
      })

      // Create invoice items
      const items = await tx.invoiceItem.createMany({
        data: validatedData.items.map((item) => ({
          invoiceId: invoice.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        })),
      })

      // Update user's next invoice number
      await tx.user.update({
        where: { id: session.user.id },
        data: { nextInvoiceNum: user.nextInvoiceNum + 1 }
      })

      return invoice
    })

    // Fetch the complete invoice with relations
    const completeInvoice = await prisma.invoice.findUnique({
      where: { id: result.id },
      include: {
        client: true,
        items: true,
      },
    })

    return NextResponse.json(completeInvoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}