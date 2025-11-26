import { ReactNode } from "react"
import { Header } from "./header"
import { BottomNav } from "./bottom-nav"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-3 sm:p-4 md:p-6 lg:p-8 pb-20 md:pb-6 overflow-x-hidden">
        {children}
      </main>
      {/* Bottom Navigation - Only visible on mobile */}
      <BottomNav />
    </div>
  )
}