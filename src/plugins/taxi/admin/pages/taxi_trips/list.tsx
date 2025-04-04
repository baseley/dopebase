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
  User,
  Car,
  DollarSign,
  Route,
  Calendar,
  Clock,
  X,
  Navigation,
  Check,
} from "lucide-react"
import {
  IMLocationTableCell,
  IMDateTableCell,
  IMForeignKeyTableCell,
  IMObjectTableCell,
} from "@/admin/components/forms/table"
import { pluginsAPIURL } from "@/config/config"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authPost } from "@/modules/auth/utils/authFetch"
import { theme } from "@/lib/theme"
import type React from "react"
import TaxiTripPassengerObjectTableCell from "@/plugins/taxi/admin/components/tableCells/TaxiTripPassengerObjectTableCell"

const baseAPIURL = `${pluginsAPIURL}admin/taxi/`

interface Trip {
  id: string
  pickup: any
  dropoff: any
  status: string
  passenger: any
  passengerID: string
  carType: string
  priceRange: string
  ride: any
  carDrive: any
  createdAt: string
  updatedAt?: string
}

function ActionsItemView({ data }: { data: any }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleView = (item: Trip) => {
    router.push(`./view?id=${item.id}`)
  }

  const handleEdit = (item: Trip) => {
    router.push(`./update?id=${item.id}`)
  }

  const handleDelete = async (item: Trip) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      setIsDeleting(true)
      try {
        const path = baseAPIURL + "taxi_trips/delete"
        await authPost(path, { id: item.id })
        window.location.reload()
      } catch (error) {
        console.error("Error deleting trip:", error)
        alert("Failed to delete trip. Please try again.")
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

function TripsListView() {
  const [isLoading, setIsLoading] = useState(true)
  const [trips, setTrips] = useState<Trip[]>([])
  const [data, setData] = useState<Trip[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [user, token, loading] = useCurrentUser()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const router = useRouter()

  // Define all available columns
  const allColumns = useMemo<ColumnDef<Trip>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        accessorKey: "id",
        cell: ({ getValue }) => <div style={theme.listView.idCell}>{String(getValue())}</div>,
      },
      {
        id: "pickup",
        header: "Pickup Location",
        accessorKey: "pickup",
        cell: ({ getValue }) => {
          const pickup = getValue()
          return (
            <div className="flex justify-center">
              <div
                style={{
                  maxWidth: "200px",
                  overflow: "hidden",
                }}
              >
                <IMLocationTableCell data={pickup} />
              </div>
            </div>
          )
        },
      },
      {
        id: "dropoff",
        header: "Dropoff Location",
        accessorKey: "dropoff",
        cell: ({ getValue }) => {
          const dropoff = getValue()
          return (
            <div className="flex justify-center">
              <div
                style={{
                  maxWidth: "200px",
                  overflow: "hidden",
                }}
              >
                <IMLocationTableCell data={dropoff} />
              </div>
            </div>
          )
        },
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const status = getValue() as string

          let statusColor = theme.colors.feedback.info
          let statusBg = "rgba(59, 130, 246, 0.15)"
          let statusIcon = <Clock size={14} className="mr-1" />

          if (status?.toLowerCase().includes("completed")) {
            statusColor = theme.colors.feedback.success
            statusBg = "rgba(16, 185, 129, 0.15)"
            statusIcon = <Check size={14} className="mr-1" />
          } else if (status?.toLowerCase().includes("cancelled")) {
            statusColor = theme.colors.feedback.error
            statusBg = "rgba(239, 68, 68, 0.15)"
            statusIcon = <X size={14} className="mr-1" />
          } else if (status?.toLowerCase().includes("in progress")) {
            statusColor = theme.colors.accent.primary
            statusBg = theme.colors.accent.muted
            statusIcon = <Navigation size={14} className="mr-1" />
          } else if (status?.toLowerCase().includes("pending")) {
            statusColor = theme.colors.feedback.warning
            statusBg = "rgba(245, 158, 11, 0.15)"
            statusIcon = <Clock size={14} className="mr-1" />
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
                  backgroundColor: statusBg,
                  color: statusColor,
                }}
              >
                {statusIcon}
                {status || "Unknown"}
              </span>
            </div>
          )
        },
      },
      {
        id: "passenger",
        header: "Passenger",
        accessorKey: "passenger",
        cell: ({ getValue }) => {
          const passenger = getValue()
          return (
            <div className="flex justify-center">
              <div
                style={{
                  maxWidth: "200px",
                  overflow: "hidden",
                }}
              >
                <TaxiTripPassengerObjectTableCell data={passenger} />
              </div>
            </div>
          )
        },
      },
      {
        id: "passengerID",
        header: "Passenger ID",
        accessorKey: "passengerID",
        cell: ({ getValue }) => {
          const passengerID = getValue() as string
          return (
            <div className="flex items-center">
              <User size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <IMForeignKeyTableCell
                id={passengerID}
                apiRouteName="admin/taxi/users"
                viewRoute="users"
                titleKey="email"
              />
            </div>
          )
        },
      },
      {
        id: "carType",
        header: "Car Type",
        accessorKey: "carType",
        cell: ({ getValue }) => {
          const carType = getValue() as string
          return (
            <div className="flex items-center">
              <Car size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <IMForeignKeyTableCell
                id={carType}
                apiRouteName="admin/taxi/taxi_car_categories"
                viewRoute="taxi_car_categories"
                titleKey="name"
              />
            </div>
          )
        },
      },
      {
        id: "priceRange",
        header: "Price Range",
        accessorKey: "priceRange",
        cell: ({ getValue }) => {
          const priceRange = getValue() as string
          return (
            <div className="flex items-center justify-center">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: theme.colors.feedback.success,
                }}
              >
                <DollarSign size={14} className="mr-1" />
                {priceRange || "-"}
              </span>
            </div>
          )
        },
      },
      {
        id: "ride",
        header: "Ride",
        accessorKey: "ride",
        cell: ({ getValue }) => {
          const ride = getValue()
          return (
            <div className="flex justify-center">
              <div
                style={{
                  maxWidth: "200px",
                  overflow: "hidden",
                  padding: "0.5rem",
                  backgroundColor: theme.colors.surface.tertiary,
                  borderRadius: theme.borderRadius.md,
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                }}
              >
                <IMObjectTableCell data={ride} />
              </div>
            </div>
          )
        },
      },
      {
        id: "carDrive",
        header: "Current Location",
        accessorKey: "carDrive",
        cell: ({ getValue }) => {
          const carDrive = getValue()
          return (
            <div className="flex justify-center">
              <div
                style={{
                  maxWidth: "200px",
                  overflow: "hidden",
                }}
              >
                <IMLocationTableCell data={carDrive} />
              </div>
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
          return updatedAt ? (
            <div className="flex items-center justify-center">
              <Clock className="mr-2 h-4 w-4" style={{ color: theme.colors.text.tertiary }} />
              <IMDateTableCell timestamp={updatedAt} />
            </div>
          ) : (
            <span style={{ color: theme.colors.text.tertiary }}>-</span>
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
      id: false,
      pickup: true,
      dropoff: true,
      status: true,
      passenger: true,
      passengerID: false,
      carType: true,
      priceRange: true,
      ride: false,
      carDrive: false,
      createdAt: true,
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
    data: trips,
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

        const response = await fetch(baseAPIURL + "taxi_trips/list", config)

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
        console.error("Error fetching trips:", error)
        setError(error instanceof Error ? error.message : "Failed to load trips")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [loading, token])

  useEffect(() => {
    setTrips(data)
  }, [globalFilter, data])

  return (
    <div style={{ maxWidth: theme.content.maxWidth, margin: "0 auto" }}>
      <div style={theme.listView.card}>
        <div style={theme.listView.cardHeader}>
          <h1 style={theme.listView.title}>
            <Route size={24} style={{ color: theme.colors.accent.primary, marginRight: "0.5rem" }} />
            Taxi Trips
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
            Add New Trip
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
                  <X size={16} />
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
                    placeholder="Search trips..."
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
                              <label htmlFor={`column-${column.id}`}>{column.header as string}</label>
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
                              <span>Loading trips...</span>
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
                                <Route size={32} style={{ color: theme.colors.text.tertiary }} />
                              </div>
                              <div style={theme.listView.emptyTitle}>No trips found</div>
                              <div style={theme.listView.emptyMessage}>
                                Try adjusting your search or create a new trip
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

export default TripsListView

