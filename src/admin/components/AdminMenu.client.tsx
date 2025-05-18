"use client"
import Link from "next/link"
import { useState } from "react"
import { BarChart3, Settings, UserCircle, LogOut, ChevronDown, ChevronRight, Palette, Package } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { theme } from "@/lib/theme"

const iconMap = {
  "bar-chart-o": BarChart3,
  gear: Settings,
  "user-circle": UserCircle,
  "sign-out": LogOut,
}

const submenuIconMap = {
  settings: Settings,
  themes: Palette,
  plugins: Package,
}

interface MenuItem {
  title: string
  path: string
  icon: string
  subItems?: SubItem[]
}

interface SubItem {
  title: string
  path: string
  isActive?: boolean
}

interface AdminMenuClientProps {
  menuItems: MenuItem[]
  urlPath?: string
  slug: string
}

export default function AdminMenuClient({ menuItems, urlPath = "admin", slug }: AdminMenuClientProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>({})

  // Initialize expanded state
  const mainMenuItems = menuItems.filter((item) => !["My Account", "Logout"].includes(item.title))
  const footerMenuItems = menuItems.filter((item) => ["My Account", "Logout"].includes(item.title))

  // Calculate selected index and expanded menus
  const calculateMenuStates = () => {
    let selectedIdx = 0
    let selectedSubIdx = -1
    const expanded: Record<number, boolean> = {}

    mainMenuItems.forEach((menuItem, index) => {
      const path = menuItem.path.replace("plugins/", "")
      expanded[index] = menuItem.subItems?.length ? true : false

      if (path === slug) {
        selectedIdx = index
      } else if (menuItem.subItems) {
        menuItem.subItems.forEach((subitem, subindex) => {
          if (`${path}/${subitem.path}` === slug) {
            selectedIdx = index
            selectedSubIdx = subindex
          }
        })
      }
    })

    return { selectedIdx, selectedSubIdx, expanded }
  }

  // Initialize states
  useState(() => {
    const { selectedIdx, selectedSubIdx, expanded } = calculateMenuStates()
    setSelectedIndex(selectedIdx)
    setExpandedMenus(expanded)
  })

  const onSelect = (index: number, subindex: number) => {
    setSelectedIndex(index)
    if (subindex === -1 && mainMenuItems[index]?.subItems?.length) {
      setExpandedMenus((prev) => ({ ...prev, [index]: !prev[index] }))
    }
  }

  const { colors, spacing, transitions, borderRadius, sidebar } = theme

  return (
    <Sidebar
      collapsible="none"
      className="border-r flex flex-col h-screen max-h-screen"
      style={{
        backgroundColor: colors.surface.primary,
        color: colors.text.primary,
        borderColor: colors.border.light,
        width: sidebar.width,
        minWidth: sidebar.width, // Add minWidth to prevent shrinking
        flexShrink: 0, // Prevent sidebar from shrinking
      }}
    >
      {/* Fixed Header */}
      <SidebarHeader
        className="border-b shrink-0"
        style={{
          borderColor: colors.border.light,
          padding: "24px 24px 24px 24px",
        }}
      >
        <div className="flex items-center gap-4 px-2">
          <img src="https://dopebase.com/assets/dopebase-logo.svg" alt="Dopebase Logo" className="h-8 w-8" />
          <span className="text-lg font-medium" style={{ color: colors.text.primary }}>
            Dopebase
          </span>
        </div>
      </SidebarHeader>

      {/* Scrollable Content */}
      <SidebarContent
        className="flex-1 overflow-y-auto"
        style={{
          padding: "24px 16px",
        }}
      >
        <SidebarMenu>
          {mainMenuItems.map((menuItem, index) => {
            const IconComponent = iconMap[menuItem.icon as keyof typeof iconMap] || Settings
            const hasSubItems = menuItem.subItems && menuItem.subItems.length > 0
            const isExpanded = expandedMenus[index] ?? false
            const isActive = index === selectedIndex

            return (
              <SidebarMenuItem key={`${menuItem.path}-${index}`} className="my-2.5">
                {!hasSubItems ? (
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="rounded-md"
                    style={{
                      padding: "12px 16px",
                      transition: transitions.normal,
                      borderRadius: borderRadius.md,
                      backgroundColor: isActive ? colors.state.selected : "transparent",
                      color: isActive ? colors.accent.primary : colors.text.primary,
                    }}
                  >
                    <Link
                      href={`/${urlPath}/${menuItem.path}`}
                      onClick={() => onSelect(index, -1)}
                      className="flex items-center w-full"
                    >
                      <IconComponent
                        className="mr-4 h-5 w-5"
                        style={{
                          color: isActive ? colors.accent.primary : colors.text.secondary,
                        }}
                      />
                      <span className="font-medium">{menuItem.title}</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <>
                    <SidebarMenuButton
                      onClick={() => onSelect(index, -1)}
                      isActive={isActive}
                      className="rounded-md w-full"
                      style={{
                        padding: "12px 16px",
                        transition: transitions.normal,
                        borderRadius: borderRadius.md,
                        backgroundColor: isActive ? colors.state.selected : "transparent",
                        color: isActive ? colors.accent.primary : colors.text.primary,
                      }}
                    >
                      <IconComponent
                        className="mr-4 h-5 w-5"
                        style={{
                          color: isActive ? colors.accent.primary : colors.text.secondary,
                        }}
                      />
                      <span className="font-medium">{menuItem.title}</span>
                      {isExpanded ? (
                        <ChevronDown className="ml-auto h-4 w-4" style={{ color: colors.text.secondary }} />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" style={{ color: colors.text.secondary }} />
                      )}
                    </SidebarMenuButton>

                    <SidebarMenuSub
                      className={cn(
                        "transition-all overflow-hidden ml-8 border-l",
                        isExpanded ? "max-h-96 py-2" : "max-h-0 py-0",
                      )}
                      style={{
                        transition: transitions.expand,
                        borderColor: isActive ? colors.accent.primary : colors.border.light,
                        opacity: isExpanded ? 1 : 0,
                      }}
                    >
                      {menuItem.subItems?.map((subitem, subindex) => {
                        const isSubActive = false // You may need to calculate this based on slug
                        return (
                          <SidebarMenuSubItem key={subitem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubActive}
                              className="rounded-md"
                              style={{
                                padding: "10px 16px",
                                transition: transitions.normal,
                                borderRadius: borderRadius.md,
                                backgroundColor: isSubActive ? colors.state.selected : "transparent",
                                color: isSubActive ? colors.accent.primary : colors.text.primary,
                                marginLeft: "10px",
                              }}
                            >
                              <Link
                                href={`/${urlPath}/${menuItem.path}/${subitem.path}`}
                                onClick={() => onSelect(index, subindex)}
                                className="flex items-center w-full"
                              >
                                <span>{subitem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Fixed Footer */}
      <SidebarFooter
        className="border-t shrink-0"
        style={{
          borderColor: colors.border.light,
          padding: "24px 16px",
        }}
      >
        <SidebarMenu>
          {footerMenuItems.map((menuItem) => {
            const IconComponent = iconMap[menuItem.icon as keyof typeof iconMap] || Settings
            const isLogout = menuItem.title === "Logout"

            return (
              <SidebarMenuItem key={menuItem.path} className="my-2.5">
                <SidebarMenuButton
                  asChild
                  className="rounded-md w-full"
                  style={{
                    padding: "12px 16px",
                    transition: transitions.normal,
                    borderRadius: borderRadius.md,
                    color: isLogout ? colors.feedback.error : colors.text.primary,
                  }}
                >
                  <Link href={`/${urlPath}/${menuItem.path}`} className="flex items-center w-full">
                    <IconComponent
                      className="mr-4 h-5 w-5"
                      style={{
                        color: isLogout ? colors.feedback.error : colors.text.secondary,
                      }}
                    />
                    <span>{menuItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
