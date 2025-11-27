import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params

    const template = await prisma.invoiceTemplate.findUnique({
      where: {
        id: templateId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        previewUrl: true,
        isDefault: true,
        styles: true,
        sampleData: true,
        createdAt: true,
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error('Template fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}