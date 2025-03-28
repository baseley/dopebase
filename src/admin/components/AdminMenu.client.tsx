"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { BarChart3, Settings, UserCircle, LogOut, ChevronDown, ChevronRight } from "lucide-react"

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
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

// Map Font Awesome icon names to Lucide icons
const iconMap = {
  "bar-chart-o": BarChart3,
  gear: Settings,
  "user-circle": UserCircle,
  "sign-out": LogOut,
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

  // Section title component for better organization
  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">{children}</div>
  )

  // Badge component for "Coming Soon" labels
  const ComingSoonBadge = () => (
    <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">Coming Soon</span>
  )

  return (
    <Sidebar collapsible="icon" className="bg-[#121212] text-white border-r border-gray-800">
      <SidebarHeader className="p-4 pb-6">
        <div className="flex items-center gap-2 px-2 py-1">
          <img src="https://dopebase.com/assets/dopebase-logo.svg" alt="Dopebase Logo" className="h-6 w-6" />
          <span className="font-medium text-primary">Dopebase</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        {/* <SectionTitle>Main</SectionTitle> */}
        <SidebarMenu>
          {mainMenuItems.map((menuItem, index) => {
            const IconComponent = iconMap[menuItem.icon as keyof typeof iconMap] || Settings
            const hasSubItems = menuItem.subItems && menuItem.subItems.length > 0
            const isExpanded = expandedMenus[index] || false

            return (
              <SidebarMenuItem key={menuItem.path}>
                {!hasSubItems ? (
                  <SidebarMenuButton
                    asChild
                    isActive={index === selectedIndex && !hasSubItems}
                    className="hover:bg-gray-800 text-gray-300 hover:text-white data-[active=true]:bg-blue-600 data-[active=true]:text-white rounded-md"
                  >
                    <Link href={`/${urlPath}/${menuItem.path}`} onClick={() => onSelect(index, -1)}>
                      <IconComponent className="mr-2 h-4 w-4" />
                      <span>{menuItem.title}</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <>
                    <SidebarMenuButton
                      onClick={() => onSelect(index, -1)}
                      isActive={index === selectedIndex}
                      className="hover:bg-gray-800 text-gray-300 hover:text-white data-[active=true]:bg-blue-600 data-[active=true]:text-white rounded-md"
                    >
                      <IconComponent className="mr-2 h-4 w-4" />
                      <span>{menuItem.title}</span>
                      {isExpanded ? (
                        <ChevronDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </SidebarMenuButton>

                    <SidebarMenuSub
                      className={cn(
                        "transition-all duration-200 overflow-hidden pl-2 border-l border-gray-700 ml-2",
                        isExpanded ? "max-h-96" : "max-h-0",
                      )}
                    >
                      {menuItem.subItems?.map((subitem, subindex) => (
                        <SidebarMenuSubItem key={subitem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={index === selectedIndex && subindex === extractedSubindex}
                            className="text-gray-400 hover:text-white data-[active=true]:bg-blue-600 data-[active=true]:text-white rounded-md"
                          >
                            <Link
                              href={`/${urlPath}/${menuItem.path}/${subitem.path}`}
                              onClick={() => onSelect(index, subindex)}
                            >
                              <span>{subitem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-2 border-t border-gray-800">
        <SidebarMenu>
          {footerMenuItems.map((menuItem) => {
            const IconComponent = iconMap[menuItem.icon as keyof typeof iconMap] || Settings

            return (
              <SidebarMenuItem key={menuItem.path}>
                <SidebarMenuButton asChild className="hover:bg-gray-800 text-gray-300 hover:text-white rounded-md">
                  <Link href={`/${urlPath}/${menuItem.path}`}>
                    <IconComponent className="mr-2 h-4 w-4" />
                    <span>{menuItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail className="after:bg-gray-700" />
    </Sidebar>
  )
}

