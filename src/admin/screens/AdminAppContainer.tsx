import type React from "react"
import { Suspense } from "react"
import { getCurrentUser } from "../utils/getCurrentUserByCookies"
import AdminMenu from "@/admin/components/AdminMenu"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { theme } from "@/lib/theme"

interface AdminAppContainerProps {
  children: React.ReactNode
  params: { routes?: string[] }
  searchParams: any
}

export const AdminAppContainer: React.FC<AdminAppContainerProps> = async ({ children, params, searchParams }) => {
  const user = await getCurrentUser()

  if (user?.role === "admin") {
    return (
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: theme.colors.background }}>
        <div className="flex flex-1 overflow-hidden">
          <SidebarProvider defaultOpen={true}>
            <Suspense
              fallback={
                <div className="p-4" style={{ color: theme.colors.text.primary }}>
                  Loading menu...
                </div>
              }
            >
              <AdminMenu params={params} searchParams={searchParams} />
            </Suspense>
            <SidebarInset className="flex flex-col" style={{ backgroundColor: theme.colors.surface.secondary }}>
              <header
                className="flex h-16 items-center px-6 border-b"
                style={{
                  borderColor: theme.colors.border.light,
                  backgroundColor: theme.colors.surface.secondary,
                }}
              >
                <SidebarTrigger className="mr-4" />
                <div className="flex items-center justify-between w-full">
                  <h1 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                    {/* Page title will be dynamically set */}
                    Admin Dashboard
                  </h1>
                  <div className="flex items-center gap-4">{/* Add any header actions or user info here */}</div>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto p-6" style={{ color: theme.colors.text.primary }}>
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex h-screen items-center justify-center p-4 text-center"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary,
      }}
    >
      <div
        className="rounded-lg border p-8 shadow-sm"
        style={{
          backgroundColor: theme.colors.surface.secondary,
          borderColor: theme.colors.border.light,
        }}
      >
        <h2 className="mb-4 text-xl font-semibold">Access Denied</h2>
        <p>Sorry, you do not have permissions to access this page.</p>
      </div>
    </div>
  )
}

