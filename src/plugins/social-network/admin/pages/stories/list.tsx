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
  User,
  Image,
  Calendar,
  AlertCircle,
  Bookmark,
} from "lucide-react"
import { IMDateTableCell, IMForeignKeyTableCell, IMImagesTableCell } from "@/admin/components/forms/table"
import { pluginsAPIURL } from "@/config/config"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authPost } from "@/modules/auth/utils/authFetch"
import { theme } from "@/lib/theme"
import type React from "react"

const baseAPIURL = `${pluginsAPIURL}admin/social-network/`

interface Story {
  id: string
  authorID: string
  createdAt: string
  storyMediaURL: string
  storyType: string
}

function ActionsItemView({ data }: { data: any }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleView = (item: Story) => {
    router.push(`./view?id=${item.id}`)
  }

  const handleEdit = (item: Story) => {
    router.push(`./update?id=${item.id}`)
  }

  const handleDelete = async (item: Story) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      setIsDeleting(true)
      try {
        const path = baseAPIURL + "stories/delete"
        await authPost(path, { id: item.id })
        window.location.reload()
      } catch (error) {
        console.error("Error deleting story:", error)
        alert("Failed to delete story. Please try again.")
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

function StoriesListView() {
  const [isLoading, setIsLoading] = useState(true)
  const [stories, setStories] = useState<Story[]>([])
  const [data, setData] = useState<Story[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [user, token, loading] = useCurrentUser()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const router = useRouter()

  const columns = useMemo<ColumnDef<Story>[]>(
    () => [
      {
        id: "id",
        header: "Story ID",
        accessorKey: "id",
        cell: ({ getValue }) => {
          const id = getValue() as string
          return (
            <div
              style={{
                fontFamily: "monospace",
                color: theme.colors.text.secondary,
              }}
            >
              {id}
            </div>
          )
        },
      },
      {
        id: "authorID",
        header: "Author",
        accessorKey: "authorID",
        cell: ({ getValue }) => (
          <div className="flex items-center">
            <User size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
            <IMForeignKeyTableCell 
              id={getValue() as string}
              apiRouteName="admin/social-network/users" 
              viewRoute="users"
              titleKey="email" 
            />
          </div>
        ),
      },
      {
        id: "storyMediaURL",
        header: "Media",
        accessorKey: "storyMediaURL",
        cell: ({ getValue }) => {
          const mediaUrl = getValue() as string
          return (
            <div className="flex items-center">
              <Image size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <IMImagesTableCell singleImageURL={mediaUrl} />
            </div>
          )
        },
      },
      {
        id: "storyType",
        header: "Type",
        accessorKey: "storyType",
        cell: ({ getValue }) => {
          const type = getValue() as string
          return (
            <div className="flex items-center">
              <Bookmark size={16} className="mr-2" style={{ color: theme.colors.text.tertiary }} />
              <span style={{ color: theme.colors.text.primary }}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
          )
        },
      },
      {
        id: "createdAt",
        header: "Date",
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
    data: stories,
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

        const response = await fetch(baseAPIURL + "stories/list", config)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        const cleanData = data.map((item: any) => ({
          id: item.id,
          authorID: item.authorID || "",
          createdAt: item.createdAt || "",
          storyMediaURL: item.storyMediaURL || "",
          storyType: item.storyType || "",
        }))

        setData(cleanData)
      } catch (error) {
        console.error("Error fetching stories:", error)
        setError(error instanceof Error ? error.message : "Failed to load stories")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [loading, token])

  useEffect(() => {
    setStories(data)
  }, [globalFilter, data])

  return (
    <div style={{ maxWidth: theme.content.maxWidth, margin: "0 auto" }}>
      <div style={theme.listView.card}>
        <div style={theme.listView.cardHeader}>
          <h1 style={theme.listView.title}>
            <Bookmark size={24} style={{ color: theme.colors.accent.primary, marginRight: "0.5rem" }} />
            Stories
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
            Add New Story
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
                    placeholder="Search stories..."
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
                              <span>Loading stories...</span>
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
                                <Bookmark size={32} style={{ color: theme.colors.text.tertiary }} />
                              </div>
                              <div style={theme.listView.emptyTitle}>No stories found</div>
                              <div style={theme.listView.emptyMessage}>
                                Try adjusting your search or create a new story
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

export default StoriesListView