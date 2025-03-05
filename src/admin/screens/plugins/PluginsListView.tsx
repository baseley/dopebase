'use client'
import React, { useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IMDateTableCell } from '../../components/forms/table/IMDateTableCell'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table'
import useCurrentUser from '../../../modules/auth/hooks/useCurrentUser'
import { authFetch, authPost } from '../../../modules/auth/utils/authFetch'
import { websiteURL } from '../../../config/config'
import styles from '../../themes/admin.module.css'

const pluginsColumns = [
  { accessorKey: 'id', header: 'Identifier' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'version', header: 'Version' },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ getValue }) => <IMDateTableCell timestamp={getValue()} />,
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionsItemView data={row} />,
  },
]

function ActionsItemView({ data }) {
  const item = data.original
  const handleInstall = async item => {
    await authPost(`${websiteURL}api/system/plugins/install?id=${item.id}`)
    window.location.reload()
  }

  const handleUninstall = async item => {
    if (window.confirm('Are you sure you want to uninstall this plugin?')) {
      await authPost(`${websiteURL}api/system/plugins/uninstall?id=${item.id}`)
      window.location.reload()
    }
  }

  return (
    <div className={styles.inlineActionsContainer}>
      {item.installed ? (
        <button onClick={() => handleUninstall(item)} className="btn btn-info btn-sm">
          Uninstall
        </button>
      ) : (
        <button onClick={() => handleInstall(item)} className="btn btn-success btn-sm">
          Install
        </button>
      )}
    </div>
  )
}

export const PluginsListView = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [error, setError] = useState<string | null>(null)
  const [user, , loading] = useCurrentUser()

  const columns = useMemo(() => pluginsColumns, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  useEffect(() => {
    const fetchData = async () => {
      const response = await authFetch(`${websiteURL}api/system/plugins`)
      response?.data.plugins ? setData(response.data.plugins) : setError('Access denied')
      setIsLoading(false)
    }
    if (user && !loading) fetchData()
  }, [user, loading])

  if (error) return <>{error}</>

  return (
    <div className={`content ${styles.content}`}>
      <div className="Card">
        <div className="CardHeader">
          <h4>Plugins</h4>
        </div>
        <div className={styles.CardBody}>
          <input
            className={`${styles.SearchInput} SearchInput`}
            type="text"
            placeholder="Search..."
            value={table.getState().globalFilter || ''}
            onChange={e => table.setGlobalFilter(e.target.value)}
          />
          <table className={styles.Table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
              {isLoading && (
                <tr>
                  <td colSpan={columns.length}>
                    <p>Loading...</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className={styles.Pagination}>
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              «
            </button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              ‹
            </button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => table.setPageIndex(Number(e.target.value) - 1)}
              style={{ width: '100px' }}
            />
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}>
              {[10, 20, 30, 40, 50].map(size => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              ›
            </button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
