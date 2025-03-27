import type React from "react"
import { Suspense } from "react"
import { getCurrentUser } from "../utils/getCurrentUserByCookies"
import AdminHeader from "../components/AdminHeader"
import AdminMenu from "@/admin/components/AdminMenu"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

interface AdminAppContainerProps {
  children: React.ReactNode
  params: { routes?: string[] }
  searchParams: any
}

export const AdminAppContainer: React.FC<AdminAppContainerProps> = async ({ children, params, searchParams }) => {
  const user = await getCurrentUser()

  if (user?.role === "admin") {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        {/* <AdminHeader /> */}
        <div className="flex flex-1 overflow-hidden">
          <SidebarProvider>
            <Suspense fallback={<div className="p-4">Loading menu...</div>}>
              <AdminMenu params={params} searchParams={searchParams} />
            </Suspense>
            <SidebarInset className="flex flex-col bg-[#f9fafb]">
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center p-4 text-center">
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Access Denied</h2>
        <p>Sorry, you do not have permissions to access this page.</p>
      </div>
    </div>
  )
}

