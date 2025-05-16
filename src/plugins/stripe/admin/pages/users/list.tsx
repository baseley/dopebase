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
  type ColumnPinningState,
  type Column,
} from "@tanstack/react-table"
import {
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
  Pin,
  PinOff,
  Car,
} from "lucide-react"
import { IMDateTableCell, IMImagesTableCell } from "@/admin/components/forms/table"
import { IMToggleSwitchComponent } from "@/admin/components/forms/fields"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authPost } from "@/modules/auth/utils/authFetch"
import { pluginsAPIURL } from "@/config/config"
import { theme } from "@/lib/theme"
import { useRouter } from "next/navigation"

// Add these type definitions at the top of the file, after the imports
interface UserType {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: string
  carPictureURL: string
  carName: string
  carNumber: string
  banned: boolean
  createdAt: string
  updatedAt: string
  // Add other properties as needed
}

const baseAPIURL = `${pluginsAPIURL}admin/stripe/`

// Column header with pin button
function ColumnHeader({
  column,
  title,
}: {
  column: Column<UserType, unknown>
  title: string
}) {
  const isPinned = column.getIsPinned()

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
      <span>{title}</span>
      {column.id !== "actions" && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (isPinned) {
              column.pin(false)
            } else {
              column.pin("left")
            }
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isPinned ? theme.colors.accent.primary : theme.colors.text.secondary,
          }}
          title={isPinned ? "Unpin column" : "Pin column"}
        >
          {isPinned ? <PinOff size={12} /> : <Pin size={12} />}
        </button>
      )}
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

