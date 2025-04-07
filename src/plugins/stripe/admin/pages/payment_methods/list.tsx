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
  CreditCard,
  User,
  Check,
  X,
  CreditCardIcon,
  Calendar,
  XCircle,
} from "lucide-react"
import { IMForeignKeyTableCell } from "@/admin/components/forms/table"
import { pluginsAPIURL } from "@/config/config"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authPost } from "@/modules/auth/utils/authFetch"
import { theme } from "@/lib/theme"
import type React from "react"

const baseAPIURL = `${pluginsAPIURL}admin/stripe/`

interface PaymentMethod {
  id: string
  provider: string
  details: string
  is_default: boolean
  stripeCustomerID: string
  brand: string
  last4: string
  expiryMonth: string | number
  expiryYear: string | number
  userID: string
}

function ActionsItemView({ data }: { data: any }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleView = (item: PaymentMethod) => {
    router.push(`./view?id=${item.id}`)
  }

  const handleEdit = (item: PaymentMethod) => {
    router.push(`./update?id=${item.id}`)
  }

  const handleDelete = async (item: PaymentMethod) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      setIsDeleting(true)
      try {
        const path = baseAPIURL + "payment_methods/delete"
        await authPost(path, { id: item.id })
        window.location.reload()
      } catch (error) {
        console.error("Error deleting payment method:", error)
        alert("Failed to delete payment method. Please try again.")
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

function PaymentMethodsListView() {
  const [isLoading, setIsLoading] = useState(true)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [data, setData] = useState<PaymentMethod[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [user, token, loading] = useCurrentUser()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const router = useRouter()

  // Define all available columns
  const allColumns = useMemo<ColumnDef<PaymentMethod>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        accessorKey: "id",
        cell: ({ getValue }) => <div style={theme.listView.idCell}>{String(getValue())}</div>,
      },
      {
        id: "provider",
        header: "Provider",
        accessorKey: "provider",
        cell: ({ getValue }) => {
          const provider = getValue() as string
          return (
            <div className="flex items-center">
              <CreditCard size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <span style={theme.listView.nameCell}>{provider || "-"}</span>
            </div>
          )
        },
      },
      {
        id: "details",
        header: "Details",
        accessorKey: "details",
        cell: ({ getValue }) => {
          const details = getValue() as string
          return <div style={theme.listView.descriptionCell}>{details || "-"}</div>
        },
      },
      {
        id: "is_default",
        header: "Default",
        accessorKey: "is_default",
        cell: ({ getValue }) => {
          const isDefault = getValue() as boolean
          return (
            <div className="flex justify-center">
              {isDefault ? (
                <div
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
                  <Check size={14} className="mr-1" />
                  Default
                </div>
              ) : (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    backgroundColor: theme.colors.surface.tertiary,
                    color: theme.colors.text.tertiary,
                  }}
                >
                  <X size={14} className="mr-1" />
                  Not Default
                </div>
              )}
            </div>
          )
        },
      },
      {
        id: "stripeCustomerID",
        header: "Stripe Customer ID",
        accessorKey: "stripeCustomerID",
        cell: ({ getValue }) => {
          const stripeCustomerID = getValue() as string
          return (
            <div className="flex items-center">
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: theme.colors.text.secondary,
                  maxWidth: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={stripeCustomerID}
              >
                {stripeCustomerID || "-"}
              </span>
            </div>
          )
        },
      },
      {
        id: "card_info",
        header: "Card Information",
        accessorFn: (row) => `${row.brand || ""} •••• ${row.last4 || ""}`,
        cell: ({ row }) => {
          const brand = row.original.brand
          const last4 = row.original.last4

          if (!brand && !last4) return <span style={{ color: theme.colors.text.tertiary }}>-</span>

          return (
            <div className="flex items-center">
              <CreditCardIcon size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <span style={{ fontWeight: 500 }}>
                {brand} <span style={{ fontFamily: "monospace" }}>•••• {last4}</span>
              </span>
            </div>
          )
        },
      },
      {
        id: "expiry",
        header: "Expiry Date",
        accessorFn: (row) => `${row.expiryMonth || ""}/${row.expiryYear || ""}`,
        cell: ({ row }) => {
          const month = row.original.expiryMonth
          const year = row.original.expiryYear

          if (!month && !year) return <span style={{ color: theme.colors.text.tertiary }}>-</span>

          // Check if card is expired
          const now = new Date()
          const currentYear = now.getFullYear()
          const currentMonth = now.getMonth() + 1
          const expiryYear = typeof year === "string" ? Number.parseInt(year) : year
          const expiryMonth = typeof month === "string" ? Number.parseInt(month) : month

          const isExpired = expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)

          return (
            <div className="flex items-center justify-center">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  backgroundColor: isExpired ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                  color: isExpired ? theme.colors.feedback.error : theme.colors.feedback.success,
                }}
              >
                <Calendar size={14} className="mr-1" />
                {month}/{year}
              </div>
            </div>
          )
        },
      },
      {
        id: "userID",
        header: "User",
        accessorKey: "userID",
        cell: ({ getValue }) => {
          const userID = getValue() as string
          return (
            <div className="flex items-center">
              <User size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <IMForeignKeyTableCell id={userID} apiRouteName="admin/stripe/users" viewRoute="users" titleKey="email" />
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
      id: false,
      provider: true,
      details: true,
      is_default: true,
      card_info: true,
      expiry: true,
      userID: true,
      stripeCustomerID: false,
      actions: true,
    }),
    [],
  )

  // Set default column visibility on first render
  useEffect(() => {
    setColumnVisibility(defaultVisibleColumns)
  }, [defaultVisibleColumns])

  const table = useReactTable({
    data: paymentMethods,
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

        const response = await fetch(baseAPIURL + "payment_methods/list", config)

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
        console.error("Error fetching payment methods:", error)
        setError(error instanceof Error ? error.message : "Failed to load payment methods")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [loading, token])

  useEffect(() => {
    setPaymentMethods(data)
  }, [globalFilter, data])

  return (
    <div style={{ maxWidth: theme.content.maxWidth, margin: "0 auto" }}>
      <div style={theme.listView.card}>
        <div style={theme.listView.cardHeader}>
          <h1 style={theme.listView.title}>
            <CreditCard size={24} style={{ color: theme.colors.accent.primary, marginRight: "0.5rem" }} />
            Payment Methods
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
            Add New Payment Method
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
                    Database Error
                  </h3>
                  <p style={{ color: theme.colors.text.secondary }}>{error}</p>
                  <p
                    style={{
                      marginTop: "0.75rem",
                      fontSize: theme.typography.fontSizes.sm,
                      color: theme.colors.text.secondary,
                    }}
                  >
                    <strong>Note:</strong> This error occurs because the "updated_at" column doesn't exist in the
                    payment_methods table. Please check your database schema and either add this column or modify the
                    query to exclude it.
                  </p>
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
                    placeholder="Search payment methods..."
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
                              <span>Loading payment methods...</span>
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
                                <CreditCard size={32} style={{ color: theme.colors.text.tertiary }} />
                              </div>
                              <div style={theme.listView.emptyTitle}>No payment methods found</div>
                              <div style={theme.listView.emptyMessage}>
                                Try adjusting your search or create a new payment method
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

export default PaymentMethodsListView

