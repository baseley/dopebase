import React, { Suspense } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { getCurrentUser } from "../utils/getCurrentUserByCookies";
import AdminMenu from "@/admin/components/AdminMenu";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { theme } from "@/lib/theme";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { ReactNode } from "react";

interface AdminAppContainerProps {
  children: ReactNode;
  params?: { routes?: string[] };
  searchParams: any;
}

export const AdminAppContainer: React.FC<AdminAppContainerProps> = async ({ children, params = {}, searchParams }) => {
  const user = await getCurrentUser();
  // Ensure routes is always an array
  const generateBreadcrumbs = (routes?: string[]) => {
    if (!Array.isArray(routes) || routes.length === 0) {
      return [{ label: "Dashboard", href: "/admin" }];
    }

    const breadcrumbs = [{ label: "Dashboard", href: "/admin" }];
    let path = "/admin";

    routes.forEach((route) => {
      path += `/${route}`;
      const label = route
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({ label, href: path });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs(params?.routes || []);

  if (user?.role === "admin") {
    return (
      <div
        className="flex min-h-screen flex-col"
        style={{
          backgroundColor: theme.colors.background,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div className="flex flex-1 overflow-hidden">
          <SidebarProvider defaultOpen={true}>
            <Suspense fallback={<div className="p-4" style={{ color: theme.colors.text.primary }}>Loading menu...</div>}>
              <AdminMenu params={params} searchParams={searchParams} />
            </Suspense>
            <SidebarInset className="flex flex-col p-6" style={{ backgroundColor: theme.colors.background }}>
              <div className="flex flex-col flex-1 rounded-xl border overflow-hidden" style={{ borderColor: theme.colors.border.light, backgroundColor: theme.colors.surface.secondary }}>
                <div className="flex items-center px-6 py-4 border-b" style={{ borderColor: theme.colors.border.light }}>
                  <Link href="/" className="flex items-center justify-center w-8 h-8 rounded-md mr-3 transition-colors" style={{ backgroundColor: theme.colors.state.hover, color: theme.colors.text.primary }}>
                    <Home size={18} />
                  </Link>

                  <Breadcrumb>
                    <BreadcrumbList>
                      {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.href}>
                          <BreadcrumbItem>
                            {index === breadcrumbs.length - 1 ? (
                              <span className="font-medium" style={{ color: theme.colors.text.primary }}>
                                {crumb.label}
                              </span>
                            ) : (
                              <BreadcrumbLink href={crumb.href} style={{ color: theme.colors.text.secondary }}>
                                {crumb.label}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {index < breadcrumbs.length - 1 && (
                            <BreadcrumbSeparator>
                              <ChevronRight size={16} />
                            </BreadcrumbSeparator>
                          )}
                        </React.Fragment>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                <div className="flex-1 overflow-y-auto p-6">{children}</div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center p-4 text-center" style={{ backgroundColor: theme.colors.background, color: theme.colors.text.primary }}>
      <div className="rounded-lg border p-8 shadow-sm" style={{ backgroundColor: theme.colors.surface.secondary, borderColor: theme.colors.border.light }}>
        <h2 className="mb-4 text-xl font-semibold">Access Denied</h2>
        <p>Sorry, you do not have permissions to access this page.</p>
      </div>
    </div>
  );
};
