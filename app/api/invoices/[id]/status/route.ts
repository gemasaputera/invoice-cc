import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const statusSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']),
})

// PATCH /api/invoices/[id]/status - Update invoice status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    try {
      const validatedData = statusSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationError.issues },
          { status: 400 }
        )
      }
    }

    const validatedData = statusSchema.parse(body)

    // Check if invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!existingInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Define allowed status transitions
    const allowedTransitions: Record<string, string[]> = {
      'DRAFT': ['SENT', 'CANCELLED'],
      'SENT': ['PAID', 'OVERDUE', 'CANCELLED'],
      'PAID': [], // Paid invoices cannot be changed
      'OVERDUE': ['PAID', 'CANCELLED'],
      'CANCELLED': ['DRAFT'], // Allow reactivating cancelled invoices as drafts
    }

    const currentStatus = existingInvoice.status
    const requestedStatus = validatedData.status

    // Check if the transition is allowed
    if (!allowedTransitions[currentStatus]?.includes(requestedStatus)) {
      const allowedStatuses = allowedTransitions[currentStatus] || []
      return NextResponse.json(
        {
          error: `Cannot change invoice status from ${currentStatus} to ${requestedStatus}`,
          allowedTransitions: allowedStatuses.length > 0 ? allowedStatuses : ['No changes allowed']
        },
        { status: 400 }
      )
    }

    // Update invoice status
    const updatedInvoice = await prisma.invoice.update({
      where: { id: id },
      data: {
        status: requestedStatus,
        updatedAt: new Date(),
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
    })

    return NextResponse.json({
      message: `Invoice status updated to ${requestedStatus}`,
      invoice: updatedInvoice
    })
  } catch (error) {
    console.error('Error updating invoice status:', error)
    return NextResponse.json(
      { error: 'Failed to update invoice status' },
      { status: 500 }
    )
  }
}