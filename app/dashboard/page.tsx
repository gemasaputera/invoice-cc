import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Users } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentInvoices } from "@/components/dashboard/recent-invoices"
import { AuthGuard } from "@/components/auth/auth-guard"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-6 pt-6">
        {/* Mobile-optimized header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground sm:hidden">Welcome back!</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild className="flex-1 sm:flex-none">
              <Link href="/invoices/new">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">New Invoice</span>
                <span className="sm:hidden">New</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile-optimized stats cards */}
        <StatsCards />

        {/* Mobile-first layout for main content */}
        <div className="space-y-6 lg:space-y-6">
          {/* Recent Invoices - Full width on mobile, takes priority */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg sm:text-xl">Recent Invoices</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/invoices">
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <RecentInvoices />
            </CardContent>
          </Card>

          {/* Quick Actions - Stacked on mobile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/invoices/new">
                    <Plus className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">Create New Invoice</span>
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/clients/new">
                    <Users className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">Add New Client</span>
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/invoices">
                    <FileText className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">View All Invoices</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
    </AuthGuard>
  )
}