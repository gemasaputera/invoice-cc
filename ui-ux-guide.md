# UI/UX Component Structure Guide

## Design System Overview

This guide outlines the UI/UX component structure for the Invoice Management System, leveraging shadcn/ui components with Tailwind CSS for a modern, accessible, and responsive design.

## Design Principles

### 1. Mobile-First Design
- All components responsive from 320px to 1920px+
- Touch-friendly interactions (minimum 44px tap targets)
- Progressive enhancement for larger screens

### 2. Accessibility First
- WCAG 2.1 AA compliance
- Semantic HTML structure
- Keyboard navigation support
- Screen reader optimization

### 3. Consistent Visual Language
- Cohesive color palette
- Consistent spacing system
- Standardized typography scale
- Unified component behaviors

## Color Palette

### Primary Colors
```css
:root {
  /* Brand Colors */
  --primary: 222.2 84% 4.9%;           /* Slate-900 */
  --primary-foreground: 210 40% 98%;   /* White */

  /* Secondary Colors */
  --secondary: 210 40% 96%;           /* Slate-100 */
  --secondary-foreground: 222.2 84% 4.9%; /* Slate-900 */

  /* Accent Colors */
  --accent: 210 40% 96%;              /* Slate-100 */
  --accent-foreground: 222.2 84% 4.9%;  /* Slate-900 */

  /* Success/Error States */
  --destructive: 0 84.2% 60.2%;      /* Red */
  --destructive-foreground: 210 40% 98%; /* White */

  /* Muted Colors */
  --muted: 210 40% 96%;              /* Slate-100 */
  --muted-foreground: 215.4 16.3% 46.9%; /* Slate-500 */
}
```

### Status Colors
```css
:root {
  /* Invoice Status Colors */
  --status-draft: 210 40% 96%;       /* Light Gray */
  --status-sent: 199 89% 48%;        /* Blue */
  --status-paid: 142 76% 36%;        /* Green */
  --status-overdue: 0 84.2% 60.2%;   /* Red */
  --status-cancelled: 215.4 16.3% 46.9%; /* Gray */
}
```

## Typography Scale

### Font Families
```css
:root {
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### Type Scale
```css
:root {
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
}
```

## Spacing System

### Scale
```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
}
```

## Component Structure

### 1. Layout Components

#### Main App Layout
```typescript
// components/layout/app-layout.tsx
interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
```

#### Header Component
```typescript
// components/layout/header.tsx
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Bell, Menu } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search invoices..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>

          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

#### Sidebar Navigation
```typescript
// components/layout/sidebar.tsx
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Plus,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">InvoiceHub</span>
          </Link>
          <Button variant="outline" size="sm" className="ml-auto h-8 w-8 lg:hidden">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Invoice</span>
          </Button>
        </div>

        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                    isActive ? 'bg-muted text-primary' : ''
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
```

### 2. Invoice Components

#### Invoice Card Component
```typescript
// components/invoices/invoice-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal,
  Download,
  Send,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface InvoiceCardProps {
  invoice: {
    id: string
    invoiceNumber: string
    clientName: string
    status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
    total: number
    issueDate: Date
    dueDate?: Date
  }
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onDownload?: (id: string) => void
  onSend?: (id: string) => void
}

export function InvoiceCard({
  invoice,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onSend
}: InvoiceCardProps) {
  const statusColors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SENT: 'bg-blue-100 text-blue-800',
    PAID: 'bg-green-100 text-green-800',
    OVERDUE: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-600'
  }

  const isOverdue = invoice.dueDate && new Date() > invoice.dueDate && invoice.status !== 'PAID'

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          #{invoice.invoiceNumber}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge
            variant="secondary"
            className={cn(
              statusColors[invoice.status],
              isOverdue && "animate-pulse"
            )}
          >
            {invoice.status}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(invoice.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(invoice.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload?.(invoice.id)}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSend?.(invoice.id)}>
                <Send className="mr-2 h-4 w-4" />
                Send
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(invoice.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {formatCurrency(invoice.total)}
          </div>

          <div className="text-xs text-muted-foreground">
            <p>{invoice.clientName}</p>
            <p>Issued: {invoice.issueDate.toLocaleDateString()}</p>
            {invoice.dueDate && (
              <p className={isOverdue ? 'text-red-600 font-medium' : ''}>
                Due: {invoice.dueDate.toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onDownload?.(invoice.id)}
            >
              <Download className="mr-2 h-3 w-3" />
              PDF
            </Button>
            {invoice.status === 'DRAFT' && (
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onSend?.(invoice.id)}
              >
                <Send className="mr-2 h-3 w-3" />
                Send
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

#### Invoice List Component
```typescript
// components/invoices/invoice-list.tsx
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, Download, MoreHorizontal } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface InvoiceListProps {
  invoices: Array<{
    id: string
    invoiceNumber: string
    clientName: string
    status: string
    total: number
    issueDate: Date
    dueDate?: Date
  }>
  onInvoiceSelect?: (id: string) => void
}

export function InvoiceList({ invoices, onInvoiceSelect }: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Invoices</CardTitle>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onInvoiceSelect?.(invoice.id)}
                >
                  <TableCell className="font-medium">
                    #{invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {invoice.issueDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(invoice.total)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium">No invoices found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first invoice"
                }
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

### 3. Form Components

