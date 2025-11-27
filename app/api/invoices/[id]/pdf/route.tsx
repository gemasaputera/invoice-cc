import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { InvoicePDF } from '@/components/invoices/invoice-pdf'
import { ModernPDF } from '@/components/invoices/templates/modern-pdf'
import { ProfessionalPDF } from '@/components/invoices/templates/professional-pdf'
import { renderToBuffer } from '@react-pdf/renderer'

export async function GET(
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

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        client: true,
        user: true,
        items: true,
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Get template information if templateId exists
    let template = null
    if (invoice.templateId) {
      template = await prisma.invoiceTemplate.findUnique({
        where: { id: invoice.templateId },
        select: { name: true, category: true, styles: true }
      })
    }

    // Transform Decimal values to numbers for PDF generation
    const transformedInvoice = {
      ...invoice,
      subtotal: Number(invoice.subtotal),
      taxAmount: Number(invoice.taxAmount),
      total: Number(invoice.total),
      taxRate: Number(invoice.taxRate),
      issueDate: new Date(invoice.issueDate),
      dueDate: invoice.dueDate ? new Date(invoice.dueDate) : null,
      items: invoice.items.map(item => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
        quantity: Number(item.quantity),
      })),
    }

    // Choose and create PDF component based on template
    let PDFComponent
    if (!template) {
      // Default template (original InvoicePDF)
      PDFComponent = InvoicePDF
    } else {
      switch (template.name?.toLowerCase()) {
        case 'modern':
          PDFComponent = ModernPDF
          break
        case 'professional':
          PDFComponent = ProfessionalPDF
          break
        default:
          // Fallback to modern for any other template
          PDFComponent = ModernPDF
          break
      }
    }

    const pdfBuffer = await renderToBuffer(
      <PDFComponent
        invoice={transformedInvoice}
        client={invoice.client}
        user={invoice.user}
        items={transformedInvoice.items}
      />
    )

    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}