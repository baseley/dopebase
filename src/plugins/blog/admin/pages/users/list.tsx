"use client"

import { useEffect, useState, useRef } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type VisibilityState,
} from "@tanstack/react-table"
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
  SlidersHorizontal,
  ExternalLink,
  User,
} from "lucide-react"
import { IMDateTableCell } from "@/admin/components/forms/table"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authPost } from "@/modules/auth/utils/authFetch"
import { pluginsAPIURL } from "@/config/config"
import { theme } from "@/lib/theme"
import { useRouter } from "next/navigation"

// Add these type definitions at the top of the file, after the imports
interface UserType {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  role: string
  bio_title: string
  bio_description: string
  website_url: string
  username: string
  banned: boolean
  created_at: string
  updated_at: string
  // Add other properties as needed
}

const baseAPIURL = `${pluginsAPIURL}admin/blog/`

// Custom toggle switch component that works
const ToggleSwitch = ({
  isChecked,
  onChange,
  disabled = false,
}: {
  isChecked: boolean
  onChange: (newValue: boolean) => void
  disabled?: boolean
}) => {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "36px",
        height: "20px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
      }}
      onClick={() => {
        if (!disabled) {
          onChange(!isChecked)
        }
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isChecked ? theme.colors.feedback.success : theme.colors.text.secondary,
          borderRadius: "34px",
          transition: "0.4s",
        }}
      />
      <div
        style={{
          position: "absolute",
          height: "16px",
          width: "16px",
          left: isChecked ? "17px" : "3px",
          bottom: "2px",
          backgroundColor: "white",
          borderRadius: "50%",
          transition: "0.4s",
        }}
      />
    </div>
  )
}

