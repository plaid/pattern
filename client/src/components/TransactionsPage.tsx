import React, { useEffect, useMemo, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import NavigationLink from 'plaid-threads/NavigationLink';
import LoadingSpinner from 'plaid-threads/LoadingSpinner';
import {
  useTable,
  usePagination,
  Column,
  CellProps,
  useFilters,
  FilterType,
} from 'react-table';

import { TransactionType } from './types';
import { currencyFilter } from '../util';
import { useTransactions } from '../services';
import { setLabel } from '../services/api';

import { LoadingCallout, ErrorMessage } from '.';

interface TransactionsPageProps
  extends RouteComponentProps<{ userId: string }> {}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ match }) => {
  const [userTransactions, setUserTransactions] = useState<TransactionType[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
  const transactionsPerPage = 50;

  const { getTransactionsByUser, transactionsByUser } = useTransactions();
  const userId = Number(match.params.userId);

  useEffect(() => {
    getTransactionsByUser(userId);
  }, [getTransactionsByUser, userId]);

  useEffect(() => {
    const fetchedTransactions = transactionsByUser[userId];
    if (fetchedTransactions) {
      if (fetchedTransactions.length > 0) {
        const sortedTransactions = [...fetchedTransactions].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        setUserTransactions(sortedTransactions);
      } else {
        setError('No transactions found.');
      }
    }
    setIsLoading(false);
  }, [transactionsByUser, userId]);

  // Label Change Handler
  const handleLabelChange = async (id: number, newLabel: string | null) => {
    try {
      const labelToUpdate = newLabel === '' ? null : newLabel;
      await setLabel(id, labelToUpdate); // Assuming this is your API call
      setUserTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction.id === id
            ? { ...transaction, label: labelToUpdate }
            : transaction
        )
      );
    } catch (error) {
      console.error('Error updating label:', error);
    }
  };

  // Filters
  const DefaultColumnFilter = ({
    column: { filterValue, setFilter },
  }: {
    column: { filterValue: any; setFilter: any };
  }) => {
    return (
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter
        }}
        placeholder={`Search...`}
      />
    );
  };

  type ListFilterProps = {
    column: {
      filterValue: string;
      setFilter: (value: string | undefined) => void;
      preFilteredRows: Array<{ values: Record<string, string> }>;
      id: string;
    };
  };
  const ListFilter: React.FC<ListFilterProps> = ({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) => {
    const options = React.useMemo(() => {
      const optionsSet = new Set<string>();
      preFilteredRows.forEach(row => {
        optionsSet.add(row.values[id]);
      });
      return Array.from(optionsSet);
    }, [id, preFilteredRows]);

    return (
      <select
        value={filterValue}
        onChange={e => {
          setFilter(e.target.value !== 'All' ? e.target.value : undefined);
        }}
      >
        <option value="All">All</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };

  const filterForBlanks: FilterType<TransactionType> = (
    rows,
    columnIds,
    filterValue
  ) => {
    const id = columnIds[0];

    if (filterValue === '') {
      return rows.filter(row => {
        const rowValue = row.values[id];
        return rowValue === null || rowValue === '';
      });
    }
    return rows.filter(row => {
      const rowValue = row.values[id];
      return rowValue === filterValue;
    });
  };

  const fuzzyTextFilterFn: FilterType<TransactionType> = (
    rows,
    columnIds,
    filterValue
  ) => {
    // Assuming you're filtering based on the first column ID
    const id = columnIds[0];

    const lowerFilterValue = String(filterValue).toLowerCase();

    return rows.filter(row => {
      const rowValue = row.values[id];
      return rowValue !== undefined
        ? String(rowValue).toLowerCase().includes(lowerFilterValue)
        : true;
    });
  };

  // fuzzyTextFilterFn.autoRemove = (val: any) => !val;

  const data = useMemo(() => userTransactions, [userTransactions]);

  const columns: Column<TransactionType>[] = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }: CellProps<TransactionType>) => value.slice(0, 10),
      },
      {
        Header: 'Description',
        accessor: 'name',
        filter: 'fuzzyText',
      },
      {
        Header: 'Account',
        accessor: 'account_id',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ value }: CellProps<TransactionType>) => currencyFilter(value),
      },
      {
        Header: 'Label',
        accessor: 'label',
        Filter: ListFilter,
        filter: 'filterForBlanks',
        Cell: ({ row }: CellProps<TransactionType, TransactionType['id']>) => (
          <input
            type="text"
            defaultValue={row.original.label || ''}
            onBlur={e => {
              if (e.target.value !== row.original.label) {
                handleLabelChange(row.original.id, e.target.value);
              }
            }}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputValues]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: { pageIndex: 0, pageSize: transactionsPerPage },
      manualPagination: false,
      pageCount: Math.ceil(userTransactions.length / transactionsPerPage),
      filterTypes: {
        filterForBlanks,
        fuzzyText: fuzzyTextFilterFn,
      },
      autoResetFilters: false,
    },
    useFilters,
    usePagination
  );

  return (
    <div>
      <NavigationLink component={Link} to="/">
        BACK TO LOGIN
      </NavigationLink>
      <p />
      <NavigationLink component={Link} to={`/user/${userId}`}>
        USER SUMMARY
      </NavigationLink>

      <h1>User Transactions for ID: {userId}</h1>
      {isLoading ? (
        <div className="loading">
          <LoadingSpinner />
          <LoadingCallout />
        </div>
      ) : error ? (
        <ErrorMessage />
      ) : (
        <>
          <table {...getTableProps()} className="transactions-page">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                      <div>
                        {column.canFilter ? column.render('Filter') : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </button>{' '}
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {'>>'}
            </button>{' '}
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <span>
              | Go to page:{' '}
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: '100px' }}
              />
            </span>{' '}
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsPage;
