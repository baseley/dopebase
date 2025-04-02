"use client"

import { useEffect, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"
import {
  Search,
  Palette,
  Loader2,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authFetch, authPost } from "@/modules/auth/utils/authFetch"
import { websiteURL } from "@/config/config"
import { theme } from "@/lib/theme"

// Add these type definitions at the top of the file, after the imports
interface Theme {
  id: string
  name: string
  description: string | null
  version: string
  selected?: boolean
  // Add other properties as needed
}

const themesColumns = [
  {
    header: "Identifier",
    accessorKey: "id",
    cell: ({ getValue }) => <div style={theme.listView.idCell}>{getValue()}</div>,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ getValue }) => <div style={theme.listView.nameCell}>{getValue()}</div>,
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ getValue }) => (
      <div style={theme.listView.descriptionCell}>
        {getValue() || <span style={{ fontStyle: "italic" }}>No description</span>}
      </div>
    ),
  },
  {
    header: "Version",
    accessorKey: "version",
    cell: ({ getValue }) => <div style={theme.listView.versionCell}>v{getValue()}</div>,
  },
  {
    accessorKey: "actions",
    header: "Status",
    cell: ({ row }) => <ActionsItemView data={row.original} />,
  },
]

// Update the ActionsItemView component to use the Theme type
function ActionsItemView({ data }: { data: Theme }) {
  const [isActivating, setIsActivating] = useState(false)

  const handleInstall = async () => {
    if (window.confirm("Are you sure you want to activate this theme? Changes will apply immediately.")) {
      setIsActivating(true)
      try {
        await authPost(`${websiteURL}api/system/themes/use?theme=${data.id}`)
        window.location.reload()
      } catch (error) {
        console.error("Error activating theme:", error)
        alert("Failed to activate theme. Please try again.")
        setIsActivating(false)
      }
    }
  }

  if (data.selected) {
    return (
      <div
        style={{
          ...theme.listView.statusBadge,
          backgroundColor: `${theme.colors.accent.primary}20`,
          color: theme.colors.accent.primary,
        }}
      >
        <Check size={14} />
        Active
      </div>
    )
  }

  return (
    <button
      onClick={handleInstall}
      disabled={isActivating}
      style={{
        ...theme.listView.actionButton,
        backgroundColor: "transparent",
        border: `1px solid ${theme.colors.accent.primary}30`,
        color: theme.colors.accent.primary,
        opacity: isActivating ? 0.7 : 1,
        cursor: isActivating ? "not-allowed" : "pointer",
      }}
    >
      {isActivating ? (
        <>
          <Loader2 size={14} style={{ marginRight: "8px", animation: "spin 1s linear infinite" }} />
          Activating...
        </>
      ) : (
        <>
          <Sparkles size={14} style={{ marginRight: "8px" }} />
          Activate
        </>
      )}
    </button>
  )
}

export const ThemesListView = () => {
  // Update the useState for themes to specify the type
  const [themes, setThemes] = useState<Theme[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [user, , loading] = useCurrentUser()
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!user || loading) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await authFetch(`${websiteURL}api/system/themes`)
        if (response?.data?.themes) {
          const selectedTheme = response.data.selectedTheme
          const richThemes = response.data.themes.map((theme) => ({
            ...theme,
            selected: theme.id === selectedTheme?.id,
          }))
          setThemes(richThemes)
        }
      } catch (error) {
        console.error("Error fetching themes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, loading])

  const filteredThemes = activeTab === "active" ? themes.filter((theme) => theme.selected) : themes

  // Update the table definition to use proper types
  const table = useReactTable<Theme>({
    data: filteredThemes,
    columns: themesColumns,
    getCoreRowModel: getCoreRowModel<Theme>(),
    getPaginationRowModel: getPaginationRowModel<Theme>(),
    getFilteredRowModel: getFilteredRowModel<Theme>(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div style={theme.listView.card}>
      <div style={theme.listView.cardHeader}>
        <h1 style={theme.listView.title}>
          <Palette size={24} style={{ color: theme.colors.accent.primary }} />
          Theme Gallery
        </h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <div
            style={{
              ...theme.listView.tab,
              backgroundColor: activeTab === "all" ? theme.colors.accent.primary : theme.colors.surface.tertiary,
              color: activeTab === "all" ? "#ffffff" : theme.colors.text.primary,
            }}
            onClick={() => setActiveTab("all")}
          >
            All Themes
          </div>
          <div
            style={{
              ...theme.listView.tab,
              backgroundColor: activeTab === "active" ? theme.colors.accent.primary : theme.colors.surface.tertiary,
              color: activeTab === "active" ? "#ffffff" : theme.colors.text.primary,
            }}
            onClick={() => setActiveTab("active")}
          >
            Active Theme
          </div>
        </div>
      </div>
      <div style={theme.listView.cardBody}>
        <div style={theme.listView.searchContainer}>
          <input
            type="text"
            placeholder="Search themes..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={theme.listView.searchInput}
          />
          <Search size={18} style={theme.listView.searchIcon} />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={theme.listView.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} style={theme.listView.tableHeader}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={themesColumns.length}
                    style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                  >
                    <div style={theme.listView.loadingContainer}>
                      <div className="animate-spin" style={theme.listView.loadingSpinner}></div>
                      Loading themes...
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={themesColumns.length}
                    style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                  >
                    <div style={theme.listView.emptyContainer}>
                      <div style={theme.listView.emptyIconContainer}>
                        <Palette size={32} style={{ color: theme.colors.text.secondary }} />
                      </div>
                      <div style={theme.listView.emptyTitle}>No themes found</div>
                      <div style={theme.listView.emptyMessage}>
                        {activeTab === "active"
                          ? "You don't have any active theme. Try switching to 'All Themes' to activate one."
                          : "Try adjusting your search or contact your administrator to add themes to your collection."}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    style={{
                      transition: theme.transitions.normal,
                      backgroundColor: row.original.selected
                        ? `${theme.colors.accent.primary}05`
                        : theme.colors.surface.secondary,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = row.original.selected
                        ? `${theme.colors.accent.primary}10`
                        : theme.colors.state.hover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = row.original.selected
                        ? `${theme.colors.accent.primary}05`
                        : theme.colors.surface.secondary)
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={theme.listView.tableCell}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={theme.listView.pagination}>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            style={{
              ...theme.listView.paginationButton,
              opacity: !table.getCanPreviousPage() ? 0.5 : 1,
              cursor: !table.getCanPreviousPage() ? "not-allowed" : "pointer",
            }}
            title="First page"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{
              ...theme.listView.paginationButton,
              opacity: !table.getCanPreviousPage() ? 0.5 : 1,
              cursor: !table.getCanPreviousPage() ? "not-allowed" : "pointer",
            }}
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span style={theme.listView.paginationText}>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{
              ...theme.listView.paginationButton,
              opacity: !table.getCanNextPage() ? 0.5 : 1,
              cursor: !table.getCanNextPage() ? "not-allowed" : "pointer",
            }}
            title="Next page"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            style={{
              ...theme.listView.paginationButton,
              opacity: !table.getCanNextPage() ? 0.5 : 1,
              cursor: !table.getCanNextPage() ? "not-allowed" : "pointer",
            }}
            title="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ThemesListView

