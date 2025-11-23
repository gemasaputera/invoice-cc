"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ClientForm } from "@/components/forms/client-form"
import { clientSchema, type ClientFormData } from "@/lib/validations"
import { toast } from "sonner"

interface Client {
  id: string
  name: string
  email?: string
  company?: string
}

interface ClientSelectProps {
  value?: string
  onValueChange: (value: string) => void
  onClientCreate?: (client: Client) => void
  placeholder?: string
  disabled?: boolean
}

export function ClientSelect({
  value,
  onValueChange,
  onClientCreate,
  placeholder = "Select a client",
  disabled = false,
}: ClientSelectProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [creatingClient, setCreatingClient] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
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

  const handleCreateClient = async (data: ClientFormData) => {
    try {
      setCreatingClient(true)
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const newClient = await response.json()
        setClients((prev) => [...prev, newClient])
        onValueChange(newClient.id)
        onClientCreate?.(newClient)
        setIsCreateDialogOpen(false)
        toast.success("Client created successfully")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to create client")
      }
    } catch (error) {
      console.error("Error creating client:", error)
      toast.error("Failed to create client")
    } finally {
      setCreatingClient(false)
    }
  }

  const selectedClient = clients.find((client) => client.id === value)

  return (
    <div className="space-y-2">
      <Label htmlFor="client">Client</Label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onValueChange} disabled={disabled || loading}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={placeholder}>
              {selectedClient ? (
                <div className="flex items-center gap-2">
                  <span>{selectedClient.name}</span>
                  {selectedClient.company && (
                    <span className="text-muted-foreground">
                      ({selectedClient.company})
                    </span>
                  )}
                </div>
              ) : (
                placeholder
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                <div className="flex items-center gap-2">
                  <span>{client.name}</span>
                  {client.company && (
                    <span className="text-muted-foreground">
                      ({client.company})
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
            {clients.length === 0 && !loading && (
              <div className="px-2 py-1 text-sm text-muted-foreground">
                No clients available
              </div>
            )}
          </SelectContent>
        </Select>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" disabled={disabled}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add new client</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <ClientForm
              onSubmit={handleCreateClient}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={creatingClient}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}