export const UsersListView = () => {
  const [users, setUsers] = useState<UserType[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, token, loading] = useCurrentUser()
  const router = useRouter()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["email"],
    right: ["actions"],
  })
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
      header: ({ column }) => <ColumnHeader column={column} title="Email" />,
      accessorKey: "email",
      cell: ({ getValue }) => <div>{getValue() as string}</div>,
      size: 200,
    },
    {
      id: "firstName",
      header: ({ column }) => <ColumnHeader column={column} title="First Name" />,
      accessorKey: "firstName",
      cell: ({ getValue }) => <div>{getValue() as string}</div>,
      size: 150,
    },
    {
      id: "lastName",
      header: ({ column }) => <ColumnHeader column={column} title="Last Name" />,
      accessorKey: "lastName",
      cell: ({ getValue }) => <div>{getValue() as string}</div>,
      size: 150,
    },
    {
      id: "phone",
      header: ({ column }) => <ColumnHeader column={column} title="Phone" />,
      accessorKey: "phone",
      cell: ({ getValue }) => <div>{(getValue() as string) || "-"}</div>,
      size: 150,
    },
    {
      id: "role",
      header: ({ column }) => <ColumnHeader column={column} title="Role" />,
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
      size: 120,
    },
    {
      id: "carPictureURL",
      header: ({ column }) => <ColumnHeader column={column} title="Car Photo" />,
      accessorKey: "carPictureURL",
      cell: ({ getValue }) => <IMImagesTableCell singleImageURL={getValue() as string} />,
      size: 120,
    },
    {
      id: "carName",
      header: ({ column }) => <ColumnHeader column={column} title="Car Model" />,
      accessorKey: "carName",
      cell: ({ getValue }) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Car size={14} style={{ color: theme.colors.text.secondary }} />
          <span>{(getValue() as string) || "-"}</span>
        </div>
      ),
      size: 150,
    },
    {
      id: "carNumber",
      header: ({ column }) => <ColumnHeader column={column} title="License Plate" />,
      accessorKey: "carNumber",
      cell: ({ getValue }) => <div>{(getValue() as string) || "-"}</div>,
      size: 150,
    },
    {
      id: "banned",
      header: ({ column }) => <ColumnHeader column={column} title="Banned" />,
      accessorKey: "banned",
      cell: ({ getValue }) => <IMToggleSwitchComponent isChecked={getValue() as boolean} disabled />,
      size: 100,
    },
    {
      id: "createdAt",
      header: ({ column }) => <ColumnHeader column={column} title="Created At" />,
      accessorKey: "createdAt",
      cell: ({ getValue }) => <IMDateTableCell timestamp={getValue() as string} />,
      size: 180,
    },
    {
      id: "updatedAt",
      header: ({ column }) => <ColumnHeader column={column} title="Updated At" />,
      accessorKey: "updatedAt",
      cell: ({ getValue }) => <IMDateTableCell timestamp={getValue() as string} />,
      size: 180,
    },
    {
      id: "actions",
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => <ActionsItemView data={row.original} />,
      size: 120,
    },
  ]

  // Set all columns visible by default
  useEffect(() => {
    const allVisible = allColumns.reduce(
      (acc, column) => {
        acc[column.id] = true
        return acc
      },
      {} as Record<string, boolean>,
    )
    setColumnVisibility(allVisible)
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
      columnPinning,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
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
      columns: ["email", "firstName", "lastName", "phone", "role"],
    },
    {
      name: "Vehicle Info",
      columns: ["carPictureURL", "carName", "carNumber"],
    },
    {
      name: "Admin",
      columns: ["banned"],
    },
    {
      name: "Timestamps",
      columns: ["createdAt", "updatedAt"],
    },
  ]

  if (error) {
    return (
      <div className="Card">
        <div className="CardHeader">
          <h1>
            <Users size={24} style={{ color: theme.colors.accent.primary }} />
            Users
          </h1>
        </div>
        <div className="CardBody">
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
    <div className="Card">
      <div className="CardHeader">
        <h1>Users</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={toggleColumnSelector}
              style={{
                backgroundColor: isColumnSelectorOpen ? "rgba(13, 148, 255, 0.15)" : theme.colors.surface.tertiary,
                color: isColumnSelectorOpen ? theme.colors.accent.primary : theme.colors.text.primary,
                padding: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
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

                <div
                  style={{
                    marginTop: "12px",
                    borderTop: `1px solid ${theme.colors.border.default}`,
                    paddingTop: "12px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: "13px",
                      color: theme.colors.text.secondary,
                      marginBottom: "8px",
                    }}
                  >
                    Pin Columns
                  </div>
                  <p style={{ fontSize: "12px", color: theme.colors.text.secondary, marginBottom: "8px" }}>
                    Click the pin icon in any column header to pin/unpin that column.
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => {
                        setColumnPinning({
                          left: ["email"],
                          right: ["actions"],
                        })
                      }}
                      style={{
                        flex: 1,
                        padding: "6px",
                        fontSize: "12px",
                        backgroundColor: theme.colors.surface.tertiary,
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: theme.colors.text.primary,
                      }}
                    >
                      Reset Pins
                    </button>
                    <button
                      onClick={() => {
                        setColumnPinning({
                          left: ["email", "firstName", "lastName"],
                          right: ["actions"],
                        })
                      }}
                      style={{
                        flex: 1,
                        padding: "6px",
                        fontSize: "12px",
                        backgroundColor: theme.colors.accent.primary,
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "white",
                      }}
                    >
                      Pin Names
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <a
            href="./add"
            className="AddLink"
            style={{
              backgroundColor: theme.colors.accent.primary,
              color: "white",
              padding: "8px 16px",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Add New
          </a>
        </div>
      </div>
      <div className="CardBody">
        <div className="TableContainer">
          <input
            className="SearchInput"
            type="text"
            placeholder="Search users..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />

          <div
            style={{
              fontSize: "12px",
              color: theme.colors.text.secondary,
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Pin size={12} /> Tip: Click pin icons in headers to pin important columns
          </div>

          <div className="table-responsive" style={{ width: "100%", overflow: "auto" }}>
            <table className="Table" style={{ minWidth: "100%" }}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{
                          position: header.column.getIsPinned() ? "sticky" : "relative",
                          left:
                            header.column.getIsPinned() === "left" ? `${header.column.getStart("left")}px` : undefined,
                          right:
                            header.column.getIsPinned() === "right"
                              ? `${header.column.getStart("right")}px`
                              : undefined,
                          backgroundColor: header.column.getIsPinned()
                            ? theme.colors.surface.primary
                            : theme.colors.surface.secondary,
                          zIndex: header.column.getIsPinned() ? 1 : 0,
                          boxShadow: header.column.getIsPinned() ? `0 0 5px rgba(0,0,0,0.1)` : "none",
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
                      colSpan={Object.keys(columnVisibility).filter((key) => columnVisibility[key]).length || 1}
                      style={{ textAlign: "center", padding: "24px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                        <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
                        Loading users...
                      </div>
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={Object.keys(columnVisibility).filter((key) => columnVisibility[key]).length || 1}
                      style={{ textAlign: "center", padding: "24px" }}
                    >
                      <div>
                        <div style={{ marginBottom: "12px" }}>
                          <Users size={32} style={{ color: theme.colors.text.secondary }} />
                        </div>
                        <div style={{ fontWeight: 500, marginBottom: "4px" }}>No users found</div>
                        <div style={{ color: theme.colors.text.secondary }}>
                          Try adjusting your search or add new users to your collection.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{
                            position: cell.column.getIsPinned() ? "sticky" : "relative",
                            left:
                              cell.column.getIsPinned() === "left" ? `${cell.column.getStart("left")}px` : undefined,
                            right:
                              cell.column.getIsPinned() === "right" ? `${cell.column.getStart("right")}px` : undefined,
                            backgroundColor: "inherit",
                            zIndex: cell.column.getIsPinned() ? 1 : 0,
                            boxShadow: cell.column.getIsPinned() ? `0 0 5px rgba(0,0,0,0.1)` : "none",
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
                <tr>
                  <td colSpan={Object.keys(columnVisibility).filter((key) => columnVisibility[key]).length || 1}>
                    <p className="PaginationDetails">
                      Showing {table.getRowModel().rows.length} of {users.length} results
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="Pagination">
            <div className="LeftPaginationButtons">
              <button
                onClick={() => table.setPageIndex(0)}
                className="PaginationButton"
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => table.previousPage()}
                className="PaginationButton"
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft size={16} />
              </button>
            </div>
            <div className="CenterPaginationButtons">
              <span>
                Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
                <strong>{table.getPageCount()}</strong>
              </span>
              <span>
                | Go to page:{" "}
                <input
                  type="number"
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    table.setPageIndex(page)
                  }}
                  style={{ width: "100px" }}
                />
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value))
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="RightPaginationButtons">
              <button onClick={() => table.nextPage()} className="PaginationButton" disabled={!table.getCanNextPage()}>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                className="PaginationButton"
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersListView
