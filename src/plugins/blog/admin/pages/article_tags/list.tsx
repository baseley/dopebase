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
  FileText,
  Loader2,
  Tag,
  Calendar,
  Link2,
  Image,
  ToggleLeft,
  ToggleRight,
  Filter,
  SlidersHorizontal,
} from "lucide-react"
import { IMImagesTableCell, IMDateTableCell } from "@/admin/components/forms/table"
import { pluginsAPIURL } from "@/config/config"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authPost } from "@/modules/auth/utils/authFetch"
import { theme } from "@/lib/theme"
import type React from "react"

const baseAPIURL = `${pluginsAPIURL}admin/blog/`

interface ArticleTag {
  id: string
  name: string
  description: string | null
  published: boolean
  seo_title: string | null
  seo_description: string | null
  canonical_url: string | null
  slug: string
  seo_image_url: string | null
  created_at: string
}

function ActionsItemView({ data }: { data: any }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleView = (item: ArticleTag) => {
    router.push(`./view?id=${item.id}`)
  }

  const handleEdit = (item: ArticleTag) => {
    router.push(`./update?id=${item.id}`)
  }

  const handleDelete = async (item: ArticleTag) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      setIsDeleting(true)
      try {
        const path = baseAPIURL + "article_tags/delete"
        await authPost(path, { id: item.id })
        window.location.reload()
      } catch (error) {
        console.error("Error deleting tag:", error)
        alert("Failed to delete tag. Please try again.")
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

function ArticleTagsListView() {
  const [isLoading, setIsLoading] = useState(true)
  const [articleTags, setArticleTags] = useState<ArticleTag[]>([])
  const [data, setData] = useState<ArticleTag[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [user, token, loading] = useCurrentUser()

  const columns = useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        cell: ({ getValue }) => <div style={theme.listView.nameCell}>{String(getValue() || "")}</div>,
      },
      {
        id: "description",
        header: "Description",
        accessorKey: "description",
        cell: ({ getValue }) => {
          const description = getValue() as string | null
          return (
            <div style={theme.listView.descriptionCell}>
              {description ? `${description.substring(0, 100)}...` : "-"}
            </div>
          )
        },
      },
      {
        id: "published",
        header: "Status",
        accessorKey: "published",
        cell: ({ getValue }) => {
          const isPublished = Boolean(getValue())
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
                  backgroundColor: isPublished ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                  color: isPublished ? theme.colors.feedback.success : theme.colors.feedback.warning,
                }}
              >
                {isPublished ? (
                  <>
                    <ToggleRight size={14} className="mr-1" />
                    Published
                  </>
                ) : (
                  <>
                    <ToggleLeft size={14} className="mr-1" />
                    Draft
                  </>
                )}
              </span>
            </div>
          )
        },
      },
      {
        id: "seo_title",
        header: "SEO Title",
        accessorKey: "seo_title",
        cell: ({ getValue }) => {
          const seoTitle = getValue() as string | null
          return (
            <div
              style={{
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: theme.colors.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              {seoTitle || "-"}
            </div>
          )
        },
      },
      {
        id: "seo_description",
        header: "SEO Description",
        accessorKey: "seo_description",
        cell: ({ getValue }) => {
          const seoDescription = getValue() as string | null
          return (
            <div
              style={{
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: theme.colors.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              {seoDescription || "-"}
            </div>
          )
        },
      },
      {
        id: "canonical_url",
        header: "Canonical URL",
        accessorKey: "canonical_url",
        cell: ({ getValue }) => {
          const url = getValue() as string | null
          return (
            <div className="flex items-center">
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: theme.colors.accent.primary,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "0.875rem",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Link2 size={14} className="flex-shrink-0" />
                  <span>{url}</span>
                </a>
              ) : (
                <span style={{ fontSize: "0.875rem", color: theme.colors.text.tertiary }}>-</span>
              )}
            </div>
          )
        },
      },
      {
        id: "slug",
        header: "Slug",
        accessorKey: "slug",
        cell: ({ getValue }) => {
          const slug = getValue() as string | undefined
          return (
            <div className="flex items-center">
              <Tag className="mr-2 h-4 w-4" style={{ color: theme.colors.text.tertiary }} />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: theme.colors.text.secondary,
                }}
              >
                {slug || "-"}
              </span>
            </div>
          )
        },
      },
      {
        id: "seo_image_url",
        header: "SEO Image",
        accessorKey: "seo_image_url",
        cell: ({ getValue }) => {
          const imageUrl = getValue() as string | null
          return (
            <div className="flex justify-center">
              {imageUrl ? (
                <div
                  className="relative h-10 w-10 rounded-md overflow-hidden border"
                  style={{ borderColor: theme.colors.border.light }}
                >
                  <IMImagesTableCell singleImageURL={imageUrl} />
                </div>
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-md"
                  style={{ backgroundColor: theme.colors.surface.tertiary }}
                >
                  <Image className="h-5 w-5" style={{ color: theme.colors.text.tertiary }} />
                </div>
              )}
            </div>
          )
        },
      },
      {
        id: "created_at",
        header: "Created At",
        accessorKey: "created_at",
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
    data: articleTags,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

        const response = await fetch(baseAPIURL + "article_tags/list", config)

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error("Error fetching tags:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [loading, token])

  useEffect(() => {
    setArticleTags(data)
  }, [globalFilter, data])

  const router = useRouter()

  return (
    <div style={{ maxWidth: theme.content.maxWidth, margin: "0 auto" }}>
      <div style={theme.listView.card}>
        <div style={theme.listView.cardHeader}>
          <h1 style={theme.listView.title}>
            <Tag size={24} style={{ color: theme.colors.accent.primary, marginRight: "0.5rem" }} />
            Article Tags
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
            Add New Tag
          </button>
        </div>

        <div style={theme.listView.cardBody}>
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
                placeholder="Search tags..."
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
                          <span>Loading tags...</span>
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
                            <FileText size={32} style={{ color: theme.colors.text.tertiary }} />
                          </div>
                          <div style={theme.listView.emptyTitle}>No tags found</div>
                          <div style={theme.listView.emptyMessage}>Try adjusting your search or create a new tag</div>
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
                    gap: "0.5rem",
                  } as React.CSSProperties
                }
              >
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
        </div>
      </div>
    </div>
  )
}

export default ArticleTagsListView

