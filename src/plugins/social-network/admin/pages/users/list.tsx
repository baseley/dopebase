"use client"

import { useMemo, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  SlidersHorizontal,
  Loader2,
  Mail,
  User,
  Phone,
  Shield,
  Calendar,
  AlertCircle,
  Check,
  X,
} from "lucide-react"
import { IMDateTableCell, IMImagesTableCell } from "@/admin/components/forms/table"
import { pluginsAPIURL } from "@/config/config"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authPost } from "@/modules/auth/utils/authFetch"
import { theme } from "@/lib/theme"
import type React from "react"

const baseAPIURL = `${pluginsAPIURL}admin/social-network/`

interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  phone: string
  profilePictureURL: string
  banned: boolean
  role: string
  createdAt: string
  updatedAt: string
}

function ActionsItemView({ data }: { data: any }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleView = (item: User) => {
    router.push(`./view?id=${item.id}`)
  }

  const handleEdit = (item: User) => {
    router.push(`./update?id=${item.id}`)
  }

  const handleDelete = async (item: User) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setIsDeleting(true)
      try {
        const path = baseAPIURL + "users/delete"
        await authPost(path, { id: item.id })
        window.location.reload()
      } catch (error) {
        console.error("Error deleting user:", error)
        alert("Failed to delete user. Please try again.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="flex items-center justify-end">
      <button
        onClick={() => handleView(data.row.original)}
        style={{
          ...theme.listView.iconButton,
          backgroundColor: theme.colors.state.hover,
          color: theme.colors.text.primary,
        }}
        title="View"
        disabled={isDeleting}
      >
        <Eye size={16} />
      </button>
      <button
        onClick={() => handleEdit(data.row.original)}
        style={{
          ...theme.listView.iconButton,
          backgroundColor: theme.colors.accent.muted,
          color: theme.colors.accent.primary,
        }}
        title="Edit"
        disabled={isDeleting}
      >
        <Edit size={16} />
      </button>
      <button
        onClick={() => handleDelete(data.row.original)}
        style={{
          ...theme.listView.iconButton,
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: theme.colors.feedback.error,
        }}
        title="Delete"
        disabled={isDeleting}
      >
        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  )
}

function UsersListView() {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [data, setData] = useState<User[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [user, token, loading] = useCurrentUser()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const router = useRouter()

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        cell: ({ getValue }) => {
          const email = getValue() as string
          return (
            <div className="flex items-center">
              <Mail size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <span style={{ color: theme.colors.text.primary }}>{email}</span>
            </div>
          )
        },
      },
      {
        id: "username",
        header: "Username",
        accessorKey: "username",
        cell: ({ getValue }) => {
          const username = getValue() as string
          return (
            <div style={{ color: theme.colors.text.secondary }}>
              {username}
            </div>
          )
        },
      },
      {
        id: "firstName",
        header: "First Name",
        accessorKey: "firstName",
        cell: ({ getValue }) => {
          const firstName = getValue() as string
          return (
            <div style={{ color: theme.colors.text.primary }}>
              {firstName}
            </div>
          )
        },
      },
      {
        id: "lastName",
        header: "Last Name",
        accessorKey: "lastName",
        cell: ({ getValue }) => {
          const lastName = getValue() as string
          return (
            <div style={{ color: theme.colors.text.primary }}>
              {lastName}
            </div>
          )
        },
      },
      {
        id: "phone",
        header: "Phone",
        accessorKey: "phone",
        cell: ({ getValue }) => {
          const phone = getValue() as string
          return phone ? (
            <div className="flex items-center">
              <Phone size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <span style={{ color: theme.colors.text.secondary }}>{phone}</span>
            </div>
          ) : null
        },
      },
      {
        id: "profilePictureURL",
        header: "Profile Picture",
        accessorKey: "profilePictureURL",
        cell: ({ getValue }) => {
          const profilePic = getValue() as string
          return (
            <div className="flex items-center">
              <User size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <IMImagesTableCell singleImageURL={profilePic} />
            </div>
          )
        },
      },
      {
        id: "banned",
        header: "Banned",
        accessorKey: "banned",
        cell: ({ getValue }) => {
          const banned = getValue() as boolean
          return (
            <div className="flex items-center justify-center">
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: banned ? theme.colors.feedback.error : theme.colors.feedback.success,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {banned ? (
                  <X size={12} color="#fff" />
                ) : (
                  <Check size={12} color="#fff" />
                )}
              </div>
            </div>
          )
        },
      },
      {
        id: "role",
        header: "Role",
        accessorKey: "role",
        cell: ({ getValue }) => {
          const role = getValue() as string
          return (
            <div className="flex items-center">
              <Shield size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <span
                style={{
                  backgroundColor: theme.colors.surface.tertiary,
                  padding: "0.25rem 0.5rem",
                  borderRadius: theme.borderRadius.sm,
                  color: theme.colors.text.secondary,
                }}
              >
                {role}
              </span>
            </div>
          )
        },
      },
      {
        id: "createdAt",
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ getValue }) => {
          const createdAt = getValue() as string
          return (
            <div className="flex items-center justify-center">
              <Calendar className="mr-2 h-4 w-4" style={{ color: theme.colors.text.tertiary }} />
              <IMDateTableCell timestamp={createdAt} />
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "actions",
        cell: (data) => <ActionsItemView data={data} />,
      },
    ],
    [],
  )

  const table = useReactTable({
    data: users,
    columns,
    state: {
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater
      setPageIndex(newState.pageIndex)
      setPageSize(newState.pageSize)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useEffect(() => {
    if (loading) {
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const config = {
          headers: { Authorization: token },
        }

        const response = await fetch(baseAPIURL + "users/list", config)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        const cleanData = data.map((item: any) => ({
          id: item.id,
          email: item.email || "",
          username: item.username || "",
          firstName: item.firstName || "",
          lastName: item.lastName || "",
          phone: item.phone || "",
          profilePictureURL: item.profilePictureURL || "",
          banned: item.banned || false,
          role: item.role || "",
          createdAt: item.createdAt || "",
          updatedAt: item.updatedAt || "",
        }))

        setData(cleanData)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError(error instanceof Error ? error.message : "Failed to load users")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [loading, token])

  useEffect(() => {
    setUsers(data)
  }, [globalFilter, data])

  return (
    <div style={{ maxWidth: theme.content.maxWidth, margin: "0 auto" }}>
      <div style={theme.listView.card}>
        <div style={theme.listView.cardHeader}>
          <h1 style={theme.listView.title}>
            <User size={24} style={{ color: theme.colors.accent.primary, marginRight: "0.5rem" }} />
            Users
          </h1>
          <button
            onClick={() => router.push("./add")}
            style={{
              ...theme.listView.actionButton,
              backgroundColor: theme.colors.accent.primary,
              color: "#ffffff",
            }}
          >
            <Plus size={18} className="mr-2" />
            Add New User
          </button>
        </div>

        <div style={theme.listView.cardBody}>
          {error ? (
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderRadius: theme.borderRadius.md,
                marginBottom: "1.5rem",
                border: `1px solid ${theme.colors.feedback.error}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <div
                  style={{
                    backgroundColor: theme.colors.feedback.error,
                    color: "white",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <AlertCircle size={16} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: theme.typography.fontSizes.lg,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.feedback.error,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Error Loading Data
                  </h3>
                  <p style={{ color: theme.colors.text.secondary }}>{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div
                style={
                  {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                  } as React.CSSProperties
                }
              >
                <div style={theme.listView.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={globalFilter || ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    style={theme.listView.searchInput}
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
                <div style={{ display: "flex", gap: "0.5rem" } as React.CSSProperties}>
                  <button
                    style={{
                      ...theme.listView.actionButton,
                      backgroundColor: theme.colors.surface.tertiary,
                      color: theme.colors.text.secondary,
                      border: `1px solid ${theme.colors.border.light}`,
                    }}
                  >
                    <Filter size={16} className="mr-2" />
                    Filters
                  </button>
                  <button
                    style={{
                      ...theme.listView.actionButton,
                      backgroundColor: theme.colors.surface.tertiary,
                      color: theme.colors.text.secondary,
                      border: `1px solid ${theme.colors.border.light}`,
                    }}
                  >
                    <SlidersHorizontal size={16} className="mr-2" />
                    Columns
                  </button>
                </div>
              </div>

              <div
                style={
                  {
                    overflow: "hidden",
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.border.light}`,
                  } as React.CSSProperties
                }
              >
                <div style={{ overflowX: "auto" } as React.CSSProperties}>
                  <table style={theme.listView.table}>
                    <thead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                          key={headerGroup.id}
                          style={{
                            backgroundColor: theme.colors.surface.tertiary,
                          }}
                        >
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              style={{
                                ...theme.listView.tableHeader,
                                color: theme.colors.text.secondary,
                                borderBottom: `1px solid ${theme.colors.border.light}`,
                              }}
                            >
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
                            colSpan={columns.length}
                            style={{
                              ...theme.listView.tableCell,
                              textAlign: "center",
                              padding: "3rem 1.5rem",
                            }}
                          >
                            <div style={theme.listView.loadingContainer}>
                              <div className="animate-spin" style={theme.listView.loadingSpinner}></div>
                              <span>Loading users...</span>
                            </div>
                          </td>
                        </tr>
                      ) : table.getRowModel().rows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={columns.length}
                            style={{
                              ...theme.listView.tableCell,
                              textAlign: "center",
                              padding: "3rem 1.5rem",
                            }}
                          >
                            <div style={theme.listView.emptyContainer}>
                              <div style={theme.listView.emptyIconContainer}>
                                <User size={32} style={{ color: theme.colors.text.tertiary }} />
                              </div>
                              <div style={theme.listView.emptyTitle}>No users found</div>
                              <div style={theme.listView.emptyMessage}>
                                Try adjusting your search or create a new user
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
                              borderBottom: `1px solid ${theme.colors.border.light}`,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.state.hover)}
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = theme.colors.surface.secondary)
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

                <div
                  style={
                    {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem 1.5rem",
                      borderTop: `1px solid ${theme.colors.border.light}`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    style={
                      {
                        fontSize: "0.875rem",
                        color: theme.colors.text.secondary,
                      } as React.CSSProperties
                    }
                  >
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length,
                    )}{" "}
                    of {table.getFilteredRowModel().rows.length} results
                  </div>

                  <div
                    style={
                      {
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      } as React.CSSProperties
                    }
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.875rem", color: theme.colors.text.secondary }}>Go to page:</span>
                      <input
                        type="number"
                        min={1}
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                          const page = e.target.value ? Number(e.target.value) - 1 : 0
                          table.setPageIndex(page)
                        }}
                        style={{
                          width: "60px",
                          padding: "0.25rem 0.5rem",
                          borderRadius: theme.borderRadius.md,
                          border: `1px solid ${theme.colors.border.light}`,
                          fontSize: "0.875rem",
                        }}
                      />
                    </div>

                    <select
                      value={table.getState().pagination.pageSize}
                      onChange={(e) => table.setPageSize(Number(e.target.value))}
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: theme.colors.surface.tertiary,
                        border: `1px solid ${theme.colors.border.light}`,
                        color: theme.colors.text.primary,
                        fontSize: "0.875rem",
                      }}
                    >
                      {[10, 20, 30, 50, 100].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize} rows
                        </option>
                      ))}
                    </select>

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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UsersListView