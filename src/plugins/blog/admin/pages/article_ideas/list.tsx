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
  Loader2,
  Calendar,
  Lightbulb,
  Sparkles,
  Hash,
  Clock,
  Share2,
  FileTextIcon,
  BookOpen,
  Folder,
  Filter,
  SlidersHorizontal,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  Zap,
  Info,
} from "lucide-react"
import { IMDateTableCell } from "@/admin/components/forms/table"
import { pluginsAPIURL } from "@/config/config"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authPost } from "@/modules/auth/utils/authFetch"
import { theme } from "@/lib/theme"
import type React from "react"
import GenerateIdeasForm from "@/plugins/blog/admin/components/GenerateIdeasForm"

const baseAPIURL = `${pluginsAPIURL}admin/blog/`

interface ArticleIdea {
  id: string
  title: string
  sections: string
  tags: string
  status: string
  extra_prompt: string
  social_media_post: string
  seo_description: string
  summary: string
  topic: string
  category: string
  created_at: string
  updated_at: string
}

function ActionsItemView({ data }: { data: any }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleView = (item: ArticleIdea) => {
    router.push(`./view?id=${item.id}`)
  }

  const handleEdit = (item: ArticleIdea) => {
    router.push(`./update?id=${item.id}`)
  }

  const handleDelete = async (item: ArticleIdea) => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      setIsDeleting(true)
      try {
        const path = baseAPIURL + "article_ideas/delete"
        await authPost(path, { id: item.id })
        window.location.reload()
      } catch (error) {
        console.error("Error deleting idea:", error)
        alert("Failed to delete idea. Please try again.")
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

function ArticleIdeasListView() {
  const [isLoading, setIsLoading] = useState(true)
  const [articleIdeas, setArticleIdeas] = useState<ArticleIdea[]>([])
  const [data, setData] = useState<ArticleIdea[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [user, token, loading] = useCurrentUser()
  const [isGeneratingArticles, setIsGeneratingArticles] = useState(false)
  const [showGenerateForm, setShowGenerateForm] = useState(false)

  const columns = useMemo(
    () => [
      {
        id: "title",
        header: "Title",
        accessorKey: "title",
        cell: ({ getValue }) => {
          const title = getValue() as string
          return <div style={theme.listView.nameCell}>{title || "-"}</div>
        },
      },
      {
        id: "sections",
        header: "Sections",
        accessorKey: "sections",
        cell: ({ getValue }) => {
          const sections = getValue() as string
          return (
            <div
              style={{
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: theme.colors.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              {sections ? (
                <div className="flex items-center">
                  <FileTextIcon
                    size={14}
                    className="mr-1 flex-shrink-0"
                    style={{ color: theme.colors.text.tertiary }}
                  />
                  <span>{sections}</span>
                </div>
              ) : (
                "-"
              )}
            </div>
          )
        },
      },
      {
        id: "tags",
        header: "Tags",
        accessorKey: "tags",
        cell: ({ getValue }) => {
          const tags = getValue() as string
          return (
            <div
              style={{
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: theme.colors.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              {tags ? (
                <div className="flex items-center">
                  <Hash size={14} className="mr-1 flex-shrink-0" style={{ color: theme.colors.text.tertiary }} />
                  <span>{tags}</span>
                </div>
              ) : (
                "-"
              )}
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
          let StatusIcon = AlertCircle

          if (status?.toLowerCase().includes("complete") || status?.toLowerCase().includes("done")) {
            statusColor = theme.colors.feedback.success
            statusBg = "rgba(16, 185, 129, 0.15)"
            StatusIcon = CheckCircle2
          } else if (status?.toLowerCase().includes("pending") || status?.toLowerCase().includes("progress")) {
            statusColor = theme.colors.feedback.warning
            statusBg = "rgba(245, 158, 11, 0.15)"
            StatusIcon = Clock
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
                <StatusIcon size={14} className="mr-1" />
                {status || "Unknown"}
              </span>
            </div>
          )
        },
      },
      {
        id: "extra_prompt",
        header: "Extra Prompt",
        accessorKey: "extra_prompt",
        cell: ({ getValue }) => {
          const extraPrompt = getValue() as string
          return (
            <div
              style={{
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: theme.colors.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              {extraPrompt ? (
                <div className="flex items-center">
                  <Zap size={14} className="mr-1 flex-shrink-0" style={{ color: theme.colors.text.tertiary }} />
                  <span>{extraPrompt}</span>
                </div>
              ) : (
                "-"
              )}
            </div>
          )
        },
      },
      {
        id: "social_media_post",
        header: "Social Media",
        accessorKey: "social_media_post",
        cell: ({ getValue }) => {
          const socialMedia = getValue() as string
          return (
            <div className="flex justify-center">
              {socialMedia ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    backgroundColor: theme.colors.accent.muted,
                    color: theme.colors.accent.primary,
                  }}
                >
                  <Share2 size={14} className="mr-1" />
                  Available
                </span>
              ) : (
                <span style={{ fontSize: "0.875rem", color: theme.colors.text.tertiary }}>-</span>
              )}
            </div>
          )
        },
      },
      {
        id: "seo_description",
        header: "SEO Description",
        accessorKey: "seo_description",
        cell: ({ getValue }) => {
          const seoDescription = getValue() as string
          return (
            <div
              style={{
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: theme.colors.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              {seoDescription ? (
                <div className="flex items-center">
                  <Info size={14} className="mr-1 flex-shrink-0" style={{ color: theme.colors.text.tertiary }} />
                  <span>{seoDescription}</span>
                </div>
              ) : (
                "-"
              )}
            </div>
          )
        },
      },
      {
        id: "summary",
        header: "Summary",
        accessorKey: "summary",
        cell: ({ getValue }) => {
          const summary = getValue() as string
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
              {summary ? (
                <div className="flex items-center">
                  <MessageCircle
                    size={14}
                    className="mr-1 flex-shrink-0"
                    style={{ color: theme.colors.text.tertiary }}
                  />
                  <span>{summary}</span>
                </div>
              ) : (
                "-"
              )}
            </div>
          )
        },
      },
      {
        id: "topic",
        header: "Topic",
        accessorKey: "topic",
        cell: ({ getValue }) => {
          const topic = getValue() as string
          return (
            <div
              style={{
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: theme.colors.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              {topic ? (
                <div className="flex items-center">
                  <BookOpen size={14} className="mr-1 flex-shrink-0" style={{ color: theme.colors.text.tertiary }} />
                  <span>{topic}</span>
                </div>
              ) : (
                "-"
              )}
            </div>
          )
        },
      },
      {
        id: "category",
        header: "Category",
        accessorKey: "category",
        cell: ({ getValue }) => {
          const category = getValue() as string
          return (
            <div
              style={{
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: theme.colors.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              {category ? (
                <div className="flex items-center">
                  <Folder size={14} className="mr-1 flex-shrink-0" style={{ color: theme.colors.text.tertiary }} />
                  <span>{category}</span>
                </div>
              ) : (
                "-"
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
        id: "updated_at",
        header: "Updated At",
        accessorKey: "updated_at",
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

  const table = useReactTable({
    data: articleIdeas,
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

        const response = await fetch(baseAPIURL + "article_ideas/list", config)

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error("Error fetching ideas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [loading, token])

  useEffect(() => {
    setArticleIdeas(data)
  }, [globalFilter, data])

  const generateArticles = async () => {
    if (window.confirm("Are you sure you want to generate articles for all ideas?")) {
      setIsGeneratingArticles(true)
      try {
        const path = baseAPIURL + "ai/generate-articles"
        await authPost(path, {})
        window.location.reload()
      } catch (error) {
        console.error("Error generating articles:", error)
        alert("Failed to generate articles. Please try again.")
      } finally {
        setIsGeneratingArticles(false)
      }
    }
  }

  const router = useRouter()

  return (
    <div style={{ maxWidth: theme.content.maxWidth, margin: "0 auto" }}>
      <div style={theme.listView.card}>
        <div style={theme.listView.cardHeader}>
          <h1 style={theme.listView.title}>
            <Lightbulb size={24} style={{ color: theme.colors.accent.primary, marginRight: "0.5rem" }} />
            Article Ideas
          </h1>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => setShowGenerateForm(!showGenerateForm)}
              style={{
                ...theme.listView.actionButton,
                backgroundColor: theme.colors.feedback.info,
                color: "#ffffff",
              }}
            >
              <Sparkles size={18} className="mr-2" />
              {showGenerateForm ? "Hide Generator" : "Generate Ideas"}
            </button>
            <button
              onClick={() => router.push("./add")}
              style={{
                ...theme.listView.actionButton,
                backgroundColor: theme.colors.accent.primary,
                color: "#ffffff",
              }}
            >
              <Plus size={18} className="mr-2" />
              Add New Idea
            </button>
          </div>
        </div>

        {showGenerateForm && (
          <div
            style={{
              padding: "1.5rem",
              backgroundColor: theme.colors.surface.tertiary,
              borderBottom: `1px solid ${theme.colors.border.light}`,
            }}
          >
            <GenerateIdeasForm />
          </div>
        )}

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
                placeholder="Search ideas..."
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
                          <span>Loading ideas...</span>
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
                            <Lightbulb size={32} style={{ color: theme.colors.text.tertiary }} />
                          </div>
                          <div style={theme.listView.emptyTitle}>No article ideas found</div>
                          <div style={theme.listView.emptyMessage}>
                            Try generating some ideas or create a new one manually
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

          {/* Generate Articles Button */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1.5rem",
              backgroundColor: theme.colors.surface.secondary,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border.light}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: theme.typography.fontSizes.lg,
                    fontWeight: theme.typography.fontWeights.semibold,
                    marginBottom: "0.5rem",
                    color: theme.colors.text.primary,
                  }}
                >
                  Generate Articles
                </h3>
                <p
                  style={{
                    fontSize: theme.typography.fontSizes.sm,
                    color: theme.colors.text.secondary,
                  }}
                >
                  Generate articles for all ideas in one click. This process may take some time.
                </p>
              </div>
              <button
                onClick={generateArticles}
                disabled={isGeneratingArticles || isLoading || articleIdeas.length === 0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.75rem 1.5rem",
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.feedback.success,
                  color: "#ffffff",
                  fontSize: theme.typography.fontSizes.sm,
                  fontWeight: theme.typography.fontWeights.medium,
                  transition: theme.transitions.normal,
                  cursor: isGeneratingArticles || isLoading || articleIdeas.length === 0 ? "not-allowed" : "pointer",
                  opacity: isGeneratingArticles || isLoading || articleIdeas.length === 0 ? 0.7 : 1,
                }}
              >
                {isGeneratingArticles ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Generating Articles...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="mr-2" />
                    Generate All Articles
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleIdeasListView

