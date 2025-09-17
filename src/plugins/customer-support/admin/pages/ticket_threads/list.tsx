"use client"

import { useMemo, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table"
import { IMDateTableCell, IMForeignKeyTableCell } from "../../../../../admin/components/forms/table"
import { pluginsAPIURL } from "../../../../../config/config"
import useCurrentUser from "../../../../../modules/auth/hooks/useCurrentUser"
import { authPost } from "../../../../../modules/auth/utils/authFetch"
import {
  Search,
  Loader2,
  Eye,
  Edit,
  Trash2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { theme } from "@/lib/theme"

const baseAPIURL = `${pluginsAPIURL}admin/customer-support/`

const TicketThreadsColumns = [
  {
    id: "id",
    header: "ID",
    accessorKey: "id",
    cell: ({ getValue }) => <div style={theme.listView.idCell}>{getValue()}</div>,
  },
  {
    id: "number",
    header: "Number",
    accessorKey: "number",
    cell: ({ getValue }) => <div style={theme.listView.idCell}>{getValue()}</div>,
  },
  {
    id: "author_email",
    header: "Author Email",
    accessorKey: "author_email",
    cell: ({ getValue }) => <div style={{ ...theme.listView.nameCell, fontStyle: "italic" }}>{getValue()}</div>,
  },
  {
    id: "author_name",
    header: "Author Name",
    accessorKey: "author_name",
    cell: ({ getValue }) => <div style={theme.listView.nameCell}>{getValue()}</div>,
  },
  {
    id: "message_count",
    header: "Messages",
    accessorKey: "message_count",
    cell: ({ getValue }) => (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "2px 8px",
          borderRadius: theme.borderRadius.md,
          backgroundColor: theme.colors.accent.muted,
          color: theme.colors.accent.primary,
          fontWeight: theme.typography.fontWeights.medium,
        }}
      >
        <MessageCircle size={14} />
        {getValue()}
      </div>
    ),
  },
  {
    id: "subject",
    header: "Subject",
    accessorKey: "subject",
    cell: ({ getValue }) => <div style={theme.listView.descriptionCell}>{getValue()}</div>,
  },
  {
    id: "is_closed",
    header: "Status",
    accessorKey: "is_closed",
    cell: ({ getValue }) => (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "2px 8px",
          borderRadius: theme.borderRadius.md,
          backgroundColor: getValue() ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)",
          color: getValue() ? theme.colors.feedback.error : theme.colors.feedback.success,
          fontWeight: theme.typography.fontWeights.medium,
        }}
      >
        {getValue() ? "Closed" : "Open"}
      </div>
    ),
  },
  {
    id: "is_public",
    header: "Visibility",
    accessorKey: "is_public",
    cell: ({ getValue }) => (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "2px 8px",
          borderRadius: theme.borderRadius.md,
          backgroundColor: getValue() ? "rgba(59, 130, 246, 0.15)" : "rgba(245, 158, 11, 0.15)",
          color: getValue() ? theme.colors.feedback.info : theme.colors.feedback.warning,
          fontWeight: theme.typography.fontWeights.medium,
        }}
      >
        {getValue() ? "Public" : "Private"}
      </div>
    ),
  },
  {
    id: "created_at",
    header: "Created At",
    accessorKey: "created_at",
    cell: (data) => <IMDateTableCell timestamp={data.getValue()} />,
  },
  {
    id: "updated_at",
    header: "Updated At",
    accessorKey: "updated_at",
    cell: (data) => <IMDateTableCell timestamp={data.getValue()} />,
  },
  {
    id: "user_id",
    header: "User",
    accessorKey: "user_id",
    cell: (data) => (
      <IMForeignKeyTableCell
        id={data.getValue()}
        apiRouteName="admin/customer-support/users"
        viewRoute="users"
        titleKey="email"
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => <ActionsItemView data={row.original} />,
  },
]

function ActionsItemView({ data }) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleView = (item) => {
    const viewPath = "./view?id=" + item.id
    router.push(viewPath)
  }

  const handleEdit = (item) => {
    const editPath = "./update?id=" + item.id
    router.push(editPath)
  }

  const handleDelete = async (item) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setIsProcessing(true)
      try {
        const path = baseAPIURL + "ticket_threads/delete"
        const response = await authPost(path, { id: item.id })
        window.location.reload()
      } catch (error) {
        console.error("Error deleting ticket thread:", error)
        alert("Failed to delete ticket thread. Please try again.")
        setIsProcessing(false)
      }
    }
  }

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        onClick={() => handleView(data)}
        disabled={isProcessing}
        title="View"
        style={{
          ...theme.listView.iconButton,
          backgroundColor: "rgba(59, 130, 246, 0.15)",
          color: theme.colors.feedback.info,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
      >
        <Eye size={16} />
      </button>
      <button
        onClick={() => handleEdit(data)}
        disabled={isProcessing}
        title="Edit"
        style={{
          ...theme.listView.iconButton,
          backgroundColor: "rgba(34, 197, 94, 0.15)",
          color: theme.colors.feedback.success,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
      >
        <Edit size={16} />
      </button>
      <button
        onClick={() => handleDelete(data)}
        disabled={isProcessing}
        title="Delete"
        style={{
          ...theme.listView.iconButton,
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: theme.colors.feedback.error,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
      >
        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  )
}

function TicketThreadsListView() {
  const [isLoading, setIsLoading] = useState(true)
  const [ticketThreads, setTicketThreads] = useState([])
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [user, token, loading] = useCurrentUser()
  const router = useRouter()

  const columns = useMemo(() => TicketThreadsColumns, [])

  const table = useReactTable({
    data: ticketThreads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  useEffect(() => {
    if (loading) {
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const config = {
          headers: { Authorization: token },
        }

        const extraQueryParams = null
        const response = await fetch(
          baseAPIURL + "ticket_threads/list" + (extraQueryParams ? extraQueryParams : ""),
          config,
        )

        const data = await response.json()
        console.log(data)
        setData(data)
      } catch (err) {
        console.error("Error fetching ticket threads:", err)
        setError("Failed to load ticket threads. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [loading, token])

  useEffect(() => {
    setTicketThreads(data)
  }, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize, data])

  const handleAddNew = () => {
    router.push("./add")
  }

  if (error) {
    return (
      <div style={theme.listView.card}>
        <div style={theme.listView.cardHeader}>
          <h1 style={theme.listView.title}>
            <MessageCircle size={24} style={{ color: theme.colors.accent.primary }} />
            Ticket Threads
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
        <button
          onClick={handleAddNew}
          style={{
            ...theme.listView.actionButton,
            backgroundColor: theme.colors.accent.primary,
            color: "white",
            fontWeight: theme.typography.fontWeights.medium,
          }}
        >
          Add New
        </button>
        <h1 style={theme.listView.title}>
          <MessageCircle size={24} style={{ color: theme.colors.accent.primary }} />
          Ticket Threads
        </h1>
      </div>
      <div style={theme.listView.cardBody}>
        <div style={theme.listView.searchContainer}>
          <input
            type="text"
            placeholder="Search ticket threads..."
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
                    colSpan={TicketThreadsColumns.length}
                    style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                  >
                    <div style={theme.listView.loadingContainer}>
                      <div
                        style={{
                          ...theme.listView.loadingSpinner,
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      <span style={{ color: theme.colors.text.primary }}>Loading ticket threads...</span>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={TicketThreadsColumns.length}
                    style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                  >
                    <div style={theme.listView.emptyContainer}>
                      <div style={theme.listView.emptyIconContainer}>
                        <MessageCircle size={32} style={{ color: theme.colors.text.secondary }} />
                      </div>
                      <div
                        style={{
                          ...theme.listView.emptyTitle,
                          color: theme.colors.text.primary,
                        }}
                      >
                        No ticket threads found
                      </div>
                      <div style={theme.listView.emptyMessage}>
                        Try adjusting your search or create a new ticket thread.
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
                      backgroundColor: theme.colors.surface.primary,
                      borderBottom: `1px solid ${theme.colors.border.light}`,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.state.hover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surface.primary)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          ...theme.listView.tableCell,
                          color: theme.colors.text.primary,
                        }}
                      >
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
              color: theme.colors.text.primary,
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
              color: theme.colors.text.primary,
            }}
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span
            style={{
              ...theme.listView.paginationText,
              color: theme.colors.text.primary,
            }}
          >
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            style={{
              padding: "4px 8px",
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border.light}`,
              backgroundColor: theme.colors.surface.primary,
              color: theme.colors.text.primary,
              fontSize: theme.typography.fontSizes.sm,
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{
              ...theme.listView.paginationButton,
              opacity: !table.getCanNextPage() ? 0.5 : 1,
              cursor: !table.getCanNextPage() ? "not-allowed" : "pointer",
              color: theme.colors.text.primary,
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
              color: theme.colors.text.primary,
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

export default TicketThreadsListView
