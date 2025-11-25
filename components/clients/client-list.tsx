"use client"

import { ClientList as ClientListMobile } from "./client-list-mobile"

interface ClientListProps {
  onClientSelect?: (client: any) => void
  onClientEdit?: (client: any) => void
  onClientDelete?: (client: any) => void
  onClientCreate?: () => void
}

export function ClientList(props: ClientListProps) {
  return <ClientListMobile {...props} />
}