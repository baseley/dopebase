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
import { IMImagesTableCell, IMForeignKeyTableCell } from "../../../../../admin/components/forms/table"
import { IMToggleSwitchComponent } from "../../../../../admin/components/forms/fields"
import { pluginsAPIURL } from "../../../../../config/config"
import useCurrentUser from "../../../../../modules/auth/hooks/useCurrentUser"
import { authPost } from "../../../../../modules/auth/utils/authFetch"
import {
  Eye,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
} from "lucide-react"
import { theme } from "../../../../../lib/theme"

const baseAPIURL = `${pluginsAPIURL}admin/blog/`

function ActionsItemView({ data }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleView = () => {
    const viewPath = "./view?id=" + data.row.original.id
    router.push(viewPath)
  }

  const handleEdit = () => {
    const editPath = "./update?id=" + data.row.original.id
    router.push(editPath)
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setIsProcessing(true)
      try {
        const path = baseAPIURL + "categories/delete"
        await authPost(path, { id: data.row.original.id })
        window.location.reload()
      } catch (error) {
        console.error("Error deleting category:", error)
        alert("Failed to delete category. Please try again.")
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
          backgroundColor: "rgba(13, 148, 255, 0.15)",
          color: theme.colors.accent.primary,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
          border: "none",
          borderRadius: "4px",
          width: "28px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="View category"
      >
        <Eye size={14} />
      </button>
      <button
        onClick={handleEdit}
        disabled={isProcessing}
        style={{
          backgroundColor: "rgba(34, 197, 94, 0.15)",
          color: theme.colors.feedback.success,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
          border: "none",
          borderRadius: "4px",
          width: "28px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Edit category"
      >
        <Edit size={14} />
      </button>
      <button
        onClick={handleDelete}
        disabled={isProcessing}
        style={{
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: theme.colors.feedback.error,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
          border: "none",
          borderRadius: "4px",
          width: "28px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Delete category"
      >
        <Trash2 size={14} />
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

  const columns = useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        cell: (info) => <div style={{ fontWeight: "500", color: theme.colors.text.primary }}>{info.getValue()}</div>,
      },
      {
        id: "description",
        header: "Description",
        accessorKey: "description",
        cell: (info) => (
          <div
            style={{
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: theme.colors.text.primary,
            }}
          >
            {info.getValue() ? `${info.getValue().substring(0, 100)}...` : "-"}
          </div>
        ),
      },
      {
        id: "slug",
        header: "Slug",
        accessorKey: "slug",
        cell: (info) => <div style={{ color: theme.colors.text.secondary }}>{info.getValue()}</div>,
      },
      {
        id: "logo_url",
        header: "Logo",
        accessorKey: "logo_url",
        cell: (info) => <IMImagesTableCell singleImageURL={info.getValue()} />,
      },
      {
        id: "seo_title",
        header: "SEO Title",
        accessorKey: "seo_title",
        cell: (info) => <div style={{ color: theme.colors.text.primary }}>{info.getValue() || "-"}</div>,
      },
      {
        id: "seo_description",
        header: "SEO Description",
        accessorKey: "seo_description",
        cell: (info) => (
          <div
            style={{
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: theme.colors.text.secondary,
            }}
          >
            {info.getValue() ? `${info.getValue().substring(0, 100)}...` : "-"}
          </div>
        ),
      },
      {
        id: "canonical_url",
        header: "Canonical URL",
        accessorKey: "canonical_url",
        cell: (info) => (
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: theme.colors.text.secondary,
            }}
          >
            {info.getValue() || "-"}
          </div>
        ),
      },
      {
        id: "seo_image_url",
        header: "SEO Cover Image",
        accessorKey: "seo_image_url",
        cell: (info) => <IMImagesTableCell singleImageURL={info.getValue()} />,
      },
      {
        id: "published",
        header: "Published",
        accessorKey: "published",
        cell: (info) => <IMToggleSwitchComponent isChecked={info.getValue()} disabled />,
      },
      {
        id: "parent_id",
        header: "Parent Category",
        accessorKey: "parent_id",
        cell: (info) => (
          <IMForeignKeyTableCell
            id={info.getValue()}
            apiRouteName="admin/blog/categories"
            viewRoute="categories"
            titleKey="title"
          />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "actions",
        cell: (info) => <ActionsItemView data={info} />,
      },
    ],
    [],
  )

  const table = useReactTable({
    data: articleCategories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
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
    const config = {
      headers: { Authorization: token },
    }

    setIsLoading(true)

    fetch(baseAPIURL + "categories/list", config)
      .then((response) => response.json())
      .then((data) => {
        setData(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }, [loading, token])

  useEffect(() => {
    const startRow = table.getState().pagination.pageSize * table.getState().pagination.pageIndex
    const endRow = startRow + table.getState().pagination.pageSize

    setArticleCategories(data.slice(startRow, endRow))
  }, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize, data])

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        padding: "24px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: `1px solid ${theme.colors.border.default}`,
          width: "100%",
        }}
      >
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: theme.colors.text.primary,
            fontSize: "20px",
            fontWeight: "600",
            margin: 0,
          }}
        >
          <FileText size={24} style={{ color: theme.colors.accent.primary }} />
          Article Categories
        </h1>
        <a
          href="./add"
          style={{
            backgroundColor: theme.colors.accent.primary,
            color: "white",
            padding: "8px 16px",
            textDecoration: "none",
            borderRadius: "4px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "500",
          }}
        >
          Add New
        </a>
      </div>

      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            gap: "16px",
            width: "100%",
          }}
        >
          <div style={{ position: "relative", flex: "1" }}>
            <input
              type="text"
              placeholder="Search categories..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 16px 10px 40px",
                borderRadius: "6px",
                border: `1px solid ${theme.colors.border.default}`,
                fontSize: "14px",
                color: theme.colors.text.primary,
                backgroundColor: "white",
                boxSizing: "border-box",
              }}
            />
            <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>
              <Search size={16} color="#6B7280" />
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            borderRadius: "6px",
            border: `1px solid ${theme.colors.border.default}`,
            boxSizing: "border-box",
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              tableLayout: "fixed",
            }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        backgroundColor: "#f9fafb",
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: theme.colors.text.primary,
                        borderBottom: `1px solid ${theme.colors.border.default}`,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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
                    style={{ textAlign: "center", padding: "24px", color: theme.colors.text.primary }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                      <div
                        className="spinner"
                        style={{
                          width: "24px",
                          height: "24px",
                          border: "3px solid rgba(0, 0, 0, 0.1)",
                          borderRadius: "50%",
                          borderTop: `3px solid ${theme.colors.accent.primary}`,
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      Loading categories...
                    </div>
                    <style jsx>{`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}</style>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{ textAlign: "center", padding: "24px", color: theme.colors.text.primary }}
                  >
                    <div>
                      <div style={{ marginBottom: "12px" }}>
                        <FileText size={32} style={{ color: theme.colors.text.secondary }} />
                      </div>
                      <div style={{ fontWeight: 500, marginBottom: "4px" }}>No categories found</div>
                      <div style={{ color: theme.colors.text.secondary }}>
                        Try adjusting your search or add new categories to your collection.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: rowIndex % 2 === 0 ? "white" : "#f9fafb",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = rowIndex % 2 === 0 ? "white" : "#f9fafb")
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: theme.colors.text.primary,
                          borderBottom: `1px solid ${theme.colors.border.default}`,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
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
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
            padding: "12px 0",
            color: theme.colors.text.primary,
            width: "100%",
          }}
        >
          <div style={{ fontSize: "14px", color: theme.colors.text.secondary }}>
            Showing {table.getRowModel().rows.length} of {data.length} results
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              style={{
                padding: "6px 10px",
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: "4px",
                backgroundColor: "white",
                color: theme.colors.text.primary,
                cursor: table.getCanPreviousPage() ? "pointer" : "not-allowed",
                opacity: table.getCanPreviousPage() ? 1 : 0.5,
              }}
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              style={{
                padding: "6px 10px",
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: "4px",
                backgroundColor: "white",
                color: theme.colors.text.primary,
                cursor: table.getCanPreviousPage() ? "pointer" : "not-allowed",
                opacity: table.getCanPreviousPage() ? 1 : 0.5,
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: "14px" }}>
              Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
              <strong>{table.getPageCount()}</strong>
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              style={{
                padding: "6px 10px",
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: "4px",
                backgroundColor: "white",
                color: theme.colors.text.primary,
                cursor: table.getCanNextPage() ? "pointer" : "not-allowed",
                opacity: table.getCanNextPage() ? 1 : 0.5,
              }}
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              style={{
                padding: "6px 10px",
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: "4px",
                backgroundColor: "white",
                color: theme.colors.text.primary,
                cursor: table.getCanNextPage() ? "pointer" : "not-allowed",
                opacity: table.getCanNextPage() ? 1 : 0.5,
              }}
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
                padding: "6px 10px",
                borderRadius: "4px",
                border: `1px solid ${theme.colors.border.default}`,
                backgroundColor: "white",
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

export default ArticleCategoriesListView
