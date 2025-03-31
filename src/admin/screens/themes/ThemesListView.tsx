"use client"

import { useEffect, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"
import { Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Palette, Loader2 } from "lucide-react"
import useCurrentUser from "@/modules/auth/hooks/useCurrentUser"
import { authFetch, authPost } from "@/modules/auth/utils/authFetch"
import { websiteURL } from "@/config/config"

// Import shadcn components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const themesColumns = [
  {
    header: "Identifier",
    accessorKey: "id",
    cell: ({ getValue }) => <div className="font-mono text-sm text-muted-foreground">{getValue()}</div>,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ getValue }) => (
      <div className="max-w-md">
        {getValue() || <span className="text-muted-foreground italic">No description</span>}
      </div>
    ),
  },
  {
    header: "Version",
    accessorKey: "version",
    cell: ({ getValue }) => (
      <Badge variant="outline" className="font-mono">
        v{getValue()}
      </Badge>
    ),
  },
  {
    accessorKey: "actions",
    header: "Status",
    cell: ({ row }) => <ActionsItemView data={row} />,
  },
]

function ActionsItemView({ data }) {
  const item = data.original
  const [isActivating, setIsActivating] = useState(false)

  const handleInstall = async () => {
    if (window.confirm("Are you sure you want to activate this theme? Changes will apply immediately.")) {
      setIsActivating(true)
      try {
        await authPost(`${websiteURL}api/system/themes/use?theme=${item.id}`)
        window.location.reload()
      } catch (error) {
        console.error("Error activating theme:", error)
        alert("Failed to activate theme. Please try again.")
        setIsActivating(false)
      }
    }
  }

  if (item.selected) {
    return (
      <Badge variant="default" className="flex items-center gap-1.5">
        <Check className="h-3.5 w-3.5" />
        Active
      </Badge>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={handleInstall} disabled={isActivating} className="text-primary">
      {isActivating ? (
        <>
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          Activating...
        </>
      ) : (
        "Activate"
      )}
    </Button>
  )
}

export const ThemesListView = () => {
  const [themes, setThemes] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [user, , loading] = useCurrentUser()

  useEffect(() => {
    if (!user || loading) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await authFetch(`${websiteURL}api/system/themes`)
        if (response?.data?.themes) {
          const selectedTheme = response.data.selectedTheme
          const richThemes = response.data.themes.map((theme) => ({
            ...theme,
            selected: theme.id === selectedTheme?.id,
          }))
          setThemes(richThemes)
        }
      } catch (error) {
        console.error("Error fetching themes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, loading])

  const table = useReactTable({
    data: themes,
    columns: themesColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5 px-10 pt-10">
        <div>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Palette className="mr-2 h-6 w-6 text-primary" />
            Themes
          </CardTitle>
          <CardDescription className="mt-1.5">Manage and activate themes for your application</CardDescription>
        </div>
        <div className="max-w-sm">
          <Input
            type="text"
            placeholder="Search themes..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent className="px-10 pb-10">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={themesColumns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                      <p>Loading themes...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={themesColumns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Palette className="h-8 w-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-lg font-medium">No themes found</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or contact your administrator to add themes
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className={row.original.selected ? "bg-primary/5" : ""}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {!isLoading && (
              <>
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length,
                )}{" "}
                of {table.getFilteredRowModel().rows.length} themes
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            <span className="flex items-center gap-1 text-sm">
              <span className="font-medium">Page</span>
              <span>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
            </span>

            <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ThemesListView

