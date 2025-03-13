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

const baseAPIURL = `${pluginsAPIURL}admin/subscriptions/`

export const getStaticProps: GetStaticProps = async () => {
  return { props: { isAdminRoute: true } }
}

const PaymentMethodsColumns = [
  
      {
          Header: "ID",
          accessor: "id",
      },
      {
          Header: "Provider",
          accessor: "provider",
      },
      {
          Header: "Details",
          accessor: "details",
      },
      {
          Header: "Is Default",
          accessor: "is_default",
          Cell: data => (
              <IMToggleSwitchComponent isChecked={data.value} disabled />
          )
      },
      {
          Header: "Stripe Customer ID",
          accessor: "stripeCustomerID",
      },
      {
          Header: "Brand",
          accessor: "brand",
      },
      {
          Header: "Last 4",
          accessor: "last4",
      },
      {
          Header: "Expiry Month",
          accessor: "expiryMonth",
      },
      {
          Header: "Expiry Year 4",
          accessor: "expiryYear",
      },
      {
          Header: "User",
          accessor: "userID",
          Cell: data => (
              <IMForeignKeyTableCell id={data.value} apiRouteName="admin/subscriptions/users" viewRoute="users"
          titleKey="email" />
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
      const path = baseAPIURL + 'payment_methods/delete'
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

function PaymentMethodsListView(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [PaymentMethods, setPaymentMethods] = useState([])
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  const [user, token, loading] = useCurrentUser()

  const columns = useMemo(() => PaymentMethodsColumns, [])

  const table = useReactTable({
    data: PaymentMethods,
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
        'payment_methods/list' +
        (extraQueryParams ? extraQueryParams : ''),
      config,
    )
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const payment_methods = data
        setData(payment_methods)

        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }, [loading])

  useEffect(() => {
    setPaymentMethods(data)
  }, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize, data])

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
                <h1>Payment Methods</h1>
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
                                header.getContext()
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
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr>
                        {isLoading ? (
                          <td colSpan={PaymentMethodsColumns.length - 1}>
                            <p>Loading...</p>
                          </td>
                        ) : (
                          <td colSpan={PaymentMethodsColumns.length - 1}>
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

export default PaymentMethodsListView
