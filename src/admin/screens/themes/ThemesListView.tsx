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
    cell: ({ getValue }) => (
      <div
        style={{ fontFamily: "monospace", fontSize: theme.typography.fontSizes.xs, color: theme.colors.text.secondary }}
      >
        {getValue()}
      </div>
    ),
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ getValue }) => <div style={{ fontWeight: theme.typography.fontWeights.medium }}>{getValue()}</div>,
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ getValue }) => (
      <div style={{ maxWidth: "400px", fontSize: theme.typography.fontSizes.sm, color: theme.colors.text.secondary }}>
        {getValue() || <span style={{ fontStyle: "italic" }}>No description</span>}
      </div>
    ),
  },
  {
    header: "Version",
    accessorKey: "version",
    cell: ({ getValue }) => (
      <div
        style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.border.light}`,
          fontSize: theme.typography.fontSizes.xs,
          fontFamily: "monospace",
        }}
      >
        v{getValue()}
      </div>
    ),
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

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 12px",
    borderRadius: theme.borderRadius.md,
    transition: theme.transitions.normal,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    cursor: "pointer",
    border: "none",
  }

  if (data.selected) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: theme.borderRadius.md,
          backgroundColor: `${theme.colors.accent.primary}20`,
          color: theme.colors.accent.primary,
          fontSize: theme.typography.fontSizes.sm,
          fontWeight: theme.typography.fontWeights.medium,
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
        ...buttonStyle,
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

  const cardStyle = {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    overflow: "hidden",
    border: `1px solid ${theme.colors.border.light}`,
    maxWidth: theme.content.maxWidth,
    margin: "0 auto",
  }

  const cardHeaderStyle = {
    padding: theme.spacing[6],
    borderBottom: `1px solid ${theme.colors.border.light}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }

  const cardBodyStyle = {
    padding: theme.spacing[6],
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    borderSpacing: "0",
  }

  const tableHeaderStyle = {
    backgroundColor: theme.colors.surface.tertiary,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    textAlign: "left",
    padding: theme.table.cellPadding,
    borderBottom: `1px solid ${theme.colors.border.light}`,
  }

  const tableCellStyle = {
    padding: theme.table.cellPadding,
    borderBottom: `1px solid ${theme.colors.border.light}`,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSizes.sm,
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 16px",
    backgroundColor: theme.colors.surface.tertiary,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
    fontSize: theme.typography.fontSizes.sm,
    outline: "none",
    transition: theme.transitions.normal,
  }

  const buttonPrimaryStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 16px",
    backgroundColor: theme.colors.accent.primary,
    color: "#ffffff",
    borderRadius: theme.borderRadius.md,
    fontWeight: theme.typography.fontWeights.medium,
    transition: theme.transitions.normal,
    cursor: "pointer",
    border: "none",
    fontSize: theme.typography.fontSizes.sm,
    textDecoration: "none",
  }

  const paginationStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: theme.spacing[4],
    gap: theme.spacing[2],
  }

  const paginationButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    backgroundColor: theme.colors.surface.tertiary,
    color: theme.colors.text.primary,
    borderRadius: theme.borderRadius.md,
    transition: theme.transitions.normal,
    cursor: "pointer",
    border: "none",
  }

  const paginationTextStyle = {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSizes.sm,
    margin: `0 ${theme.spacing[2]}`,
  }

  const tabStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 16px",
    borderRadius: theme.borderRadius.md,
    transition: theme.transitions.normal,
    cursor: "pointer",
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    marginRight: theme.spacing[2],
  }

  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <h1
          style={{
            fontSize: theme.typography.fontSizes["2xl"],
            fontWeight: theme.typography.fontWeights.semibold,
            color: theme.colors.text.primary,
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Palette size={24} style={{ color: theme.colors.accent.primary }} />
          Theme Gallery
        </h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <div
            style={{
              ...tabStyle,
              backgroundColor: activeTab === "all" ? theme.colors.accent.primary : theme.colors.surface.tertiary,
              color: activeTab === "all" ? "#ffffff" : theme.colors.text.primary,
            }}
            onClick={() => setActiveTab("all")}
          >
            All Themes
          </div>
          <div
            style={{
              ...tabStyle,
              backgroundColor: activeTab === "active" ? theme.colors.accent.primary : theme.colors.surface.tertiary,
              color: activeTab === "active" ? "#ffffff" : theme.colors.text.primary,
            }}
            onClick={() => setActiveTab("active")}
          >
            Active Theme
          </div>
        </div>
      </div>
      <div style={cardBodyStyle}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search themes..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={inputStyle}
          />
          <Search
            size={18}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              marginTop: "-8px",
              color: theme.colors.text.secondary,
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} style={tableHeaderStyle}>
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
                    style={{ ...tableCellStyle, textAlign: "center", padding: "24px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                      <div
                        className="animate-spin"
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: `2px solid ${theme.colors.accent.primary}`,
                          borderTopColor: "transparent",
                        }}
                      ></div>
                      Loading themes...
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={themesColumns.length}
                    style={{ ...tableCellStyle, textAlign: "center", padding: "24px" }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          backgroundColor: `${theme.colors.surface.tertiary}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <Palette size={32} style={{ color: theme.colors.text.secondary }} />
                      </div>
                      <div
                        style={{
                          fontSize: theme.typography.fontSizes.lg,
                          fontWeight: theme.typography.fontWeights.medium,
                        }}
                      >
                        No themes found
                      </div>
                      <div style={{ color: theme.colors.text.secondary, maxWidth: "400px", textAlign: "center" }}>
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
                      <td key={cell.id} style={tableCellStyle}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={paginationStyle}>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            style={{
              ...paginationButtonStyle,
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
              ...paginationButtonStyle,
              opacity: !table.getCanPreviousPage() ? 0.5 : 1,
              cursor: !table.getCanPreviousPage() ? "not-allowed" : "pointer",
            }}
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span style={paginationTextStyle}>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{
              ...paginationButtonStyle,
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
              ...paginationButtonStyle,
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

