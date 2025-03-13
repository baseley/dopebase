// @ts-nocheck
'use client'
import React, { useMemo, useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/navigation'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import {
  IMLocationTableCell,
  IMSimpleLocationTableCell,
  IMColorsTableCell,
  IMMultimediaTableCell,
  IMObjectTableCell,
  IMImagesTableCell,
  IMDateTableCell,
  IMForeignKeyTableCell,
  IMAddressTableCell,
} from '../../../../../admin/components/forms/table'
import {
  IMColorBoxComponent,
  IMPhoto,
  IMModal,
  IMToggleSwitchComponent,
} from '../../../../../admin/components/forms/fields'
import { pluginsAPIURL } from '../../../../../config/config'
import useCurrentUser from '../../../../../modules/auth/hooks/useCurrentUser'
import { authPost } from '../../../../../modules/auth/utils/authFetch'
import styles from '../../../../../admin/themes/admin.module.css'
/* Insert extra imports for table cells here */

const baseAPIURL = `${pluginsAPIURL}admin/customer-support/`

export const getStaticProps: GetStaticProps = async () => {
  return { props: { isAdminRoute: true } }
}

const SettingsColumns = [
  
      {
          Header: "Settings Name",
          accessor: "name",
      },
      {
          Header: "Settings Value",
          accessor: "value",
      },
      {
          Header: "Created Date",
          accessor: "created_at",
          Cell: data => (
              <IMDateTableCell timestamp={data.value} />
          )
      },
      {
          Header: "Updated Date",
          accessor: "updated_at",
          Cell: data => (
              <IMDateTableCell timestamp={data.value} />
          )
      },,
  {
    Header: 'Actions',
    accessor: 'actions',
    Cell: data => <ActionsItemView data={data} />,
  },
]

function ActionsItemView(props) {
  const { data } = props
  const router = useRouter()

  const handleView = item => {
    const viewPath = './view?id=' + item.id
    router.push(viewPath)
  }

  const handleEdit = item => {
    const editPath = './update?id=' + item.id
    router.push(editPath)
  }

  const handleDelete = async item => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const path = baseAPIURL + 'settings/delete'
      const response = await authPost(path, { id: item.id })
      window.location.reload(false)
    }
  }

  return (
    <div className={`${styles.inlineActionsContainer} inlineActionsContainer`}>
      <button
        onClick={() => handleView(data.row.original)}
        type="button"
        id="tooltip264453216"
        className={`${styles.btnSm} btn-icon btn btn-info btn-sm`}>
        <i className="fa fa-eye"></i>
      </button>
      <button
        onClick={() => handleEdit(data.row.original)}
        type="button"
        id="tooltip366246651"
        className={`${styles.btnSm} btn-icon btn btn-success btn-sm`}>
        <i className="fa fa-edit"></i>
      </button>
      <button
        onClick={() => handleDelete(data.row.original)}
        type="button"
        id="tooltip476609793"
        className={`${styles.btnSm} btn-icon btn btn-danger btn-sm`}>
        <i className="fa fa-times"></i>
      </button>
    </div>
  )
}

function SettingsListView(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [Settings, setSettings] = useState([])
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  const [user, token, loading] = useCurrentUser()

  const columns = useMemo(() => SettingsColumns, [])

  const table = useReactTable({
    data: Settings,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useEffect(() => {
    if (loading) {
      return
    }
    const config = {
      headers: { Authorization: token },
    }

    const extraQueryParams = null
    setIsLoading(true)

    fetch(
      baseAPIURL +
        'settings/list' +
        (extraQueryParams ? extraQueryParams : ''),
      config,
    )
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const settings = data
        setData(settings)

        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }, [loading])

  useEffect(() => {
    setSettings(data)
  }, [globalFilter, data])

  return (
    <>
      <div className={`${styles.adminContent} adminContent`}>
        <div className="row">
          <div className="col col-md-12">
            <div className="Card">
              <div className="CardHeader">
                <a
                  className={`${styles.Link} ${styles.AddLink} Link AddLink`}
                  href="./add">
                  Add New
                </a>
                <h1>Settings</h1>
              </div>
              <div className={`${styles.CardBody} CardBody`}>
                <div className={`${styles.TableContainer} TableContainer`}>
                  <input
                    className={`${styles.SearchInput} SearchInput`}
                    type="text"
                    placeholder="Search..."
                    value={globalFilter || ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                  />
                  <table className={`${styles.Table} Table`}>
                    <thead>
                      {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map(header => (
                            <th key={header.id}>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr>
                        {isLoading ? (
                          <td colSpan={SettingsColumns.length - 1}>
                            <p>Loading...</p>
                          </td>
                        ) : (
                          <td colSpan={SettingsColumns.length - 1}>
                            <p className={`${styles.PaginationDetails} PaginationDetails`}>
                              Showing {table.getRowModel().rows.length} of {data.length} results
                            </p>
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                  <div className={`${styles.Pagination} Pagination`}>
                    <div className={`${styles.LeftPaginationButtons} LeftPaginationButtons`}>
                      <button
                        onClick={() => table.setPageIndex(0)}
                        className={`${styles.PaginationButton}`}
                        disabled={!table.getCanPreviousPage()}>
                        <i className="fa fa-angle-double-left"></i>
                      </button>
                      <button
                        onClick={() => table.previousPage()}
                        className={`${styles.PaginationButton}`}
                        disabled={!table.getCanPreviousPage()}>
                        <i className="fa fa-angle-left"></i>
                      </button>
                    </div>
                    <div className={`${styles.CenterPaginationButtons}`}>
                      <span>
                        Page{' '}
                        <strong>
                          {table.getState().pagination.pageIndex + 1} of{' '}
                          {table.getPageCount()}
                        </strong>
                      </span>
                      <span>
                        | Go to page:{' '}
                        <input
                          type="number"
                          defaultValue={table.getState().pagination.pageIndex + 1}
                          onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                          }}
                          style={{ width: '100px' }}
                        />
                      </span>
                      <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                          table.setPageSize(Number(e.target.value))
                        }}>
                        {[10, 20, 30, 40, 50].map(pageSize => (
                          <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={`${styles.RightPaginationButtons}`}>
                      <button
                        onClick={() => table.nextPage()}
                        className={`${styles.PaginationButton}`}
                        disabled={!table.getCanNextPage()}>
                        <i className="fa fa-angle-right"></i>
                      </button>
                      <button
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        className={`${styles.PaginationButton}`}
                        disabled={!table.getCanNextPage()}>
                        <i className="fa fa-angle-double-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsListView
