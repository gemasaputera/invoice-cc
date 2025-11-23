"use client"

import { ReactNode } from "react"
import { authClient } from "@/lib/auth-client"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // better-auth doesn't require a provider wrapper
  // The authClient is already configured and ready to use
  return <>{children}</>
}