#### Invoice Form Layout
```typescript
// components/forms/invoice-form-layout.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface InvoiceFormLayoutProps {
  clientSection: React.ReactNode
  itemsSection: React.ReactNode
  summarySection: React.ReactNode
  actionsSection: React.ReactNode
}

export function InvoiceFormLayout({
  clientSection,
  itemsSection,
  summarySection,
  actionsSection
}: InvoiceFormLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          {clientSection}
        </CardContent>
      </Card>

      {/* Invoice Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoice Items</CardTitle>
        </CardHeader>
        <CardContent>
          {itemsSection}
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            {summarySection}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {actionsSection}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### 4. Client Components

#### Client Select Component
```typescript
// components/clients/client-select.tsx
import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Client {
  id: string
  name: string
  email?: string
  company?: string
}

interface ClientSelectProps {
  value?: string
  onValueChange: (value: string) => void
  onClientCreate?: (client: Omit<Client, 'id'>) => void
}

export function ClientSelect({ value, onValueChange, onClientCreate }: ClientSelectProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', email: '', company: '' })

  useEffect(() => {
    // Fetch clients from API
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    }
  }

  const handleCreateClient = async () => {
    if (!newClient.name.trim()) return

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      })

      if (response.ok) {
        const createdClient = await response.json()
        setClients([...clients, createdClient])
        onValueChange(createdClient.id)
        onClientCreate?.(createdClient)
        setNewClient({ name: '', email: '', company: '' })
        setIsCreateDialogOpen(false)
      }
    } catch (error) {
      console.error('Failed to create client:', error)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="client">Client</Label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
                {client.company && (
                  <span className="text-muted-foreground ml-2">
                    ({client.company})
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client-name">Name *</Label>
                <Input
                  id="client-name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Client name"
                />
              </div>
              <div>
                <Label htmlFor="client-email">Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="client-company">Company</Label>
                <Input
                  id="client-company"
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  placeholder="Company name"
                />
              </div>
              <Button onClick={handleCreateClient} className="w-full">
                Add Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
```

### 5. Dashboard Components

#### Stats Cards Component
```typescript
// components/dashboard/stats-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, FileText, Users, Clock } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    trend: 'up' | 'down'
  }
  icon: React.ReactNode
}

function StatsCard({ title, value, change, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center">
            {change.trend === 'up' ? (
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
            )}
            {Math.abs(change.value)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface DashboardStats {
  totalRevenue: number
  totalInvoices: number
  totalClients: number
  outstandingAmount: number
  revenueChange: number
  invoiceChange: number
}

export function StatsCards() {
  // Mock data - replace with actual API calls
  const stats: DashboardStats = {
    totalRevenue: 45231.89,
    totalInvoices: 124,
    totalClients: 47,
    outstandingAmount: 12420.50,
    revenueChange: 20.1,
    invoiceChange: 15.3,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        change={{ value: stats.revenueChange, trend: 'up' }}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Invoices"
        value={stats.totalInvoices}
        change={{ value: stats.invoiceChange, trend: 'up' }}
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Active Clients"
        value={stats.totalClients}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Outstanding"
        value={formatCurrency(stats.outstandingAmount)}
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}
```

## Responsive Design Patterns

### Mobile Layout (< 768px)
```css
/* Mobile-first approach */
.invoice-grid {
  @apply grid gap-4;
}

@media (min-width: 768px) {
  .invoice-grid {
    @apply md:grid-cols-2;
  }
}

@media (min-width: 1024px) {
  .invoice-grid {
    @apply lg:grid-cols-3;
  }
}
```

### Tablet Layout (768px - 1024px)
```typescript
// Tablet-specific components
export function TabletInvoiceList() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Two-column layout for tablets */}
    </div>
  )
}
```

### Desktop Layout (> 1024px)
```typescript
// Desktop-optimized components
export function DesktopDashboard() {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Four-column layout for desktop */}
    </div>
  )
}
```

## Animation Guidelines

### Micro-interactions
```typescript
// Smooth transitions
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Loading States
```typescript
// Loading skeleton components
export function InvoiceCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-muted rounded w-20"></div>
          <div className="h-6 bg-muted rounded w-16"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-24"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
          <div className="h-4 bg-muted rounded w-28"></div>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Accessibility Guidelines

### Keyboard Navigation
```typescript
// Custom hooks for keyboard navigation
export function useKeyboardNavigation(items: string[]) {
  const [focusedIndex, setFocusedIndex] = useState(0)

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setFocusedIndex((prev) => (prev + 1) % items.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length)
        break
      case 'Enter':
        event.preventDefault()
        // Handle selection
        break
    }
  }

  return { focusedIndex, handleKeyDown }
}
```

### Screen Reader Support
```typescript
// ARIA labels and announcements
export function InvoiceStatusBadge({ status }: { status: string }) {
  const statusDescriptions = {
    DRAFT: 'Draft invoice, not yet sent',
    SENT: 'Invoice sent to client, awaiting payment',
    PAID: 'Invoice paid in full',
    OVERDUE: 'Payment overdue',
    CANCELLED: 'Invoice cancelled'
  }

  return (
    <Badge
      variant="secondary"
      aria-label={`Invoice status: ${statusDescriptions[status as keyof typeof statusDescriptions]}`}
    >
      {status}
    </Badge>
  )
}
```

## Error Handling UI

### Error Boundaries
```typescript
// Error boundary component
export function ErrorBoundary({
  children,
  fallback
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            {fallback || "An unexpected error occurred. Please try again."}
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

This UI/UX guide provides a comprehensive framework for building a modern, accessible, and user-friendly invoice management application using shadcn/ui components and Tailwind CSS.