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
import IMArticleTagsForeignKeysArrayIdTableCell from '../../components/tableCells/IMArticleTagsForeignKeysArrayIdTableCell.js'


const baseAPIURL = `${pluginsAPIURL}admin/blog/`

export const getStaticProps: GetStaticProps = async () => {
  return { props: { isAdminRoute: true } }
}

const ArticlesColumns = [
  
      {
          id:"title",
          header: "Title",
          accessorKey: "title",
      },
      {
          id:"content",
          header: "Content",
          accessorkey: "content",
          cell: data => (
              <div className='markdownReadOnly'>{data?.value && data.value.substring(0, 100)}...</div>
          )
      },
      {
          id:"cover_photo",
          header: "Cover Photo",
          accessorKey: "cover_photo",
          cell: data => (
              <IMImagesTableCell singleImageURL={data.value} />
          )
      },
      {
          id:"photo_urls",
          header: "Photos",
          accessorKey: "photo_urls",
          cell: data => (
              <IMImagesTableCell imageURLs={data.value} />
          )
      },
      {
          id:"source_code_url",
          header: "Github URL",
          accessorKey: "source_code_url",
      },
      {
          id:"canonical_url",
          header: "Canonical URL",
          accessorKey: "canonical_url",
      },
      {
          id:"published",
          header: "Published",
          accessorKey: "published",
          cell: data => (
              <IMToggleSwitchComponent isChecked={data.value} disabled />
          )
      },
      {
          id:"outdated",
          header: "Outdated",
          accessorKey: "outdated",
          cell: data => (
              <IMToggleSwitchComponent isChecked={data.value} disabled />
          )
      },
      {
          id:"slug",
          header: "Slug",
          accessorKey: "slug",
      },
      {
          id:"seo_title",
          header: "SEO Title",
          accessorKey: "seo_title",
      },
      {
          id:"seo_description",
          header: "SEO Description",
          accessorKey: "seo_description",
      },
      {
          id:"seo_keyword",
          header: "SEO Keyword",
          accessorKey: "seo_keyword",
      },
      {
          id:"author_id",
          header: "Author",
          accessorKey: "author_id",
          cell: data => (
              <IMForeignKeyTableCell id={data.value} apiRouteName="admin/blog/users" viewRoute="users"
          titleKey="title" />
          )
      },
      {
          id:"category_id",
          header: "Category",
          accessorKey: "category_id",
          cell: data => (
              <IMForeignKeyTableCell id={data.value} apiRouteName="admin/blog/article_categories" viewRoute="article_categories"
          titleKey="name" />
          )
      },
      {
          id:"tags",
          header: "ArticleTags",
          accessorKey: "tags",
          cell: data => (
              <IMArticleTagsForeignKeysArrayIdTableCell tagsArray={data.value} />
          )
      },
      {
          id:"created_at",
          header: "Created At",
          accessorKey: "created_at",
          cell: data => (
              <IMDateTableCell timestamp={data.value} />
          )
      },
      {
          id:"updated_at",
          header: "Updated At",
          accessorKey: "updated_at",
          cell: data => (
              <IMDateTableCell timestamp={data.value} />
          )
      },,
      {
        id: 'actions',
        header: 'Actions',
        accessorKey: 'actions',
        cell: data => <ActionsItemView data={data} />,
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
      const path = baseAPIURL + 'articles/delete'
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

function ArticlesListView(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [Articles, setArticles] = useState([])
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  const [user, token, loading] = useCurrentUser()

  const columns = useMemo(() => ArticlesColumns, [])

  const table = useReactTable({
    data: Articles,
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
        'articles/list' +
        (extraQueryParams ? extraQueryParams : ''),
      config,
    )
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const articles = data
        setData(articles)

        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }, [loading])

  useEffect(() => {
    setArticles(data)
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
                <h1>Articles</h1>
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
                          <td colSpan={ArticlesColumns.length - 1}>
                            <p>Loading...</p>
                          </td>
                        ) : (
                          <td colSpan={ArticlesColumns.length - 1}>
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

export default ArticlesListView
