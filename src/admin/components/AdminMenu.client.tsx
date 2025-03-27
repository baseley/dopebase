"use client"

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
  SidebarSeparator,
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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 pb-2">
        {/* Logo area */}
        <div className="flex h-12 items-center justify-center rounded-md bg-primary/10 mb-4">
          <span className="font-semibold text-primary">Company Logo</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarMenu>
          {mainMenuItems.map((menuItem, index) => {
            const IconComponent = iconMap[menuItem.icon as keyof typeof iconMap] || Settings
            const hasSubItems = menuItem.subItems && menuItem.subItems.length > 0
            const isExpanded = expandedMenus[index] || false

            return (
              <SidebarMenuItem key={menuItem.path}>
                {!hasSubItems ? (
                  <SidebarMenuButton asChild isActive={index === selectedIndex && !hasSubItems}>
                    <Link href={`/${urlPath}/${menuItem.path}`} onClick={() => onSelect(index, -1)}>
                      <IconComponent className="mr-2 h-4 w-4" />
                      <span>{menuItem.title}</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <>
                    <SidebarMenuButton onClick={() => onSelect(index, -1)} isActive={index === selectedIndex}>
                      <IconComponent className="mr-2 h-4 w-4" />
                      <span>{menuItem.title}</span>
                      {isExpanded ? (
                        <ChevronDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </SidebarMenuButton>

                    <SidebarMenuSub
                      className={cn("transition-all duration-200 overflow-hidden", isExpanded ? "max-h-96" : "max-h-0")}
                    >
                      {menuItem.subItems?.map((subitem, subindex) => (
                        <SidebarMenuSubItem key={subitem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={index === selectedIndex && subindex === extractedSubindex}
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

      <SidebarFooter className="mt-auto p-3">
        <SidebarSeparator className="my-2" />
        <SidebarMenu>
          {footerMenuItems.map((menuItem) => {
            const IconComponent = iconMap[menuItem.icon as keyof typeof iconMap] || Settings

            return (
              <SidebarMenuItem key={menuItem.path}>
                <SidebarMenuButton asChild>
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

      <SidebarRail />
    </Sidebar>
  )
}

