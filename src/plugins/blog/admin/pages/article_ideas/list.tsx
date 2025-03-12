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
import GenerateIdeasForm from '../../components/GenerateIdeasForm'

const baseAPIURL = `${pluginsAPIURL}admin/blog/`

export const getStaticProps: GetStaticProps = async () => {
  return { props: { isAdminRoute: true } }
}

const ArticleIdeasColumns = [
  {
    id: 'title',
    header: 'Title',
    accessorKey: 'title',
  },
  {
    id: 'sections',
    header: 'Sections',
    accessorKey: 'sections',
  },
  {
    id: 'tags',
    header: 'Tags',
    accessorKey: 'tags',
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
  },
  {
    id: 'extra_prompt',
    header: 'Extra Prompt',
    accessorKey: 'extra_prompt',
  },
  {
    id: 'social_media_post',
    header: 'Social Media',
    accessorKey: 'social_media_post',
  },
  {
    id: 'seo_description',
    header: 'SEO Description',
    accessorKey: 'seo_description',
  },
  {
    id: 'summary',
    header: 'Summary',
    accessorKey: 'summary',
  },
  {
    id: 'topic',
    header: 'Topic',
    accessorKey: 'topic',
  },
  {
    id: 'category',
    header: 'Category',
    accessorKey: 'category',
  },
  {
    id: 'created_at',
    header: 'Created Date',
    accessorKey: 'created_at',
    Cell: data => <IMDateTableCell timestamp={data.getValue()} />,
  },
  {
    id: 'updated_at',
    header: 'Updated Date',
    accessorKey: 'updated_at',
    Cell: data => <IMDateTableCell timestamp={data.getValue()} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    accessorKey: 'actions',
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
      const path = baseAPIURL + 'ai/generate-articles'
      const response = await authPost(path)
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

function ArticleIdeasListView(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [ArticleIdeas, setArticleIdeas] = useState([])
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  const [user, token, loading] = useCurrentUser()

  const columns = useMemo(() => ArticleIdeasColumns, [])

  const table = useReactTable({
    data: ArticleIdeas,
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
        'article_ideas/list' +
        (extraQueryParams ? extraQueryParams : ''),
      config,
    )
      .then(response => response.json())
      .then(data => {
        const article_ideas = data
        setData(article_ideas)
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }, [loading])

  useEffect(() => {
    setArticleIdeas(data)
  }, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize, data])

  const generateArticles = async () => {
    if (
      window.confirm(
        'Are you sure you want to generate articles for all ideas?',
      )
    ) {
      setIsLoading(true)
      const path = baseAPIURL + 'ai/generate-articles'
      const response = await authPost(path, {})
      setIsLoading(false)
      window.location.reload(false)
    }
  }

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
                <h1>Ideas</h1>
              </div>
              <GenerateIdeasForm />
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
                          <td colSpan={ArticleIdeasColumns.length - 1}>
                            <p>Loading...</p>
                          </td>
                        ) : (
                          <td colSpan={ArticleIdeasColumns.length - 1}>
                            <p className={`${styles.PaginationDetails} PaginationDetails`}>
                              Showing {table.getRowModel().rows.length} of {data.length}{' '}
                              results
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
                <div
                  className={`${styles.Card} ${styles.FormCard} Card FormCard`}>
                  <div className={`${styles.CardBody} CardBody`}>
                    <div
                      className={`${styles.FormActionContainer} FormActionContainer`}>
                      <button
                        onClick={() => generateArticles()}
                        className={`${styles.PrimaryButton} PrimaryButton`}
                        type="submit">
                        Generate All Articles
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

export default ArticleIdeasListView
