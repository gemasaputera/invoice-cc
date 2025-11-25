import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { ArrowLeft, Mail, Phone, Building, MapPin, FileText } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ClientInvoiceList } from '@/components/clients/client-invoice-list'
import { AppLayout } from '@/components/layout/app-layout'
import { AuthGuard } from '@/components/auth/auth-guard'
import { formatDate } from '@/lib/utils'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return notFound()
  }

  const client = await prisma.client.findFirst({
    where: {
      id: id,
      userId: session.user.id
    },
    include: {
      _count: {
        select: {
          invoices: true,
        },
      },
    },
  })

  if (!client) {
    return notFound()
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link href="/clients">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Clients
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{client.name}</h1>
                <p className="text-muted-foreground">Client Details</p>
              </div>
            </div>
            <Badge variant="secondary" className="w-full sm:w-auto justify-center">
              {client._count?.invoices || 0} Invoices
            </Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Client Information */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {client.company && (
                      <div className="flex items-start gap-3">
                        <Building className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium">Company</p>
                          <p className="text-sm text-muted-foreground break-words">{client.company}</p>
                        </div>
                      </div>
                    )}

                    {client.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-muted-foreground break-all">{client.email}</p>
                        </div>
                      </div>
                    )}

                    {client.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground break-words">{client.phone}</p>
                        </div>
                      </div>
                    )}

                    {client.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium">Address</p>
                          <p className="text-sm text-muted-foreground break-words">{client.address}</p>
                        </div>
                      </div>
                    )}

                    {client.notes && (
                      <div>
                        <p className="font-medium mb-2">Notes</p>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md break-words">
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
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <CardTitle className="text-lg">Client Invoices</CardTitle>
                  </div>
                  <Link href={`/invoices/new?clientId=${id}`}>
                    <Button size="sm" className="w-full sm:w-auto">
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
      </AppLayout>
    </AuthGuard>
  )
}