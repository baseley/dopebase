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
  Loader2,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package,
} from "lucide-react"
import { IMDateTableCell } from "@/admin/components/forms/table/IMDateTableCell"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authFetch, authPost } from "@/modules/auth/utils/authFetch"
import { websiteURL } from "@/config/config"
import { theme } from "@/lib/theme"

// Add these type definitions at the top of the file, after the imports
interface Plugin {
  id: string
  name: string
  description: string | null
  version: string
  createdAt: string
  installed: boolean
  // Add other properties as needed
}

const pluginsColumns = [
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
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ getValue }) => <IMDateTableCell timestamp={getValue()} />,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsItemView data={row.original} />,
  },
]

// Update the ActionsItemView component to use the Plugin type
function ActionsItemView({ data }: { data: Plugin }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInstall = async () => {
    setIsProcessing(true)
    try {
      await authPost(`${websiteURL}api/system/plugins/install?id=${data.id}`)
      window.location.reload()
    } catch (error) {
      console.error("Error installing plugin:", error)
      alert("Failed to install plugin. Please try again.")
      setIsProcessing(false)
    }
  }

  const handleUninstall = async () => {
    if (window.confirm("Are you sure you want to uninstall this plugin?")) {
      setIsProcessing(true)
      try {
        await authPost(`${websiteURL}api/system/plugins/uninstall?id=${data.id}`)
        window.location.reload()
      } catch (error) {
        console.error("Error uninstalling plugin:", error)
        alert("Failed to uninstall plugin. Please try again.")
        setIsProcessing(false)
      }
    }
  }

  if (data.installed) {
    return (
      <button
        onClick={handleUninstall}
        disabled={isProcessing}
        style={{
          ...theme.listView.actionButton,
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: theme.colors.feedback.error,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
      >
        {isProcessing ? (
          <>
            <Loader2 size={14} style={{ marginRight: "8px", animation: "spin 1s linear infinite" }} />
            Processing...
          </>
        ) : (
          <>
            <X size={14} style={{ marginRight: "8px" }} />
            Uninstall
          </>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleInstall}
      disabled={isProcessing}
      style={{
        ...theme.listView.actionButton,
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        color: theme.colors.feedback.success,
        opacity: isProcessing ? 0.7 : 1,
        cursor: isProcessing ? "not-allowed" : "pointer",
      }}
    >
      {isProcessing ? (
        <>
          <Loader2 size={14} style={{ marginRight: "8px", animation: "spin 1s linear infinite" }} />
          Processing...
        </>
      ) : (
        <>
          <Download size={14} style={{ marginRight: "8px" }} />
          Install
        </>
      )}
    </button>
  )
}

export const PluginsListView = () => {
  // Update the useState for plugins to specify the type
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, , loading] = useCurrentUser()

  useEffect(() => {
    if (!user || loading) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await authFetch(`${websiteURL}api/system/plugins`)
        if (response?.data?.plugins) {
          setPlugins(response.data.plugins)
        } else {
          setError("Access denied or no data available")
        }
      } catch (error) {
        console.error("Error fetching plugins:", error)
        setError("Failed to load plugins. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, loading])

  // Update the table definition to use proper types
  const table = useReactTable<Plugin>({
    data: plugins,
    columns: pluginsColumns,
    getCoreRowModel: getCoreRowModel<Plugin>(),
    getPaginationRowModel: getPaginationRowModel<Plugin>(),
    getFilteredRowModel: getFilteredRowModel<Plugin>(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  if (error) {
    return (
      <div style={theme.listView.card}>
        <div style={theme.listView.cardHeader}>
          <h1 style={theme.listView.title}>
            <Package size={24} style={{ color: theme.colors.accent.primary }} />
            Plugins
          </h1>
        </div>
        <div style={theme.listView.cardBody}>
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              color: theme.colors.feedback.error,
              fontSize: theme.typography.fontSizes.lg,
            }}
          >
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={theme.listView.card}>
      <div style={theme.listView.cardHeader}>
        <h1 style={theme.listView.title}>
          <Package size={24} style={{ color: theme.colors.accent.primary }} />
          Plugins
        </h1>
      </div>
      <div style={theme.listView.cardBody}>
        <div style={theme.listView.searchContainer}>
          <input
            type="text"
            placeholder="Search plugins..."
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
                    colSpan={pluginsColumns.length}
                    style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                  >
                    <div style={theme.listView.loadingContainer}>
                      <div className="animate-spin" style={theme.listView.loadingSpinner}></div>
                      Loading plugins...
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={pluginsColumns.length}
                    style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                  >
                    <div style={theme.listView.emptyContainer}>
                      <div style={theme.listView.emptyIconContainer}>
                        <Package size={32} style={{ color: theme.colors.text.secondary }} />
                      </div>
                      <div style={theme.listView.emptyTitle}>No plugins found</div>
                      <div style={theme.listView.emptyMessage}>
                        Try adjusting your search or contact your administrator to add plugins to your collection.
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
                      backgroundColor: theme.colors.surface.secondary,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.state.hover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surface.secondary)}
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

export default PluginsListView

