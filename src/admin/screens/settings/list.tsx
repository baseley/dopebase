// @ts-nocheck
'use client'
import React, { useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table'
import { IMDateTableCell } from '../../components/forms/table/IMDateTableCell'
import useCurrentUser from '../../../modules/auth/hooks/useCurrentUser'
import { authFetch, authPost } from '../../../modules/auth/utils/authFetch'
import styles from '../../themes/admin.module.css'
import { websiteURL } from '../../../config/config'

const SettingsColumns = [
  {
    header: 'Settings Name',
    accessorKey: 'name',
  },
  {
    header: 'Settings Value',
    accessorKey: 'value',
  },
  {
    header: 'Created Date',
    accessorKey: 'created_at',
    cell: ({ getValue }) => <IMDateTableCell timestamp={getValue()} />,
  },
  {
    header: 'Updated Date',
    accessorKey: 'updated_at',
    cell: ({ getValue }) => <IMDateTableCell timestamp={getValue()} />,
  },
  {
    header: 'Actions',
    accessorKey: 'actions',
    cell: ({ row }) => <ActionsItemView data={row.original} />,
  },
]

function ActionsItemView({ data }) {
  const router = useRouter()

  const handleView = () => router.push(`./settings/view?id=${data.id}`)
  const handleEdit = () => router.push(`./settings/update?id=${data.id}`)
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await authPost(`${websiteURL}api/system/settings/delete`, { id: data.id })
      window.location.reload()
    }
  }

  return (
    <div className={styles.inlineActionsContainer}>
      <button onClick={handleView} className={styles.btnSm}><i className="fa fa-eye"></i></button>
      <button onClick={handleEdit} className={styles.btnSm}><i className="fa fa-edit"></i></button>
      <button onClick={handleDelete} className={styles.btnSm}><i className="fa fa-times"></i></button>
    </div>
  )
}

function SettingsListView() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [user, token, loading] = useCurrentUser()

  useEffect(() => {
    if (user && !loading) {
      authFetch(`${websiteURL}api/system/settings/list`).then(response => {
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
  })

  return (
    <div className={styles.adminContent}>
      <div className="Card">
        <div className="CardHeader">
          <a className={styles.AddLink} href="./settings/add">Add New</a>
          <h1>Settings</h1>
        </div>
        <div className="CardBody">
          <input
            type="text"
            placeholder="Search..."
            onChange={e => table.getColumn('name')?.setFilterValue(e.target.value)}
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
              {isLoading && <tr><td colSpan={SettingsColumns.length}>Loading...</td></tr>}
            </tbody>
          </table>
          <div className={styles.Pagination}>
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>&laquo;</button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>&lt;</button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>&gt;</button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>&raquo;</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsListView
