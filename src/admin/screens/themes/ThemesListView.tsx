'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table';
import useCurrentUser from '../../../modules/auth/hooks/useCurrentUser';
import { authFetch, authPost } from '../../../modules/auth/utils/authFetch';
import { websiteURL } from '../../../config/config';
import styles from '../../themes/admin.module.css';

const themesColumns = [
  {
    header: 'Identifier',
    accessorKey: 'id',
  },
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Description',
    accessorKey: 'description',
  },
  {
    header: 'Version',
    accessorKey: 'version',
  },
  {
    header: 'Actions',
    accessorKey: 'actions',
    cell: ({ row }) => <ActionsItemView item={row.original} />,
  },
];

function ActionsItemView({ item }) {
  const router = useRouter();

  const handleInstall = async () => {
    if (window.confirm('Are you sure you want to activate this theme? Changes will apply immediately.')) {
      await authPost(`${websiteURL}api/system/themes/use?theme=${item.id}`);
      window.location.reload();
    }
  };

  return (
    <div className={styles.inlineActionsContainer}>
      {!item.selected && (
        <button onClick={handleInstall} type="button" className="btn btn-success btn-sm">
          <i className="fa fa-edit">Activate</i>
        </button>
      )}
    </div>
  );
}

export const ThemesListView = () => {
  const [themes, setThemes] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [user, , loading] = useCurrentUser();

  useEffect(() => {
    if (!user || loading) return;

    const fetchData = async () => {
      const response = await authFetch(`${websiteURL}api/system/themes`);
      if (response?.data?.themes) {
        const selectedTheme = response.data.selectedTheme;
        const richThemes = response.data.themes.map(theme => ({
          ...theme,
          selected: theme.id === selectedTheme?.id,
        }));
        setThemes(richThemes);
      }
    };

    fetchData();
  }, [user, loading]);

  const table = useReactTable({
    data: themes,
    columns: themesColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className={`content ${styles.content}`}>
      <div className="row">
        <div className="col col-md-12">
          <div className="Card">
            <div className="CardHeader">
              <h4>Themes</h4>
            </div>
            <div className={styles.CardBody}>
              <input
                className={`${styles.SearchInput} SearchInput`}
                type="text"
                placeholder="Search..."
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
              />
              <table className={styles.Table}>
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id}>
                          {typeof header.column.columnDef.header === 'function'
                            ? header.column.columnDef.header(header.getContext())
                            : header.column.columnDef.header}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{cell.renderValue() as React.ReactNode}</td>
                      ))}
                    </tr>
                  ))}
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
      </div>
    </div>
  );
};
