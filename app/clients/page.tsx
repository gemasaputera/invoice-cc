"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ClientList } from "@/components/clients/client-list"
import { ClientForm } from "@/components/forms/client-form"
import { ClientFormData } from "@/lib/validations"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

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

export default function ClientsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleClientCreate = () => {
    setIsCreateDialogOpen(true)
  }

  const handleClientEdit = (client: Client) => {
    setSelectedClient(client)
    setIsEditDialogOpen(true)
  }

  const handleClientDelete = async (client: Client) => {
    if (!confirm(`Are you sure you want to delete ${client.name}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Client deleted successfully")
        setRefreshKey((prev) => prev + 1) // Trigger refresh
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to delete client")
      }
    } catch (error) {
      console.error("Error deleting client:", error)
      toast.error("Failed to delete client")
    }
  }

  const handleClientSubmit = async (data: ClientFormData, isEdit = false) => {
    try {
      const url = isEdit ? `/api/clients/${selectedClient?.id}` : "/api/clients"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(`Client ${isEdit ? "updated" : "created"} successfully`)
        setIsCreateDialogOpen(false)
        setIsEditDialogOpen(false)
        setSelectedClient(null)
        setRefreshKey((prev) => prev + 1) // Trigger refresh
      } else {
        const error = await response.json()
        toast.error(error.error || `Failed to ${isEdit ? "update" : "create"} client`)
      }
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "creating"} client:`, error)
      toast.error(`Failed to ${isEdit ? "update" : "create"} client`)
    }
  }

  const handleClientSelect = (client: Client) => {
    // For now, just show a message. In the future, this could navigate to client details
    toast.info(`Selected client: ${client.name}`)
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
          </div>

          <ClientList
            key={refreshKey} // Force re-render when refreshKey changes
            onClientCreate={handleClientCreate}
            onClientEdit={handleClientEdit}
            onClientDelete={handleClientDelete}
            onClientSelect={handleClientSelect}
          />

          {/* Create Client Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
              </DialogHeader>
              <ClientForm
                onSubmit={(data) => handleClientSubmit(data, false)}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Edit Client Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Client</DialogTitle>
              </DialogHeader>
              {selectedClient && (
                <ClientForm
                  initialData={selectedClient}
                  onSubmit={(data) => handleClientSubmit(data, true)}
                  onCancel={() => {
                    setIsEditDialogOpen(false)
                    setSelectedClient(null)
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}