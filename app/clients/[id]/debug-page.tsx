import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Building, MapPin, FileText } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ClientInvoiceList } from '@/components/clients/client-invoice-list'
import { formatDate } from '@/lib/utils'
import { prisma } from '@/lib/db'

export default async function DebugClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log('Debug page rendering for client ID:', id)

  // Try to fetch client without auth check for debugging
  let client = null
  try {
    client = await prisma.client.findFirst({
      where: { id: id },
      include: {
        _count: {
          select: {
            invoices: true,
          },
        },
      },
    })
    console.log('Client found without auth:', client ? 'yes' : 'no')
  } catch (error) {
    console.error('Error in debug client fetch:', error)
  }

  if (!client) {
    console.log('Returning 404 in debug page for client ID:', id)
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Client Not Found</h1>
          <p className="text-muted-foreground mb-4">
            Client with ID "{id}" was not found.
          </p>
          <Link href="/clients">
            <Button>Back to Clients</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      {/* Debug Info */}
      <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-md">
        <h3 className="font-bold text-yellow-800">Debug Information</h3>
        <p className="text-yellow-700">Client ID: {id}</p>
        <p className="text-yellow-700">Client Name: {client.name}</p>
        <p className="text-yellow-700">User ID: {client.userId}</p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/clients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground">Client Details (Debug Mode)</p>
          </div>
        </div>
        <Badge variant="secondary">
          {client._count?.invoices || 0} Invoices
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Client Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {client.company && (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Company</p>
                      <p className="text-sm text-muted-foreground">{client.company}</p>
                    </div>
                  </div>
                )}

                {client.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                )}

                {client.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{client.phone}</p>
                    </div>
                  </div>
                )}

                {client.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{client.address}</p>
                    </div>
                  </div>
                )}

                {client.notes && (
                  <div>
                    <p className="font-medium mb-2">Notes</p>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {client.notes}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <p className="font-medium mb-1">Client Since</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(client.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle>Client Invoices</CardTitle>
              </div>
              <Link href={`/invoices/new?clientId=${id}`}>
                <Button size="sm">
                  Create Invoice
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <ClientInvoiceList clientId={id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}