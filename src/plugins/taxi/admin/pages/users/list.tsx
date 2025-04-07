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
  type VisibilityState,
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
  UserCog,
  Car,
  FileText,
  Ban,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react"
import { IMImagesTableCell, IMDateTableCell, IMForeignKeyTableCell } from "@/admin/components/forms/table"
import { pluginsAPIURL } from "@/config/config"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authPost } from "@/modules/auth/utils/authFetch"
import { theme } from "@/lib/theme"
import type React from "react"

const baseAPIURL = `${pluginsAPIURL}admin/taxi/`

interface UserType {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: string
  profilePictureURL: string | null
  licensePictureURL: string | null
  carPictureURL: string | null
  carName: string | null
  carNumber: string | null
  carType: string | null
  inProgressOrderID: string | null
  banned: boolean
  createdAt: string
  updatedAt: string
}

function ActionsItemView({ data }: { data: any }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleView = (item: UserType) => {
    router.push(`./view?id=${item.id}`)
  }

  const handleEdit = (item: UserType) => {
    router.push(`./update?id=${item.id}`)
  }

  const handleDelete = async (item: UserType) => {
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
  const [users, setUsers] = useState<UserType[]>([])
  const [data, setData] = useState<UserType[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [user, token, loading] = useCurrentUser()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const router = useRouter()

  // Define all available columns
  const allColumns = useMemo<ColumnDef<UserType>[]>(
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
              <span style={{ fontWeight: 500 }}>{email}</span>
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
          return <div style={theme.listView.nameCell}>{firstName}</div>
        },
      },
      {
        id: "lastName",
        header: "Last Name",
        accessorKey: "lastName",
        cell: ({ getValue }) => {
          const lastName = getValue() as string
          return <div style={theme.listView.nameCell}>{lastName}</div>
        },
      },
      {
        id: "fullName",
        header: "Full Name",
        accessorFn: (row) => `${row.firstName || ""} ${row.lastName || ""}`.trim(),
        cell: ({ getValue }) => {
          const fullName = getValue() as string
          return (
            <div className="flex items-center">
              <User size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <span style={{ fontWeight: 500 }}>{fullName || "-"}</span>
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
          return (
            <div className="flex items-center">
              <Phone size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <span style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>{phone || "-"}</span>
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

          let roleColor = theme.colors.accent.primary
          let roleBg = theme.colors.accent.muted

          if (role?.toLowerCase().includes("admin")) {
            roleColor = theme.colors.feedback.error
            roleBg = "rgba(239, 68, 68, 0.15)"
          } else if (role?.toLowerCase().includes("driver")) {
            roleColor = theme.colors.feedback.info
            roleBg = "rgba(59, 130, 246, 0.15)"
          } else if (role?.toLowerCase().includes("passenger")) {
            roleColor = theme.colors.feedback.success
            roleBg = "rgba(16, 185, 129, 0.15)"
          }

          return (
            <div className="flex justify-center">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  backgroundColor: roleBg,
                  color: roleColor,
                }}
              >
                <UserCog size={14} className="mr-1" />
                {role || "User"}
              </span>
            </div>
          )
        },
      },
      {
        id: "profilePictureURL",
        header: "Profile Picture",
        accessorKey: "profilePictureURL",
        cell: ({ getValue }) => {
          const profilePictureURL = getValue() as string | null
          return (
            <div className="flex justify-center">
              {profilePictureURL ? (
                <div
                  className="relative h-10 w-10 rounded-full overflow-hidden border"
                  style={{ borderColor: theme.colors.border.light }}
                >
                  <IMImagesTableCell singleImageURL={profilePictureURL} />
                </div>
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.colors.surface.tertiary }}
                >
                  <User className="h-5 w-5" style={{ color: theme.colors.text.tertiary }} />
                </div>
              )}
            </div>
          )
        },
      },
      {
        id: "licensePictureURL",
        header: "License Picture",
        accessorKey: "licensePictureURL",
        cell: ({ getValue }) => {
          const licensePictureURL = getValue() as string | null
          return (
            <div className="flex justify-center">
              {licensePictureURL ? (
                <div
                  className="relative h-10 w-10 rounded-md overflow-hidden border"
                  style={{ borderColor: theme.colors.border.light }}
                >
                  <IMImagesTableCell singleImageURL={licensePictureURL} />
                </div>
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-md"
                  style={{ backgroundColor: theme.colors.surface.tertiary }}
                >
                  <FileText className="h-5 w-5" style={{ color: theme.colors.text.tertiary }} />
                </div>
              )}
            </div>
          )
        },
      },
      {
        id: "carPictureURL",
        header: "Car Photo",
        accessorKey: "carPictureURL",
        cell: ({ getValue }) => {
          const carPictureURL = getValue() as string | null
          return (
            <div className="flex justify-center">
              {carPictureURL ? (
                <div
                  className="relative h-10 w-16 rounded-md overflow-hidden border"
                  style={{ borderColor: theme.colors.border.light }}
                >
                  <IMImagesTableCell singleImageURL={carPictureURL} />
                </div>
              ) : (
                <div
                  className="flex h-10 w-16 items-center justify-center rounded-md"
                  style={{ backgroundColor: theme.colors.surface.tertiary }}
                >
                  <Car className="h-5 w-5" style={{ color: theme.colors.text.tertiary }} />
                </div>
              )}
            </div>
          )
        },
      },
      {
        id: "carName",
        header: "Car Model",
        accessorKey: "carName",
        cell: ({ getValue }) => {
          const carName = getValue() as string | null
          return (
            <div className="flex items-center">
              <Car size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <span>{carName || "-"}</span>
            </div>
          )
        },
      },
      {
        id: "carNumber",
        header: "License Plate",
        accessorKey: "carNumber",
        cell: ({ getValue }) => {
          const carNumber = getValue() as string | null
          return carNumber ? (
            <div
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                backgroundColor: theme.colors.surface.tertiary,
                borderRadius: "0.25rem",
                fontFamily: "monospace",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.05em",
                textAlign: "center",
              }}
            >
              {carNumber}
            </div>
          ) : (
            <span style={{ color: theme.colors.text.tertiary }}>-</span>
          )
        },
      },
      {
        id: "carType",
        header: "Car Type",
        accessorKey: "carType",
        cell: ({ getValue }) => {
          const carType = getValue() as string | null
          return carType ? (
            <div className="flex items-center justify-center">
              <IMForeignKeyTableCell
                id={carType}
                apiRouteName="admin/taxi/taxi_car_categories"
                viewRoute="taxi_car_categories"
                titleKey="name"
              />
            </div>
          ) : (
            <span style={{ color: theme.colors.text.tertiary }}>-</span>
          )
        },
      },
      {
        id: "inProgressOrderID",
        header: "In Progress Trip",
        accessorKey: "inProgressOrderID",
        cell: ({ getValue }) => {
          const inProgressOrderID = getValue() as string | null
          return inProgressOrderID ? (
            <div className="flex items-center justify-center">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  color: theme.colors.feedback.warning,
                }}
              >
                <Clock size={14} className="mr-1" />
                <IMForeignKeyTableCell
                  id={inProgressOrderID}
                  apiRouteName="admin/taxi/taxi_trips"
                  viewRoute="taxi_trips"
                  titleKey="id"
                />
              </span>
            </div>
          ) : (
            <div className="flex justify-center">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: theme.colors.feedback.success,
                }}
              >
                <CheckCircle size={14} className="mr-1" />
                Available
              </span>
            </div>
          )
        },
      },
      {
        id: "banned",
        header: "Status",
        accessorKey: "banned",
        cell: ({ getValue }) => {
          const banned = getValue() as boolean
          return (
            <div className="flex justify-center">
              {banned ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                    color: theme.colors.feedback.error,
                  }}
                >
                  <Ban size={14} className="mr-1" />
                  Banned
                </span>
              ) : (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    color: theme.colors.feedback.success,
                  }}
                >
                  <CheckCircle size={14} className="mr-1" />
                  Active
                </span>
              )}
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
        id: "updatedAt",
        header: "Updated At",
        accessorKey: "updatedAt",
        cell: ({ getValue }) => {
          const updatedAt = getValue() as string
          return (
            <div className="flex items-center justify-center">
              <Clock className="mr-2 h-4 w-4" style={{ color: theme.colors.text.tertiary }} />
              <IMDateTableCell timestamp={updatedAt} />
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

  // Default visible columns
  const defaultVisibleColumns = useMemo(
    () => ({
      email: true,
      fullName: true,
      phone: true,
      role: true,
      profilePictureURL: true,
      banned: true,
      carName: false,
      carNumber: false,
      carType: false,
      carPictureURL: false,
      licensePictureURL: false,
      inProgressOrderID: false,
      firstName: false,
      lastName: false,
      createdAt: false,
      updatedAt: false,
      actions: true,
    }),
    [],
  )

  // Set default column visibility on first render
  useEffect(() => {
    setColumnVisibility(defaultVisibleColumns)
  }, [defaultVisibleColumns])

  const table = useReactTable({
    data: users,
    columns: allColumns,
    state: {
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
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

        // Check if data is an error message
        if (data.error) {
          throw new Error(data.error)
        }

        setData(data)
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
            <Users size={24} style={{ color: theme.colors.accent.primary, marginRight: "0.5rem" }} />
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
                  <XCircle size={16} />
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
                  <div style={{ position: "relative" } as React.CSSProperties}>
                    <button
                      onClick={() => setShowColumnSelector(!showColumnSelector)}
                      style={{
                        ...theme.listView.actionButton,
                        backgroundColor: showColumnSelector ? theme.colors.accent.muted : theme.colors.surface.tertiary,
                        color: showColumnSelector ? theme.colors.accent.primary : theme.colors.text.secondary,
                        border: `1px solid ${
                          showColumnSelector ? theme.colors.accent.primary : theme.colors.border.light
                        }`,
                      }}
                    >
                      <SlidersHorizontal size={16} className="mr-2" />
                      Columns
                    </button>

                    {showColumnSelector && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "calc(100% + 0.5rem)",
                          backgroundColor: theme.colors.surface.primary,
                          border: `1px solid ${theme.colors.border.light}`,
                          borderRadius: theme.borderRadius.md,
                          padding: "0.75rem",
                          boxShadow: theme.shadows.md,
                          zIndex: 50,
                          width: "220px",
                          maxHeight: "400px",
                          overflowY: "auto",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            marginBottom: "0.5rem",
                            paddingBottom: "0.5rem",
                            borderBottom: `1px solid ${theme.colors.border.light}`,
                            color: theme.colors.text.primary,
                          }}
                        >
                          Toggle Columns
                        </div>
                        {allColumns.map((column) => {
                          // Skip the actions column
                          if (column.id === "actions") return null

                          return (
                            <div
                              key={column.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "0.5rem",
                                fontSize: "0.875rem",
                                color: theme.colors.text.primary,
                              }}
                            >
                              <input
                                type="checkbox"
                                id={`column-${column.id}`}
                                checked={table.getColumn(column.id)?.getIsVisible() ?? false}
                                onChange={(e) => {
                                  table.getColumn(column.id)?.toggleVisibility(e.target.checked)
                                }}
                                style={{ marginRight: "0.5rem" }}
                              />
                              <label htmlFor={`column-${column.id}`}>
                                {typeof column.header === "string"
                                  ? column.header
                                  : column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                              </label>
                            </div>
                          )
                        })}
                        <div
                          style={{
                            marginTop: "0.75rem",
                            paddingTop: "0.75rem",
                            borderTop: `1px solid ${theme.colors.border.light}`,
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <button
                            onClick={() => {
                              // Show all columns
                              const allVisible = allColumns.reduce(
                                (acc, column) => {
                                  if (column.id !== "actions") {
                                    acc[column.id] = true
                                  }
                                  return acc
                                },
                                {} as Record<string, boolean>,
                              )
                              setColumnVisibility({ ...allVisible, actions: true })
                            }}
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.25rem 0.5rem",
                              backgroundColor: theme.colors.surface.tertiary,
                              borderRadius: theme.borderRadius.sm,
                              border: `1px solid ${theme.colors.border.light}`,
                            }}
                          >
                            Show All
                          </button>
                          <button
                            onClick={() => {
                              // Reset to default
                              setColumnVisibility(defaultVisibleColumns)
                            }}
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.25rem 0.5rem",
                              backgroundColor: theme.colors.accent.muted,
                              color: theme.colors.accent.primary,
                              borderRadius: theme.borderRadius.sm,
                              border: `1px solid ${theme.colors.accent.primary}30`,
                            }}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
                            colSpan={table.getVisibleFlatColumns().length}
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
                            colSpan={table.getVisibleFlatColumns().length}
                            style={{
                              ...theme.listView.tableCell,
                              textAlign: "center",
                              padding: "3rem 1.5rem",
                            }}
                          >
                            <div style={theme.listView.emptyContainer}>
                              <div style={theme.listView.emptyIconContainer}>
                                <Users size={32} style={{ color: theme.colors.text.tertiary }} />
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

