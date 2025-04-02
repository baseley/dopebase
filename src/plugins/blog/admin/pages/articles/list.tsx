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
  FileText,
  Loader2,
  LinkIcon,
  ImageIcon,
  ToggleLeft,
  ToggleRight,
  Tag,
  Calendar,
  User,
  FolderTree,
  Tags,
  SlidersHorizontal,
  ChevronDown,
  Images,
  Github,
  Link2,
  Clock,
  KeyRound,
} from "lucide-react"
import { IMImagesTableCell, IMDateTableCell, IMForeignKeyTableCell } from "@/admin/components/forms/table"
import { pluginsAPIURL } from "@/config/config"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authPost } from "@/modules/auth/utils/authFetch"
import { theme } from "@/lib/theme"
import type React from "react"
import IMArticleTagsForeignKeysArrayIdTableCell from "@/plugins/blog/admin/components/tableCells/IMArticleTagsForeignKeysArrayIdTableCell"

const baseAPIURL = `${pluginsAPIURL}admin/blog/`

interface Article {
  id: string
  title: string
  content: string
  cover_photo: string | null
  photo_urls: string[] | null
  source_code_url: string | null
  canonical_url: string | null
  published: boolean
  outdated: boolean
  slug: string
  seo_title: string | null
  seo_description: string | null
  seo_keyword: string | null
  author_id: string | null
  category_id: string | null
  tags: any[] | null
  created_at: string
  updated_at: string
}

