"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react'
import { IMDateTableCell, IMForeignKeyTableCell } from '../../../../../admin/components/forms/table'
import { pluginsAPIURL } from '../../../../../config/config'
import useCurrentUser from '../../../../../modules/auth/hooks/useCurrentUser'
import { authPost } from '../../../../../modules/auth/utils/authFetch'
import { theme } from '../../../../../lib/theme'

const baseAPIURL = `${pluginsAPIURL}admin/social-network/`

interface Comment {
  id: string
  authorID: string
  commentText: string
  createdAt: string
  postID: string
}

const CommentsColumns = [
  {
    header: "Author",
    accessorKey: "authorID",
    cell: ({ getValue }) => (
      <IMForeignKeyTableCell 
        id={getValue()} 
        apiRouteName="admin/social-network/users" 
        viewRoute="users"
        titleKey="email"
        style={theme.listView.nameCell}
      />
    ),
  },
  {
    header: "Content",
    accessorKey: "commentText",
    cell: ({ getValue }) => <div style={theme.listView.nameCell}>{getValue()}</div>,
  },
  {
    header: "Date",
    accessorKey: "createdAt",
    cell: ({ getValue }) => <IMDateTableCell timestamp={getValue()} />,
  },
  {
    header: "Post",
    accessorKey: "postID",
    cell: ({ getValue }) => (
      <IMForeignKeyTableCell 
        id={getValue()} 
        apiRouteName="admin/social-network/posts" 
        viewRoute="posts"
        titleKey="id"
        style={theme.listView.nameCell}
      />
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsItemView data={row.original} />,
  },
]

function ActionsItemView({ data }: { data: Comment }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleView = () => {
    const viewPath = `./view?id=${data.id}`
    router.push(viewPath)
  }

  const handleEdit = () => {
    const editPath = `./update?id=${data.id}`
    router.push(editPath)
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setIsProcessing(true)
      try {
        const path = baseAPIURL + "comments/delete"
        await authPost(path, { id: data.id })
        window.location.reload()
      } catch (error) {
        console.error("Error deleting comment:", error)
        alert("Failed to delete comment. Please try again.")
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
          ...theme.listView.actionButton,
          backgroundColor: "rgba(13, 148, 255, 0.15)",
          color: theme.colors.accent.primary,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
        title="View comment"
      >
        <Eye size={14} />
      </button>
      <button
        onClick={handleEdit}
        disabled={isProcessing}
        style={{
          ...theme.listView.actionButton,
          backgroundColor: "rgba(34, 197, 94, 0.15)",
          color: theme.colors.feedback.success,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
        title="Edit comment"
      >
        <Edit size={14} />
      </button>
      <button
        onClick={handleDelete}
        disabled={isProcessing}
        style={{
          ...theme.listView.actionButton,
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: theme.colors.feedback.error,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
        title="Delete comment"
      >
        {isProcessing ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={14} />}
      </button>
    </div>
  )
}

export default function CommentsListView() {
  const [comments, setComments] = useState<Comment[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, token, loading] = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (!user || loading) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const config = {
          headers: { Authorization: token },
        }
        const response = await fetch(`${baseAPIURL}comments/list`, config)
        const data = await response.json()

        if (data) {
          setComments(data)
        } else {
          setError("Access denied or no data available")
        }
      } catch (error) {
        console.error("Error fetching comments:", error)
        setError("Failed to load comments. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, token, loading])

  const table = useReactTable<Comment>({
    data: comments,
    columns: CommentsColumns,
    getCoreRowModel: getCoreRowModel<Comment>(),
    getPaginationRowModel: getPaginationRowModel<Comment>(),
    getFilteredRowModel: getFilteredRowModel<Comment>(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const handleAddNew = () => {
    router.push("./add")
  }

  if (error) {
    return (
      <div style={theme.listView.card}>
        <div style={theme.listView.cardHeader}>
          <h1 style={theme.listView.title}>
            <MessageSquare size={24} style={{ color: theme.colors.accent.primary }} />
            Comments
          </h1>
        </div>
        <div style={theme.listView.cardBody}>
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              color: theme.colors.feedback.error,
              fontSize: theme.typography.fontSizes.lg,
            }}
          >
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={theme.listView.card}>
      <div style={theme.listView.cardHeader}>
        <h1 style={theme.listView.title}>
          <MessageSquare size={24} style={{ color: theme.colors.accent.primary }} />
          Comments
        </h1>
        <button
          onClick={handleAddNew}
          style={{
            ...theme.listView.actionButton,
            backgroundColor: theme.colors.accent.primary,
            color: "white",
            padding: "8px 16px",
          }}
        >
          Add New
        </button>
      </div>
      <div style={theme.listView.cardBody}>
        <div style={theme.listView.searchContainer}>
          <input
            type="text"
            placeholder="Search comments..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={theme.listView.searchInput}
          />
          <Search size={18} style={theme.listView.searchIcon} />
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
                    colSpan={CommentsColumns.length}
                    style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                  >
                    <div style={theme.listView.loadingContainer}>
                      <Loader2 size={24} style={{ animation: "spin 1s linear infinite", marginRight: "12px" }} />
                      Loading comments...
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={CommentsColumns.length}
                    style={{ ...theme.listView.tableCell, textAlign: "center", padding: "24px" }}
                  >
                    <div style={theme.listView.emptyContainer}>
                      <div style={theme.listView.emptyIconContainer}>
                        <MessageSquare size={32} style={{ color: theme.colors.text.secondary }} />
                      </div>
                      <div style={theme.listView.emptyTitle}>No comments found</div>
                      <div style={theme.listView.emptyMessage}>
                        Try adjusting your search or add new comments.
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
  )
}