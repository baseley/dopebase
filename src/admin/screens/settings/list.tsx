"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"
import { Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { IMDateTableCell } from "@/admin/components/forms/table/IMDateTableCell"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authFetch, authPost } from "@/modules/auth/utils/authFetch"
import { websiteURL } from "@/config/config"
import { theme } from "@/lib/theme"

// Define a type for the settings data
interface Setting {
  id: string
  name: string
  value: string
  created_at: string
  updated_at: string
}

const SettingsColumns = [
  {
    header: "Settings Name",
    accessorKey: "name",
  },
  {
    header: "Settings Value",
    accessorKey: "value",
  },
  {
    header: "Created Date",
    accessorKey: "created_at",
    cell: ({ getValue }: any) => <IMDateTableCell timestamp={getValue()} />,
  },
  {
    header: "Updated Date",
    accessorKey: "updated_at",
    cell: ({ getValue }: any) => <IMDateTableCell timestamp={getValue()} />,
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }: any) => <ActionsItemView data={row.original} />,
  },
]

function ActionsItemView({ data }: { data: Setting }) {
  const router = useRouter()

  const handleView = () => router.push(`./settings/view?id=${data.id}`)
  const handleEdit = () => router.push(`./settings/update?id=${data.id}`)
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await authPost(`${websiteURL}api/system/settings/delete`, { id: data.id })
      window.location.reload()
    }
  }

  return (
    <div className="flex items-center">
      <button
        onClick={handleView}
        style={{
          ...theme.listView.iconButton,
          backgroundColor: theme.colors.state.hover,
          color: theme.colors.text.primary,
        }}
        title="View"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={handleEdit}
        style={{
          ...theme.listView.iconButton,
          backgroundColor: theme.colors.accent.muted,
          color: theme.colors.accent.primary,
        }}
        title="Edit"
      >
        <Edit size={16} />
      </button>
      <button
        onClick={handleDelete}
        style={{
          ...theme.listView.iconButton,
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: theme.colors.feedback.error,
        }}
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

function SettingsListView() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<Setting[]>([])
  const [user, token, loading] = useCurrentUser()
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    if (user && !loading) {
      authFetch(`${websiteURL}api/system/settings/list`).then((response) => {
        setData(response?.data || [])
        setIsLoading(false)
      })
    }
  }, [user, loading])

  const table = useReactTable({
    data,
    columns: SettingsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchValue,
    },
    onGlobalFilterChange: setSearchValue,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div style={{ maxWidth: theme.content.maxWidth, margin: "0 auto" }}>
      <div style={theme.listView.card}>
        <div style={theme.listView.cardHeader}>
          <h1 style={theme.listView.title}>Settings</h1>
          <a
            href="./settings/add"
            style={{
              ...theme.listView.actionButton,
              backgroundColor: theme.colors.accent.primary,
              color: "#ffffff",
            }}
          >
            <Plus size={16} style={{ marginRight: "8px" }} />
            Add New
          </a>
        </div>
        <div style={theme.listView.cardBody}>
          <div style={theme.listView.searchContainer}>
            <input
              type="text"
              placeholder="Search settings..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
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
                      colSpan={SettingsColumns.length}
                      style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                    >
                      <div style={theme.listView.loadingContainer}>
                        <div className="animate-spin" style={theme.listView.loadingSpinner}></div>
                        Loading settings...
                      </div>
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={SettingsColumns.length}
                      style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                    >
                      <div style={theme.listView.emptyMessage}>No settings found</div>
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
    </div>
  )
}

export default SettingsListView