function ActionsItemView({ data }: { data: UserType }) {
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

// Website URL component with clickable link
function WebsiteURL({ url }: { url: string }) {
  if (!url) return <span>-</span>

  return (
    <a
      href={url.startsWith("http") ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        color: theme.colors.accent.primary,
        textDecoration: "none",
        maxWidth: "200px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {url}
      <ExternalLink size={14} />
    </a>
  )
}

// Truncated text component
function TruncatedText({ text, maxLength = 100 }: { text: string; maxLength?: number }) {
  if (!text) return <span style={{ fontStyle: "italic", color: theme.colors.text.secondary }}>No content</span>

  const truncated = text.length > maxLength ? text.substring(0, maxLength) + "..." : text

  return (
    <div
      style={{
        maxWidth: "300px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        position: "relative",
      }}
      title={text}
    >
      <div className="markdownReadOnly">{truncated}</div>
    </div>
  )
}

export const UsersListView = () => {
  const [users, setUsers] = useState<UserType[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, token, loading] = useCurrentUser()
  const router = useRouter()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsColumnSelectorOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Define all possible columns
  const allColumns: ColumnDef<UserType>[] = [
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      cell: ({ getValue }) => <div>{getValue() as string}</div>,
    },
    {
      id: "first_name",
      header: "First Name",
      accessorKey: "first_name",
      cell: ({ getValue }) => <div>{getValue() as string}</div>,
    },
    {
      id: "last_name",
      header: "Last Name",
      accessorKey: "last_name",
      cell: ({ getValue }) => <div>{getValue() as string}</div>,
    },
    {
      id: "username",
      header: "Username",
      accessorKey: "username",
      cell: ({ getValue }) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <User size={14} style={{ color: theme.colors.text.secondary }} />
          <span>{(getValue() as string) || "-"}</span>
        </div>
      ),
    },
    {
      id: "phone",
      header: "Phone",
      accessorKey: "phone",
      cell: ({ getValue }) => <div>{(getValue() as string) || "-"}</div>,
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      cell: ({ getValue }) => (
        <div
          style={{
            display: "inline-block",
            padding: "2px 8px",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            color: "#6366F1", // indigo-500
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          {(getValue() as string) || "User"}
        </div>
      ),
    },
    {
      id: "bio_title",
      header: "Short Bio",
      accessorKey: "bio_title",
      cell: ({ getValue }) => <TruncatedText text={getValue() as string} maxLength={50} />,
    },
    {
      id: "bio_description",
      header: "Long Bio",
      accessorKey: "bio_description",
      cell: ({ getValue }) => <TruncatedText text={getValue() as string} />,
    },
    {
      id: "website_url",
      header: "Website URL",
      accessorKey: "website_url",
      cell: ({ getValue }) => <WebsiteURL url={getValue() as string} />,
    },
    {
      id: "banned",
      header: "Banned",
      accessorKey: "banned",
      cell: ({ getValue, row }) => {
        const value = getValue() as boolean
        return (
          <ToggleSwitch
            isChecked={value}
            onChange={async (newValue) => {
              try {
                // In a real app, you would update the server here
                const path = baseAPIURL + "users/update"
                await authPost(path, {
                  id: row.original.id,
                  banned: newValue,
                })

                // Update the local state
                const updatedUsers = [...users]
                const userIndex = updatedUsers.findIndex((u) => u.id === row.original.id)
                if (userIndex !== -1) {
                  updatedUsers[userIndex] = {
                    ...updatedUsers[userIndex],
                    banned: newValue,
                  }
                  setUsers(updatedUsers)
                }
              } catch (error) {
                console.error("Error updating banned status:", error)
                alert("Failed to update banned status. Please try again.")
              }
            }}
          />
        )
      },
    },
    {
      id: "created_at",
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ getValue }) => <IMDateTableCell timestamp={getValue() as string} />,
    },
    {
      id: "updated_at",
      header: "Updated At",
      accessorKey: "updated_at",
      cell: ({ getValue }) => <IMDateTableCell timestamp={getValue() as string} />,
    },
    {
      id: "actions",
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => <ActionsItemView data={row.original} />,
    },
  ]

  // Set default visible columns - show fewer columns by default to prevent overflow
  useEffect(() => {
    setColumnVisibility({
      email: true,
      first_name: true,
      last_name: true,
      role: true,
      banned: true,
      created_at: true,
      actions: true,
    })
  }, [])

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

  const table = useReactTable<UserType>({
    data: users,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel<UserType>(),
    getPaginationRowModel: getPaginationRowModel<UserType>(),
    getFilteredRowModel: getFilteredRowModel<UserType>(),
    state: {
      globalFilter,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
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

  const toggleColumnSelector = () => {
    setIsColumnSelectorOpen(!isColumnSelectorOpen)
  }

  // Create column groups for better organization
  const columnGroups = [
    {
      name: "Basic Info",
      columns: ["email", "first_name", "last_name", "username", "phone"],
    },
    {
      name: "Profile",
      columns: ["role", "bio_title", "bio_description", "website_url"],
    },
    {
      name: "Admin",
      columns: ["banned"],
    },
    {
      name: "Timestamps",
      columns: ["created_at", "updated_at"],
    },
  ]

  // Column presets
  const columnPresets = {
    essential: () => {
      setColumnVisibility({
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        banned: true,
        actions: true,
      })
    },
    profile: () => {
      setColumnVisibility({
        email: true,
        first_name: true,
        last_name: true,
        username: true,
        bio_title: true,
        website_url: true,
        actions: true,
      })
    },
    admin: () => {
      setColumnVisibility({
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        banned: true,
        created_at: true,
        updated_at: true,
        actions: true,
      })
    },
    all: () => {
      const allVisible = allColumns.reduce(
        (acc, column) => {
          acc[column.id] = true
          return acc
        },
        {} as Record<string, boolean>,
      )
      setColumnVisibility(allVisible)
    },
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
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={toggleColumnSelector}
              style={{
                ...theme.listView.actionButton,
                backgroundColor: isColumnSelectorOpen ? "rgba(13, 148, 255, 0.15)" : theme.colors.surface.tertiary,
                color: isColumnSelectorOpen ? theme.colors.accent.primary : theme.colors.text.primary,
                padding: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              title="Customize columns"
            >
              <SlidersHorizontal size={16} />
              <span>Columns</span>
            </button>

            {isColumnSelectorOpen && (
              <div
                ref={dropdownRef}
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "4px",
                  backgroundColor: theme.colors.surface.primary,
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  padding: "12px",
                  zIndex: 10,
                  width: "250px",
                  border: `1px solid ${theme.colors.border.default}`,
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{ marginBottom: "8px", fontWeight: 600, fontSize: "14px", color: theme.colors.text.primary }}
                >
                  Toggle Columns
                </div>

                {/* Preset buttons */}
                <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
                  <button
                    onClick={() => columnPresets.essential()}
                    style={{
                      border: "none",
                      background: "rgba(0,0,0,0.05)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: theme.colors.text.primary,
                    }}
                  >
                    Essential
                  </button>
                  <button
                    onClick={() => columnPresets.profile()}
                    style={{
                      border: "none",
                      background: "rgba(0,0,0,0.05)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: theme.colors.text.primary,
                    }}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => columnPresets.admin()}
                    style={{
                      border: "none",
                      background: "rgba(0,0,0,0.05)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: theme.colors.text.primary,
                    }}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => columnPresets.all()}
                    style={{
                      border: "none",
                      background: "rgba(0,0,0,0.05)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: theme.colors.text.primary,
                    }}
                  >
                    All
                  </button>
                </div>

                {columnGroups.map((group) => (
                  <div key={group.name} style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: "13px",
                        color: theme.colors.text.secondary,
                        marginBottom: "4px",
                        borderBottom: `1px solid ${theme.colors.border.default}`,
                        paddingBottom: "2px",
                      }}
                    >
                      {group.name}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {group.columns.map((columnId) => {
                        const column = allColumns.find((col) => col.id === columnId)
                        if (!column) return null

                        return (
                          <label
                            key={column.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                              padding: "2px 0",
                              fontSize: "14px",
                              color: theme.colors.text.primary,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={column.id === "actions" ? true : !!table.getState().columnVisibility[column.id]}
                              onChange={(e) => {
                                if (column.id === "actions") return // Don't allow toggling actions column
                                table.toggleColumnVisibility(column.id, e.target.checked)
                              }}
                              disabled={column.id === "actions"} // Actions column is always visible
                              style={{ cursor: "pointer" }}
                            />
                            {column.header as string}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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

        {/* Simple table with horizontal scroll */}
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ ...theme.listView.table, minWidth: "100%" }}>
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
                    colSpan={Object.keys(columnVisibility).filter((key) => columnVisibility[key]).length || 1}
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
                    colSpan={Object.keys(columnVisibility).filter((key) => columnVisibility[key]).length || 1}
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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
          <div style={{ fontSize: "14px", color: theme.colors.text.secondary }}>
            Showing {table.getRowModel().rows.length} of {users.length} results
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

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", color: theme.colors.text.secondary }}>Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                border: `1px solid ${theme.colors.border.default}`,
                backgroundColor: theme.colors.surface.primary,
                color: theme.colors.text.primary,
                fontSize: "14px",
              }}
            >
              {[10, 20, 30, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersListView
