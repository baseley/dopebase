"use client"

import React, { useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react'
import { IMDateTableCell } from '../../../../../admin/components/forms/table/IMDateTableCell'
import { IMToggleSwitchComponent } from '../../../../../admin/components/forms/fields'
import useCurrentUser from '../../../../../modules/auth/hooks/useCurrentUser'
import { authPost } from '../../../../../modules/auth/utils/authFetch'
import { pluginsAPIURL } from '../../../../../config/config'
import { theme } from '../../../../../lib/theme'

const baseAPIURL = `${pluginsAPIURL}admin/customer-support/`

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  banned: boolean
  createdAt: string
  updatedAt: string
}

const UsersColumns = [
  {
    header: "Email",
    accessorKey: "email",
    cell: ({ getValue }) => <div style={theme.listView.nameCell}>{getValue()}</div>,
  },
  {
    header: "First Name",
    accessorKey: "firstName",
    cell: ({ getValue }) => <div style={theme.listView.nameCell}>{getValue()}</div>,
  },
  {
    header: "Last Name",
    accessorKey: "lastName",
    cell: ({ getValue }) => <div style={theme.listView.nameCell}>{getValue()}</div>,
  },
  {
    header: "Phone",
    accessorKey: "phone",
    cell: ({ getValue }) => <div style={theme.listView.nameCell}>{getValue()}</div>,
  },
  {
    header: "Banned",
    accessorKey: "banned",
    cell: ({ getValue }) => <IMToggleSwitchComponent isChecked={getValue()} disabled />,
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ getValue }) => <IMDateTableCell timestamp={getValue()} />,
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ getValue }) => <IMDateTableCell timestamp={getValue()} />,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsItemView data={row.original} />,
  },
]

function ActionsItemView({ data }: { data: User }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleView = () => {
    const viewPath = `./view?id=${data.id}`
    router.push(viewPath)
  }

  const handleEdit = () => {
    const editPath = `./update?id=${data.id}`
    router.push(editPath)
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setIsProcessing(true)
      try {
        const path = baseAPIURL + "users/delete"
        await authPost(path, { id: data.id })
        window.location.reload()
      } catch (error) {
        console.error("Error deleting user:", error)
        alert("Failed to delete user. Please try again.")
        setIsProcessing(false)
      }
    }
  }

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        onClick={handleView}
        disabled={isProcessing}
        style={{
          ...theme.listView.actionButton,
          backgroundColor: "rgba(13, 148, 255, 0.15)",
          color: theme.colors.accent.primary,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
        title="View user"
      >
        <Eye size={14} />
      </button>
      <button
        onClick={handleEdit}
        disabled={isProcessing}
        style={{
          ...theme.listView.actionButton,
          backgroundColor: "rgba(34, 197, 94, 0.15)",
          color: theme.colors.feedback.success,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
        title="Edit user"
      >
        <Edit size={14} />
      </button>
      <button
        onClick={handleDelete}
        disabled={isProcessing}
        style={{
          ...theme.listView.actionButton,
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: theme.colors.feedback.error,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
        title="Delete user"
      >
        {isProcessing ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={14} />}
      </button>
    </div>
  )
}

export default function UsersListView() {
  const [users, setUsers] = useState<User[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, token, loading] = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (!user || loading) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const config = {
          headers: { Authorization: token },
        }
        const response = await fetch(`${baseAPIURL}users/list`, config)
        const data = await response.json()

        if (data) {
          setUsers(data)
        } else {
          setError("Access denied or no data available")
        }
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Failed to load users. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, token, loading])

  const table = useReactTable<User>({
    data: users,
    columns: UsersColumns,
    getCoreRowModel: getCoreRowModel<User>(),
    getPaginationRowModel: getPaginationRowModel<User>(),
    getFilteredRowModel: getFilteredRowModel<User>(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const handleAddNew = () => {
    router.push("./add")
  }

  if (error) {
    return (
      <div style={theme.listView.card}>
        <div style={theme.listView.cardHeader}>
          <h1 style={theme.listView.title}>
            <Users size={24} style={{ color: theme.colors.accent.primary }} />
            Users
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
          <Users size={24} style={{ color: theme.colors.accent.primary }} />
          Users
        </h1>
        <button
          onClick={handleAddNew}
          style={{
            ...theme.listView.actionButton,
            backgroundColor: theme.colors.accent.primary,
            color: "white",
            padding: "8px 16px",
          }}
        >
          Add New
        </button>
      </div>
      <div style={theme.listView.cardBody}>
        <div style={theme.listView.searchContainer}>
          <input
            type="text"
            placeholder="Search users..."
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
                    colSpan={UsersColumns.length}
                    style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                  >
                    <div style={theme.listView.loadingContainer}>
                      <Loader2 size={24} style={{ animation: "spin 1s linear infinite", marginRight: "12px" }} />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={UsersColumns.length}
                    style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                  >
                    <div style={theme.listView.emptyContainer}>
                      <div style={theme.listView.emptyIconContainer}>
                        <Users size={32} style={{ color: theme.colors.text.secondary }} />
                      </div>
                      <div style={theme.listView.emptyTitle}>No users found</div>
                      <div style={theme.listView.emptyMessage}>
                        Try adjusting your search or add new users to your collection.
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