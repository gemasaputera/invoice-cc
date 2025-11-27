import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Templates are system-wide, so we don't require authentication for GET
    // This allows the template selection modal to work even before login
    // const session = await auth.api.getSession({
    //   headers: request.headers,
    // })

    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // For now, return all system templates
    // In the future, we could add user-specific templates
    const templates = await prisma.invoiceTemplate.findMany({
      where: {
        isSystem: true,
      },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' }
      ],
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

    return NextResponse.json({
      templates,
      count: templates.length
    })
  } catch (error) {
    console.error('Template fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, category, previewUrl, styles } = body

    if (!name || !styles) {
      return NextResponse.json(
        { error: 'Name and styles are required' },
        { status: 400 }
      )
    }

    // Create a user-specific template
    const template = await prisma.invoiceTemplate.create({
      data: {
        name,
        description: description || null,
        category: category || 'custom',
        previewUrl: previewUrl || null,
        isDefault: false,
        isSystem: false, // User-created template
        styles,
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

    return NextResponse.json({
      template,
      message: 'Template created successfully'
    })
  } catch (error) {
    console.error('Template creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}