function ActionsItemView({ data }: { data: any }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleView = (item: Article) => {
    router.push(`./view?id=${item.id}`)
  }

  const handleEdit = (item: Article) => {
    router.push(`./update?id=${item.id}`)
  }

  const handleDelete = async (item: Article) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      setIsDeleting(true)
      try {
        const path = baseAPIURL + "articles/delete"
        await authPost(path, { id: item.id })
        window.location.reload()
      } catch (error) {
        console.error("Error deleting article:", error)
        alert("Failed to delete article. Please try again.")
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

// Expandable row component
function ExpandedRow({ article }: { article: Article }) {
  return (
    <div
      style={{
        padding: theme.spacing[4],
        backgroundColor: theme.colors.surface.tertiary,
        borderRadius: theme.borderRadius.md,
        margin: `${theme.spacing[2]} 0`,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: theme.spacing[4] }}>
        {/* SEO Information */}
        <div>
          <h3
            style={{
              fontSize: theme.typography.fontSizes.sm,
              fontWeight: theme.typography.fontWeights.semibold,
              marginBottom: theme.spacing[2],
              color: theme.colors.text.primary,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing[2],
            }}
          >
            <KeyRound size={16} />
            SEO Information
          </h3>
          <div
            style={{
              backgroundColor: theme.colors.surface.primary,
              padding: theme.spacing[3],
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border.light}`,
            }}
          >
            <div style={{ marginBottom: theme.spacing[2] }}>
              <div style={{ fontSize: theme.typography.fontSizes.xs, color: theme.colors.text.tertiary }}>
                SEO Title
              </div>
              <div style={{ fontSize: theme.typography.fontSizes.sm }}>{article.seo_title || "-"}</div>
            </div>
            <div style={{ marginBottom: theme.spacing[2] }}>
              <div style={{ fontSize: theme.typography.fontSizes.xs, color: theme.colors.text.tertiary }}>
                SEO Description
              </div>
              <div style={{ fontSize: theme.typography.fontSizes.sm }}>{article.seo_description || "-"}</div>
            </div>
            <div>
              <div style={{ fontSize: theme.typography.fontSizes.xs, color: theme.colors.text.tertiary }}>
                SEO Keywords
              </div>
              <div style={{ fontSize: theme.typography.fontSizes.sm }}>{article.seo_keyword || "-"}</div>
            </div>
          </div>
        </div>

        {/* URLs */}
        <div>
          <h3
            style={{
              fontSize: theme.typography.fontSizes.sm,
              fontWeight: theme.typography.fontWeights.semibold,
              marginBottom: theme.spacing[2],
              color: theme.colors.text.primary,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing[2],
            }}
          >
            <Link2 size={16} />
            URLs
          </h3>
          <div
            style={{
              backgroundColor: theme.colors.surface.primary,
              padding: theme.spacing[3],
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border.light}`,
            }}
          >
            <div style={{ marginBottom: theme.spacing[2] }}>
              <div style={{ fontSize: theme.typography.fontSizes.xs, color: theme.colors.text.tertiary }}>
                Source Code URL
              </div>
              <div style={{ fontSize: theme.typography.fontSizes.sm, fontFamily: "monospace" }}>
                {article.source_code_url ? (
                  <a
                    href={article.source_code_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: theme.colors.accent.primary,
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing[1],
                    }}
                  >
                    <Github size={14} />
                    {article.source_code_url.length > 30
                      ? article.source_code_url.substring(0, 30) + "..."
                      : article.source_code_url}
                  </a>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div>
              <div style={{ fontSize: theme.typography.fontSizes.xs, color: theme.colors.text.tertiary }}>
                Canonical URL
              </div>
              <div style={{ fontSize: theme.typography.fontSizes.sm, fontFamily: "monospace" }}>
                {article.canonical_url ? (
                  <a
                    href={article.canonical_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: theme.colors.accent.primary,
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing[1],
                    }}
                  >
                    <LinkIcon size={14} />
                    {article.canonical_url.length > 30
                      ? article.canonical_url.substring(0, 30) + "..."
                      : article.canonical_url}
                  </a>
                ) : (
                  "-"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3
            style={{
              fontSize: theme.typography.fontSizes.sm,
              fontWeight: theme.typography.fontWeights.semibold,
              marginBottom: theme.spacing[2],
              color: theme.colors.text.primary,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing[2],
            }}
          >
            <Tags size={16} />
            Tags
          </h3>
          <div
            style={{
              backgroundColor: theme.colors.surface.primary,
              padding: theme.spacing[3],
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border.light}`,
              minHeight: "100px",
            }}
          >
            {article.tags && article.tags.length > 0 ? (
              <IMArticleTagsForeignKeysArrayIdTableCell tagsArray={article.tags} />
            ) : (
              <div style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSizes.sm }}>No tags</div>
            )}
          </div>
        </div>
      </div>

      {/* Photos */}
      {article.photo_urls && article.photo_urls.length > 0 && (
        <div style={{ marginTop: theme.spacing[4] }}>
          <h3
            style={{
              fontSize: theme.typography.fontSizes.sm,
              fontWeight: theme.typography.fontWeights.semibold,
              marginBottom: theme.spacing[2],
              color: theme.colors.text.primary,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing[2],
            }}
          >
            <Images size={16} />
            Additional Photos
          </h3>
          <div
            style={{
              backgroundColor: theme.colors.surface.primary,
              padding: theme.spacing[3],
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border.light}`,
            }}
          >
            <div style={{ display: "flex", gap: theme.spacing[2], flexWrap: "wrap" }}>
              <IMImagesTableCell imageURLs={article.photo_urls} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ArticlesListView() {
  const [isLoading, setIsLoading] = useState(true)
  const [articles, setArticles] = useState<Article[]>([])
  const [data, setData] = useState<Article[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [user, token, loading] = useCurrentUser()
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [showColumnSelector, setShowColumnSelector] = useState(false)

  // Define all available columns
  const allColumns = useMemo<ColumnDef<Article>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        accessorKey: "id",
        cell: ({ getValue }) => <div style={theme.listView.idCell}>{getValue()}</div>,
      },
      {
        id: "title",
        header: "Title",
        accessorKey: "title",
        cell: ({ getValue }) => <div style={theme.listView.nameCell}>{getValue()}</div>,
      },
      {
        id: "content",
        header: "Content",
        accessorKey: "content",
        cell: ({ getValue }) => (
          <div style={theme.listView.descriptionCell}>{getValue() ? `${getValue().substring(0, 60)}...` : "-"}</div>
        ),
      },
      {
        id: "cover_photo",
        header: "Cover Photo",
        accessorKey: "cover_photo",
        cell: ({ getValue }) => (
          <div className="flex justify-center">
            {getValue() ? (
              <div
                className="relative h-10 w-10 rounded-md overflow-hidden border"
                style={{ borderColor: theme.colors.border.light }}
              >
                <IMImagesTableCell singleImageURL={getValue()} />
              </div>
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-md"
                style={{ backgroundColor: theme.colors.surface.tertiary }}
              >
                <ImageIcon className="h-5 w-5" style={{ color: theme.colors.text.tertiary }} />
              </div>
            )}
          </div>
        ),
      },
      {
        id: "photo_urls",
        header: "Additional Photos",
        accessorKey: "photo_urls",
        cell: ({ getValue }) => {
          const photos = getValue() as string[] | null
          return (
            <div className="flex justify-center">
              {photos && photos.length > 0 ? (
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
                  <Images size={14} className="mr-1" />
                  {photos.length} photos
                </span>
              ) : (
                <span style={{ fontSize: "0.875rem", color: theme.colors.text.tertiary }}>-</span>
              )}
            </div>
          )
        },
      },
      {
        id: "source_code_url",
        header: "Source Code",
        accessorKey: "source_code_url",
        cell: ({ getValue }) => {
          const url = getValue() as string | null
          return (
            <div className="flex justify-center">
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
                  }}
                >
                  <Github size={14} />
                  View
                </a>
              ) : (
                <span style={{ fontSize: "0.875rem", color: theme.colors.text.tertiary }}>-</span>
              )}
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
            <div className="flex justify-center">
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
                  }}
                >
                  <LinkIcon size={14} />
                  View
                </a>
              ) : (
                <span style={{ fontSize: "0.875rem", color: theme.colors.text.tertiary }}>-</span>
              )}
            </div>
          )
        },
      },
      {
        id: "published",
        header: "Status",
        accessorKey: "published",
        cell: ({ getValue }) => (
          <div className="flex justify-center">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 500,
                backgroundColor: getValue() ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                color: getValue() ? theme.colors.feedback.success : theme.colors.feedback.warning,
              }}
            >
              {getValue() ? (
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
        ),
      },
      {
        id: "outdated",
        header: "Outdated",
        accessorKey: "outdated",
        cell: ({ getValue }) => (
          <div className="flex justify-center">
            {getValue() ? (
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
                <Clock size={14} className="mr-1" />
                Outdated
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
                <Clock size={14} className="mr-1" />
                Current
              </span>
            )}
          </div>
        ),
      },
      {
        id: "slug",
        header: "Slug",
        accessorKey: "slug",
        cell: ({ getValue }) => (
          <div className="flex items-center">
            <Tag className="mr-2 h-4 w-4" style={{ color: theme.colors.text.tertiary }} />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: theme.colors.text.secondary,
              }}
            >
              {getValue() || "-"}
            </span>
          </div>
        ),
      },
      {
        id: "seo_title",
        header: "SEO Title",
        accessorKey: "seo_title",
        cell: ({ getValue }) => (
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
            {getValue() || "-"}
          </div>
        ),
      },
      {
        id: "seo_description",
        header: "SEO Description",
        accessorKey: "seo_description",
        cell: ({ getValue }) => (
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
            {getValue() || "-"}
          </div>
        ),
      },
      {
        id: "seo_keyword",
        header: "SEO Keywords",
        accessorKey: "seo_keyword",
        cell: ({ getValue }) => (
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
            {getValue() || "-"}
          </div>
        ),
      },
      {
        id: "category_id",
        header: "Category",
        accessorKey: "category_id",
        cell: ({ getValue }) => (
          <div className="flex items-center justify-center">
            {getValue() ? (
              <div className="flex items-center">
                <FolderTree className="mr-2 h-4 w-4" style={{ color: theme.colors.text.tertiary }} />
                <IMForeignKeyTableCell
                  id={getValue()}
                  apiRouteName="admin/blog/article_categories"
                  viewRoute="article_categories"
                  titleKey="name"
                />
              </div>
            ) : (
              <span style={{ fontSize: "0.875rem", color: theme.colors.text.tertiary }}>-</span>
            )}
          </div>
        ),
      },
      {
        id: "author_id",
        header: "Author",
        accessorKey: "author_id",
        cell: ({ getValue }) => (
          <div className="flex items-center justify-center">
            {getValue() ? (
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" style={{ color: theme.colors.text.tertiary }} />
                <IMForeignKeyTableCell
                  id={getValue()}
                  apiRouteName="admin/blog/users"
                  viewRoute="users"
                  titleKey="title"
                />
              </div>
            ) : (
              <span style={{ fontSize: "0.875rem", color: theme.colors.text.tertiary }}>-</span>
            )}
          </div>
        ),
      },
      {
        id: "tags",
        header: "Tags",
        accessorKey: "tags",
        cell: ({ getValue }) => {
          const tags = getValue() as any[] | null
          return (
            <div className="flex justify-center">
              {tags && tags.length > 0 ? (
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
                  <Tags size={14} className="mr-1" />
                  {tags.length} tags
                </span>
              ) : (
                <span style={{ fontSize: "0.875rem", color: theme.colors.text.tertiary }}>-</span>
              )}
            </div>
          )
        },
      },
      {
        id: "created_at",
        header: "Created At",
        accessorKey: "created_at",
        cell: ({ getValue }) => (
          <div className="flex items-center justify-center">
            <Calendar className="mr-2 h-4 w-4" style={{ color: theme.colors.text.tertiary }} />
            <IMDateTableCell timestamp={getValue()} />
          </div>
        ),
      },
      {
        id: "updated_at",
        header: "Updated At",
        accessorKey: "updated_at",
        cell: ({ getValue }) => (
          <div className="flex items-center justify-center">
            <Clock className="mr-2 h-4 w-4" style={{ color: theme.colors.text.tertiary }} />
            <IMDateTableCell timestamp={getValue()} />
          </div>
        ),
      },
      {
        id: "expand",
        header: "",
        cell: ({ row }) => (
          <button
            onClick={() => toggleRowExpanded(row.original.id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: theme.borderRadius.md,
              backgroundColor: expandedRows[row.original.id]
                ? theme.colors.accent.muted
                : theme.colors.surface.tertiary,
              color: expandedRows[row.original.id] ? theme.colors.accent.primary : theme.colors.text.secondary,
              transition: theme.transitions.normal,
              transform: expandedRows[row.original.id] ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <ChevronDown size={16} />
          </button>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "actions",
        cell: (data) => <ActionsItemView data={data} />,
      },
    ],
    [expandedRows],
  )

  // Default visible columns
  const defaultVisibleColumns = useMemo(
    () => ({
      id: true,
      title: true,
      content: true,
      cover_photo: true,
      published: true,
      slug: true,
      category_id: true,
      author_id: true,
      created_at: true,
      expand: true,
      actions: true,
      // Hide these by default to avoid overwhelming the user
      photo_urls: false,
      source_code_url: false,
      canonical_url: false,
      outdated: false,
      seo_title: false,
      seo_description: false,
      seo_keyword: false,
      tags: false,
      updated_at: false,
    }),
    [],
  )

  // Set default column visibility on first render
  useEffect(() => {
    setColumnVisibility(defaultVisibleColumns)
  }, [defaultVisibleColumns])

  const toggleRowExpanded = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const table = useReactTable({
    data: articles,
    columns: allColumns,
    state: {
      globalFilter,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
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

        const response = await fetch(baseAPIURL + "articles/list", config)

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error("Error fetching articles:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [loading, token])

  useEffect(() => {
    setArticles(data)
  }, [globalFilter, data])

  const router = useRouter()

  return (
    <div style={{ maxWidth: theme.content.maxWidth, margin: "0 auto" }}>
      <div style={theme.listView.card}>
        <div style={theme.listView.cardHeader}>
          <h1 style={theme.listView.title}>
            <FileText size={24} style={{ color: theme.colors.accent.primary, marginRight: "0.5rem" }} />
            Articles
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
            Add New Article
          </button>
        </div>

        <div style={theme.listView.cardBody}>
          <div
            style={
              {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              } as React.CSSProperties
            }
          >
            <div style={theme.listView.searchContainer}>
              <input
                type="text"
                placeholder="Search articles..."
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                style={theme.listView.searchInput}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
            <div style={{ position: "relative" } as React.CSSProperties}>
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
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
                    width: "200px",
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
                    // Skip the expand and actions columns
                    if (column.id === "expand" || column.id === "actions") return null

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
                </div>
              )}
            </div>
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
                      colSpan={table.getVisibleFlatColumns().length}
                      style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                    >
                      <div style={theme.listView.loadingContainer}>
                        <div className="animate-spin" style={theme.listView.loadingSpinner}></div>
                        Loading articles...
                      </div>
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={table.getVisibleFlatColumns().length}
                      style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                    >
                      <div style={theme.listView.emptyContainer}>
                        <div style={theme.listView.emptyIconContainer}>
                          <FileText size={32} style={{ color: theme.colors.text.tertiary }} />
                        </div>
                        <div style={theme.listView.emptyTitle}>No articles found</div>
                        <div style={theme.listView.emptyMessage}>Try adjusting your search or create a new article</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <>
                      <tr
                        key={row.id}
                        style={{
                          transition: theme.transitions.normal,
                          backgroundColor: expandedRows[row.original.id]
                            ? theme.colors.state.selected
                            : theme.colors.surface.secondary,
                        }}
                        onMouseEnter={(e) => {
                          if (!expandedRows[row.original.id]) {
                            e.currentTarget.style.backgroundColor = theme.colors.state.hover
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!expandedRows[row.original.id]) {
                            e.currentTarget.style.backgroundColor = theme.colors.surface.secondary
                          }
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} style={theme.listView.tableCell}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                      {expandedRows[row.original.id] && (
                        <tr>
                          <td colSpan={table.getVisibleFlatColumns().length} style={{ padding: "0 1rem" }}>
                            <ExpandedRow article={row.original} />
                          </td>
                        </tr>
                      )}
                    </>
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
                marginTop: "1rem",
              } as React.CSSProperties
            }
          >
            <div
              style={{
                fontSize: "0.875rem",
                color: theme.colors.text.secondary,
              }}
            >
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length,
              )}{" "}
              of {table.getFilteredRowModel().rows.length} results
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" } as React.CSSProperties}>
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
  )
}

export default ArticlesListView

