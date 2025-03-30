"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"
import { Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { IMDateTableCell } from "@/admin/components/forms/table/IMDateTableCell"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authFetch, authPost } from "@/modules/auth/utils/authFetch"
import { websiteURL } from "@/config/config"
import { theme } from "@/lib/theme"

const SettingsColumns = [
  {
    header: "Settings Name",
    accessorKey: "name",
  },
  {
    header: "Settings Value",
    accessorKey: "value",
  },
  {
    header: "Created Date",
    accessorKey: "created_at",
    cell: ({ getValue }: any) => <IMDateTableCell timestamp={getValue()} />,
  },
  {
    header: "Updated Date",
    accessorKey: "updated_at",
    cell: ({ getValue }: any) => <IMDateTableCell timestamp={getValue()} />,
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }: any) => <ActionsItemView data={row.original} />,
  },
]

function ActionsItemView({ data }: any) {
  const router = useRouter()

  const handleView = () => router.push(`./settings/view?id=${data.id}`)
  const handleEdit = () => router.push(`./settings/update?id=${data.id}`)
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await authPost(`${websiteURL}api/system/settings/delete`, { id: data.id })
      window.location.reload()
    }
  }

  const buttonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: theme.borderRadius.md,
    transition: theme.transitions.normal,
    marginRight: theme.spacing[2],
  }

  return (
    <div className="flex items-center">
      <button
        onClick={handleView}
        style={{
          ...buttonStyle,
          backgroundColor: theme.colors.state.hover,
          color: theme.colors.text.primary,
        }}
        title="View"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={handleEdit}
        style={{
          ...buttonStyle,
          backgroundColor: theme.colors.accent.muted,
          color: theme.colors.accent.primary,
        }}
        title="Edit"
      >
        <Edit size={16} />
      </button>
      <button
        onClick={handleDelete}
        style={{
          ...buttonStyle,
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: theme.colors.feedback.error,
        }}
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

function SettingsListView() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [user, token, loading] = useCurrentUser()
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    if (user && !loading) {
      authFetch(`${websiteURL}api/system/settings/list`).then((response) => {
        setData(response?.data || [])
        setIsLoading(false)
      })
    }
  }, [user, loading])

  const table = useReactTable({
    data,
    columns: SettingsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchValue,
    },
    onGlobalFilterChange: setSearchValue,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    overflow: "hidden",
    border: `1px solid ${theme.colors.border.light}`,
  }

  const cardHeaderStyle: React.CSSProperties = {
    padding: theme.spacing[6],
    borderBottom: `1px solid ${theme.colors.border.light}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }

  const cardBodyStyle: React.CSSProperties = {
    padding: theme.spacing[6],
  }

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    borderSpacing: "0",
  }

  const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface.tertiary,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    textAlign: "left",
    padding: theme.table.cellPadding,
    borderBottom: `1px solid ${theme.colors.border.light}`,
  }

  const tableCellStyle: React.CSSProperties = {
    padding: theme.table.cellPadding,
    borderBottom: `1px solid ${theme.colors.border.light}`,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSizes.sm,
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 16px",
    backgroundColor: theme.colors.surface.tertiary,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
    fontSize: theme.typography.fontSizes.sm,
    outline: "none",
    transition: theme.transitions.normal,
  }

  const buttonPrimaryStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 16px",
    backgroundColor: theme.colors.accent.primary,
    color: "#ffffff",
    borderRadius: theme.borderRadius.md,
    fontWeight: theme.typography.fontWeights.medium,
    transition: theme.transitions.normal,
    cursor: "pointer",
    border: "none",
    fontSize: theme.typography.fontSizes.sm,
  }

  const paginationStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: theme.spacing[4],
    gap: theme.spacing[2],
  }

  const paginationButtonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    backgroundColor: theme.colors.surface.tertiary,
    color: theme.colors.text.primary,
    borderRadius: theme.borderRadius.md,
    transition: theme.transitions.normal,
    cursor: "pointer",
    border: "none",
  }

  const paginationTextStyle: React.CSSProperties = {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSizes.sm,
    margin: `0 ${theme.spacing[2]}`,
  }

  return (
    <div style={{ maxWidth: theme.content.maxWidth, margin: "0 auto" }}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h1
            style={{
              fontSize: theme.typography.fontSizes["2xl"],
              fontWeight: theme.typography.fontWeights.semibold,
              color: theme.colors.text.primary,
              margin: 0,
            }}
          >
            Settings
          </h1>
          <a href="./settings/add" style={buttonPrimaryStyle}>
            <Plus size={16} style={{ marginRight: "8px" }} />
            Add New
          </a>
        </div>
        <div style={cardBodyStyle}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search settings..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={inputStyle}
            />
            <Search
              size={18}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                marginTop: "-8px",
                color: theme.colors.text.secondary,
              }}
            />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} style={tableHeaderStyle}>
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
                      colSpan={SettingsColumns.length}
                      style={{ ...tableCellStyle, textAlign: "center", padding: "24px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                        <div
                          className="animate-spin"
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: `2px solid ${theme.colors.accent.primary}`,
                            borderTopColor: "transparent",
                          }}
                        ></div>
                        Loading settings...
                      </div>
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={SettingsColumns.length}
                      style={{ ...tableCellStyle, textAlign: "center", padding: "24px" }}
                    >
                      No settings found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      style={{
                        transition: theme.transitions.normal,
                        backgroundColor: theme.colors.surface.secondary,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.state.hover)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surface.secondary)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} style={tableCellStyle}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={paginationStyle}>
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              style={{
                ...paginationButtonStyle,
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
                ...paginationButtonStyle,
                opacity: !table.getCanPreviousPage() ? 0.5 : 1,
                cursor: !table.getCanPreviousPage() ? "not-allowed" : "pointer",
              }}
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span style={paginationTextStyle}>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              style={{
                ...paginationButtonStyle,
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
                ...paginationButtonStyle,
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
  )
}

export default SettingsListView

