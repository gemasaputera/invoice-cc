import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

const DEFAULT_TEMPLATES = [
  {
    name: 'Modern',
    description: 'Clean and contemporary design with minimal layout',
    category: 'modern' as const,
    isDefault: true,
    isSystem: true,
    previewUrl: '/templates/modern-preview.png',
    styles: {
      colors: {
        primary: '#1f2937',
        secondary: '#6b7280',
        accent: '#3b82f6',
        background: '#ffffff',
        text: '#111827',
        border: '#e5e7eb'
      },
      fonts: {
        heading: 'Helvetica-Bold',
        body: 'Helvetica',
        mono: 'Courier'
      },
      layout: {
        headerAlignment: 'left',
        logoPosition: 'left',
        tableStyle: 'modern',
        footerStyle: 'minimal'
      }
    },
    sampleData: {
      notes: 'Thank you for your business. Payment due within 30 days.',
      taxRate: 10,
      items: [
        {
          description: 'Web Design & Development',
          quantity: 1,
          unitPrice: 2500
        },
        {
          description: 'UI/UX Design Services',
          quantity: 20,
          unitPrice: 150
        },
        {
          description: 'Content Management System Setup',
          quantity: 1,
          unitPrice: 800
        }
      ]
    }
  },
  {
    name: 'Professional',
    description: 'Traditional business invoice with classic styling',
    category: 'professional' as const,
    isDefault: false,
    isSystem: true,
    previewUrl: '/templates/professional-preview.png',
    styles: {
      colors: {
        primary: '#111827',
        secondary: '#4b5563',
        accent: '#1f2937',
        background: '#ffffff',
        text: '#000000',
        border: '#d1d5db'
      },
      fonts: {
        heading: 'Times-Bold',
        body: 'Times-Roman',
        mono: 'Courier'
      },
      layout: {
        headerAlignment: 'center',
        logoPosition: 'left',
        tableStyle: 'classic',
        footerStyle: 'traditional'
      }
    },
    sampleData: {
      notes: 'Payment terms: Net 30. Late payments subject to 1.5% monthly fee.',
      taxRate: 8,
      items: [
        {
          description: 'Business Consulting Services',
          quantity: 1,
          unitPrice: 5000
        },
        {
          description: 'Financial Analysis & Reporting',
          quantity: 1,
          unitPrice: 2500
        },
        {
          description: 'Strategic Planning Session',
          quantity: 2,
          unitPrice: 750
        }
      ]
    }
  },
  {
    name: 'Minimalist',
    description: 'Simple and clean design focusing on content',
    category: 'minimalist' as const,
    isDefault: false,
    isSystem: true,
    previewUrl: '/templates/minimalist-preview.png',
    styles: {
      colors: {
        primary: '#000000',
        secondary: '#666666',
        accent: '#333333',
        background: '#ffffff',
        text: '#000000',
        border: '#f0f0f0'
      },
      fonts: {
        heading: 'Helvetica-Bold',
        body: 'Helvetica',
        mono: 'Courier'
      },
      layout: {
        headerAlignment: 'left',
        logoPosition: 'left',
        tableStyle: 'minimal',
        footerStyle: 'none'
      }
    },
    sampleData: {
      notes: 'Simple invoice for completed work. Thank you for your business.',
      taxRate: 0,
      items: [
        {
          description: 'Content Writing Services',
          quantity: 1,
          unitPrice: 1200
        },
        {
          description: 'Blog Post Package (5 posts)',
          quantity: 1,
          unitPrice: 800
        },
        {
          description: 'SEO Optimization',
          quantity: 1,
          unitPrice: 600
        }
      ]
    }
  },
  {
    name: 'Creative',
    description: 'Stylish design with modern elements and colors',
    category: 'creative' as const,
    isDefault: false,
    isSystem: true,
    previewUrl: '/templates/creative-preview.png',
    styles: {
      colors: {
        primary: '#7c3aed',
        secondary: '#a78bfa',
        accent: '#8b5cf6',
        background: '#ffffff',
        text: '#1f2937',
        border: '#e9d5ff'
      },
      fonts: {
        heading: 'Helvetica-Bold',
        body: 'Helvetica',
        mono: 'Courier'
      },
      layout: {
        headerAlignment: 'center',
        logoPosition: 'center',
        tableStyle: 'modern',
        footerStyle: 'styled'
      }
    },
    sampleData: {
      notes: 'Creative services provided. Custom designs and brand development included.',
      taxRate: 15,
      items: [
        {
          description: 'Brand Identity Design Package',
          quantity: 1,
          unitPrice: 3500
        },
        {
          description: 'Social Media Design Set (10 posts)',
          quantity: 1,
          unitPrice: 1200
        },
        {
          description: 'Marketing Collateral Design',
          quantity: 1,
          unitPrice: 1800
        }
      ]
    }
  }
]

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if templates already exist
    const existingTemplates = await prisma.invoiceTemplate.count()
    if (existingTemplates > 0) {
      return NextResponse.json({ message: 'Templates already seeded' })
    }

    // Seed default templates
    const templates = await prisma.invoiceTemplate.createMany({
      data: DEFAULT_TEMPLATES,
      skipDuplicates: true,
    })

    return NextResponse.json({
      message: 'Default templates seeded successfully',
      count: templates.count
    })
  } catch (error) {
    console.error('Template seeding error:', error)
    return NextResponse.json(
      { error: 'Failed to seed templates' },
      { status: 500 }
    )
  }
}