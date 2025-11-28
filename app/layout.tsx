import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import UmamiAnalytics from "@/components/analytics/umami-analytics";

export const metadata: Metadata = {
  title: "InvoiceHub - Invoice Management System",
  description: "A streamlined invoice management application for freelancers and influencers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <UmamiAnalytics />
        <Toaster />
      </body>
    </html>
  );
}
