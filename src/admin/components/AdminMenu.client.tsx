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

// Map Font Awesome icon names to Lucide icons
const iconMap = {
  "bar-chart-o": BarChart3,
  gear: Settings,
  "user-circle": UserCircle,
  "sign-out": LogOut,
}

// Map for submenu icons
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
  const extractSelectedIndex = (menuItems: MenuItem[], slug: string) => {
    let selectedIndex = 0
    let selectedSubindex = -1
    menuItems.forEach((menuItem, index) => {
      const path = menuItem.path.replace("plugins/", "")
      if (path === slug) {
        selectedIndex = index
        selectedSubindex = -1
      } else if (menuItem.subItems && menuItem.subItems.length > 0) {
        menuItem.subItems.forEach((subitem, subindex) => {
          const subpath = path + "/" + subitem.path
          if (subpath === slug) {
            selectedIndex = index
            selectedSubindex = subindex
          }
        })
      }
    })
    return [selectedIndex, selectedSubindex]
  }

  const [extractedIndex, extractedSubindex] = extractSelectedIndex(menuItems, slug)
  const [selectedIndex, setSelectedIndex] = useState(extractedIndex)

  // Separate main menu items from footer items (My Account and Logout)
  const mainMenuItems = menuItems.filter((item) => item.title !== "My Account" && item.title !== "Logout")
  const footerMenuItems = menuItems.filter((item) => item.title === "My Account" || item.title === "Logout")

  // Initialize all menus as expanded by default
  const initialExpandedState: Record<number, boolean> = {}
  mainMenuItems.forEach((item, index) => {
    if (item.subItems && item.subItems.length > 0) {
      initialExpandedState[index] = true
    }
  })

  const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>(initialExpandedState)

  const onSelect = (index: number, subindex: number) => {
    setSelectedIndex(index)

    // If clicking on a parent menu item with subitems, toggle its expanded state
    if (
      subindex === -1 &&
      mainMenuItems[index] &&
      mainMenuItems[index].subItems &&
      mainMenuItems[index].subItems.length > 0
    ) {
      setExpandedMenus((prev) => ({
        ...prev,
        [index]: !prev[index],
      }))
    }
  }

  const { colors, spacing, transitions, borderRadius, sidebar } = theme

  return (
    <Sidebar
      collapsible="none"
      className="border-r"
      style={{
        backgroundColor: colors.surface.primary,
        color: colors.text.primary,
        borderColor: colors.border.light,
        width: sidebar.width,
      }}
    >
      <SidebarHeader
        className="border-b"
        style={{
          borderColor: colors.border.light,
          padding: "24px 24px 24px 24px", // Increased padding for more space
        }}
      >
        <div className="flex items-center gap-4 px-2">
          <img src="https://dopebase.com/assets/dopebase-logo.svg" alt="Dopebase Logo" className="h-8 w-8" />
          <span className="text-lg font-medium" style={{ color: colors.text.primary }}>
            Dopebase
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent
        style={{
          padding: "24px 16px", // Increased padding for more space
        }}
      >
        <SidebarMenu>
          {mainMenuItems.map((menuItem, index) => {
            const IconComponent = iconMap[menuItem.icon as keyof typeof iconMap] || Settings
            const hasSubItems = menuItem.subItems && menuItem.subItems.length > 0
            const isExpanded = expandedMenus[index] || false
            const isActive = index === selectedIndex

            return (
              <SidebarMenuItem key={menuItem.path} className="my-2.5">
                {!hasSubItems ? (
                  <SidebarMenuButton
                    asChild
                    isActive={isActive && !hasSubItems}
                    className="rounded-md"
                    style={{
                      padding: "12px 16px", // Increased padding for better touch targets
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
                        className="mr-4 h-5 w-5" // Increased margin for better spacing
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
                        padding: "12px 16px", // Increased padding for better touch targets
                        transition: transitions.normal,
                        borderRadius: borderRadius.md,
                        backgroundColor: isActive ? colors.state.selected : "transparent",
                        color: isActive ? colors.accent.primary : colors.text.primary,
                      }}
                    >
                      <IconComponent
                        className="mr-4 h-5 w-5" // Increased margin for better spacing
                        style={{
                          color: isActive ? colors.accent.primary : colors.text.secondary,
                        }}
                      />
                      <span className="font-medium">{menuItem.title}</span>
                      {isExpanded ? (
                        <ChevronDown
                          className="ml-auto h-4 w-4 transition-transform"
                          style={{ color: colors.text.secondary }}
                        />
                      ) : (
                        <ChevronRight
                          className="ml-auto h-4 w-4 transition-transform"
                          style={{ color: colors.text.secondary }}
                        />
                      )}
                    </SidebarMenuButton>

                    <SidebarMenuSub
                      className={cn(
                        "transition-all overflow-hidden ml-8 border-l", // Increased margin for better indentation
                        isExpanded ? "max-h-96 py-2" : "max-h-0 py-0", // Increased padding for better spacing
                      )}
                      style={{
                        transition: transitions.expand,
                        borderColor: isActive ? colors.accent.primary : colors.border.light,
                        opacity: isExpanded ? 1 : 0,
                      }}
                    >
                      {menuItem.subItems?.map((subitem, subindex) => {
                        const isSubActive = index === selectedIndex && subindex === extractedSubindex
                        const SubIcon = submenuIconMap[subitem.path as keyof typeof submenuIconMap]

                        return (
                          <SidebarMenuSubItem key={subitem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubActive}
                              className="rounded-md"
                              style={{
                                padding: "10px 16px", // Increased padding for better touch targets
                                transition: transitions.normal,
                                borderRadius: borderRadius.md,
                                backgroundColor: isSubActive ? colors.state.selected : "transparent",
                                color: isSubActive ? colors.accent.primary : colors.text.primary,
                                marginLeft: "10px", // Increased margin for better indentation
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

      <SidebarFooter
        className="mt-auto border-t"
        style={{
          borderColor: colors.border.light,
          padding: "24px 16px", // Increased padding for more space
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
                    padding: "12px 16px", // Increased padding for better touch targets
                    transition: transitions.normal,
                    borderRadius: borderRadius.md,
                    color: isLogout ? colors.feedback.error : colors.text.primary,
                  }}
                >
                  <Link href={`/${urlPath}/${menuItem.path}`} className="flex items-center w-full">
                    <IconComponent
                      className="mr-4 h-5 w-5" // Increased margin for better spacing
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

