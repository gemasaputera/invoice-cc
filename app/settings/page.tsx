"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { UserSettingsForm } from "@/components/forms/user-settings-form"

export default function SettingsPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          </div>

          <div className="max-w-4xl">
            <UserSettingsForm />
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}