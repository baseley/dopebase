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
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Loader2,
  ImageIcon,
  Tag,
  FileText,
  Layers,
} from "lucide-react"
import { IMImagesTableCell, IMForeignKeyTableCell } from "@/admin/components/forms/table"
import { pluginsAPIURL } from "@/config/config"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authPost } from "@/modules/auth/utils/authFetch"
import { theme } from "@/lib/theme"

const baseAPIURL = `${pluginsAPIURL}admin/blog/`

const ArticleCategoriesColumns = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    cell: ({ getValue }) => (
      <div className="font-medium" style={{ color: theme.colors.text.primary }}>
        {getValue()}
      </div>
    ),
  },
  {
    id: "description",
    header: "Description",
    accessorKey: "description",
    cell: ({ getValue }) => (
      <div className="markdownReadOnly max-w-xs truncate" style={{ color: theme.colors.text.secondary }}>
        {getValue() ? `${getValue().substring(0, 60)}...` : "-"}
      </div>
    ),
  },
  {
    id: "slug",
    header: "Slug",
    accessorKey: "slug",
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <Tag className="mr-2 h-4 w-4 text-gray-400" />
        <span className="text-sm font-mono" style={{ color: theme.colors.text.secondary }}>
          {getValue() || "-"}
        </span>
      </div>
    ),
  },
  {
    id: "logo_url",
    header: "Logo",
    accessorKey: "logo_url",
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
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
            <ImageIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
    ),
  },
  {
    id: "published",
    header: "Status",
    accessorKey: "published",
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            getValue() ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {getValue() ? "Published" : "Draft"}
        </span>
      </div>
    ),
  },
  {
    id: "parent_id",
    header: "Parent",
    accessorKey: "parent_id",
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        {getValue() ? (
          <div className="flex items-center">
            <Layers className="mr-2 h-4 w-4 text-gray-400" />
            <IMForeignKeyTableCell
              id={getValue()}
              apiRouteName="admin/blog/article_categories"
              viewRoute="article_categories"
              titleKey="name"
            />
          </div>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    accessorKey: "actions",
    cell: (data) => <ActionsItemView data={data} />,
  },
]

function ActionsItemView({ data }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleView = (item) => {
    router.push(`./article_categories/view?id=${item.id}`)
  }

  const handleEdit = (item) => {
    router.push(`./article_categories/update?id=${item.id}`)
  }

  const handleDelete = async (item) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setIsDeleting(true)
      try {
        const path = baseAPIURL + "article_categories/delete"
        await authPost(path, { id: item.id })
        window.location.reload()
      } catch (error) {
        console.error("Error deleting category:", error)
        alert("Failed to delete category. Please try again.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "34px",
    height: "34px",
    borderRadius: theme.borderRadius.md,
    transition: theme.transitions.normal,
    marginRight: theme.spacing[2],
  }

  return (
    <div className="flex items-center justify-end">
      <button
        onClick={() => handleView(data.row.original)}
        style={{
          ...buttonStyle,
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
          ...buttonStyle,
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
          ...buttonStyle,
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

function ArticleCategoriesListView() {
  const [isLoading, setIsLoading] = useState(true)
  const [articleCategories, setArticleCategories] = useState([])
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [user, token, loading] = useCurrentUser()

  const columns = useMemo(() => ArticleCategoriesColumns, [])

  const table = useReactTable({
    data: articleCategories,
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

        const response = await fetch(baseAPIURL + "article_categories/list", config)

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [loading, token])

  useEffect(() => {
    setArticleCategories(data)
  }, [globalFilter, data])

  const router = useRouter()

  return (
    <div className="max-w-[1600px] mx-auto">
      <div
        className="rounded-lg overflow-hidden border shadow-md"
        style={{
          backgroundColor: theme.colors.surface.secondary,
          borderColor: theme.colors.border.light,
        }}
      >
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: theme.colors.border.light }}
        >
          <h1 className="text-2xl font-semibold" style={{ color: theme.colors.text.primary }}>
            Article Categories
          </h1>
          <button
            onClick={() => router.push("./article_categories/add")}
            className="flex items-center px-4 py-2 rounded-md transition-colors"
            style={{
              backgroundColor: theme.colors.accent.primary,
              color: "#ffffff",
            }}
          >
            <Plus size={18} className="mr-2" />
            Add New Category
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search categories..."
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-md transition-colors"
                style={{
                  backgroundColor: theme.colors.surface.tertiary,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={18}
                style={{ color: theme.colors.text.secondary }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center px-3 py-2 rounded-md transition-colors"
                style={{
                  backgroundColor: theme.colors.surface.tertiary,
                  color: theme.colors.text.secondary,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: theme.colors.border.light,
                }}
              >
                <Filter size={16} className="mr-2" />
                Filters
              </button>
              <button
                className="flex items-center px-3 py-2 rounded-md transition-colors"
                style={{
                  backgroundColor: theme.colors.surface.tertiary,
                  color: theme.colors.text.secondary,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: theme.colors.border.light,
                }}
              >
                <SlidersHorizontal size={16} className="mr-2" />
                Columns
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border" style={{ borderColor: theme.colors.border.light }}>
            <div className="overflow-x-auto">
              <table className="w-full">
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
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{
                            color: theme.colors.text.secondary,
                            borderBottom: `1px solid ${theme.colors.border.light}`,
                          }}
                        >
                          <div className="flex items-center">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && <ArrowUpDown className="ml-2 h-4 w-4" />}
                          </div>
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
                        className="px-6 py-12 text-center"
                        style={{ color: theme.colors.text.secondary }}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Loader2
                            className="h-8 w-8 animate-spin mb-4"
                            style={{ color: theme.colors.accent.primary }}
                          />
                          <p>Loading categories...</p>
                        </div>
                      </td>
                    </tr>
                  ) : table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-6 py-12 text-center"
                        style={{ color: theme.colors.text.secondary }}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-8 w-8 mb-4" style={{ color: theme.colors.text.tertiary }} />
                          <p className="mb-2">No categories found</p>
                          <p className="text-sm">Try adjusting your search or create a new category</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors"
                        style={{
                          borderBottom: `1px solid ${theme.colors.border.light}`,
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
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
              className="flex items-center justify-between px-6 py-4 border-t"
              style={{ borderColor: theme.colors.border.light }}
            >
              <div className="flex items-center">
                <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
                  Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length,
                  )}{" "}
                  of {table.getFilteredRowModel().rows.length} results
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="px-3 py-1 rounded-md text-sm"
                  style={{
                    backgroundColor: theme.colors.surface.tertiary,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                >
                  {[10, 20, 30, 50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize} rows
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="p-1 rounded-md"
                    style={{
                      backgroundColor: theme.colors.surface.tertiary,
                      color: table.getCanPreviousPage() ? theme.colors.text.primary : theme.colors.text.disabled,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: theme.colors.border.light,
                      opacity: table.getCanPreviousPage() ? 1 : 0.5,
                    }}
                  >
                    <ChevronsLeft size={18} />
                  </button>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="p-1 rounded-md"
                    style={{
                      backgroundColor: theme.colors.surface.tertiary,
                      color: table.getCanPreviousPage() ? theme.colors.text.primary : theme.colors.text.disabled,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: theme.colors.border.light,
                      opacity: table.getCanPreviousPage() ? 1 : 0.5,
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="px-4 py-1 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </span>

                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-1 rounded-md"
                    style={{
                      backgroundColor: theme.colors.surface.tertiary,
                      color: table.getCanNextPage() ? theme.colors.text.primary : theme.colors.text.disabled,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: theme.colors.border.light,
                      opacity: table.getCanNextPage() ? 1 : 0.5,
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="p-1 rounded-md"
                    style={{
                      backgroundColor: theme.colors.surface.tertiary,
                      color: table.getCanNextPage() ? theme.colors.text.primary : theme.colors.text.disabled,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: theme.colors.border.light,
                      opacity: table.getCanNextPage() ? 1 : 0.5,
                    }}
                  >
                    <ChevronsRight size={18} />
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

export default ArticleCategoriesListView

