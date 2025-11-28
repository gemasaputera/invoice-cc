"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Building, Mail, Phone, MapPin } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"
import Link from "next/link"




const trackEvent = (event: string, data?: any) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami(event, data)
  }
}

interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
  notes?: string
  createdAt: string
  _count: {
    invoices: number
  }
}

interface ClientListProps {
  onClientSelect?: (client: Client) => void
  onClientEdit?: (client: Client) => void
  onClientDelete?: (client: Client) => void
  onClientCreate?: () => void
}

export function ClientList({
  onClientSelect,
  onClientEdit,
  onClientDelete,
  onClientCreate,
}: ClientListProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      } else {
        console.error("Failed to fetch clients")
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (client: Client) => {
    if (!window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      return
    }

    try {
      // Track client delete attempt
      trackEvent("client-delete-attempt", {
        clientName: client.name,
        clientEmail: client.email,
        hasInvoices: client._count?.invoices > 0,
        timestamp: new Date().toISOString()
      });

      const response = await fetch(`/api/clients/${client.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setClients(clients.filter((c) => c.id !== client.id))
        onClientDelete?.(client)

        // Track successful client delete
        trackEvent("client-delete-success", {
          clientName: client.name,
          clientEmail: client.email,
          hadInvoices: client._count?.invoices > 0,
          timestamp: new Date().toISOString()
        });
      } else {
        console.error("Failed to delete client")

        // Track client delete failure
        trackEvent("client-delete-failed", {
          clientName: client.name,
          error: "API error",
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error deleting client:", error)

      // Track client delete error
      trackEvent("client-delete-error", {
        clientName: client.name,
        error: error ? JSON.stringify(error) : "Unknown error",
        timestamp: new Date().toISOString()
      });
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg sm:text-xl">Clients</CardTitle>
          <Button onClick={onClientCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Client</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {searchTerm ? (
                <>
                  <p>No clients found</p>
                  <Button variant="link" onClick={() => setSearchTerm("")}>
                    Clear search
                  </Button>
                </>
              ) : (
                <>
                  <p>No clients yet</p>
                  <p className="text-sm">Add your first client to get started</p>
                  <Button className="mt-4" onClick={onClientCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Cards Layout */}
            <div className="space-y-3 sm:hidden">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-base truncate">{client.name}</span>
                      {client.company && (
                        <Badge variant="outline" className="flex-shrink-0">
                          <Building className="h-3 w-3 mr-1" />
                          {client.company}
                        </Badge>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant="secondary">
                        {client._count.invoices} invoice{client._count.invoices !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{client.phone}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{client.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/clients/${client.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onClientEdit?.(client)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/clients/${client.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onClientEdit?.(client)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(client)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Invoices</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow
                      key={client.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onClientSelect?.(client)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div>{client.name}</div>
                          {client.address && (
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {client.address}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {client.email && (
                            <div className="text-sm truncate">{client.email}</div>
                          )}
                          {client.phone && (
                            <div className="text-sm text-muted-foreground truncate">
                              {client.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.company ? (
                          <Badge variant="outline">{client.company}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{client._count.invoices}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(client.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/clients/${client.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onClientEdit?.(client)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(client)
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}