import React, { useEffect, useRef } from 'react';

import { currencyFilter } from '../util/index.tsx';
import { TransactionType } from './types';

interface Props {
  transactions: TransactionType[];
}

export default function TransactionsTable(props: Props) {
  // Track the timestamp when we last rendered to identify new transactions
  const lastViewedTime = useRef<number>(Date.now());
  const previousTransactionIds = useRef<Set<number>>(new Set());
  const isInitialLoad = useRef<boolean>(true);

  // Sort transactions by date, most recent first
  // Within the same date, sort by created_at (newest first)
  const sortedTransactions = [...props.transactions].sort((a, b) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    // Same date: sort by created_at (most recently created first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Identify which transactions are new (not in previous render)
  // But don't mark anything as new on the initial load
  const currentTransactionIds = new Set(props.transactions.map(tx => tx.id));
  const newTransactionIds = isInitialLoad.current
    ? new Set()
    : new Set([...currentTransactionIds].filter(id => !previousTransactionIds.current.has(id)));

  // Update the refs after render
  useEffect(() => {
    previousTransactionIds.current = currentTransactionIds;
    if (isInitialLoad.current && props.transactions.length > 0) {
      isInitialLoad.current = false;
    }
  });

  return (
    <div className="transactions">
      <table className="transactions-table">
        <thead className="transactions-header">
          <tr>
            <th className="table-name">Name</th>
            <th className="table-category">Category</th>
            <th className="table-amount">Amount</th>
            <th className="table-date">Date</th>
          </tr>
        </thead>
        <tbody className="transactions-body">
          {sortedTransactions.map(tx => (
            <tr key={tx.id} className="transactions-data-rows">
              <td className="table-name">
                {tx.name}
                {newTransactionIds.has(tx.id) && (
                  <span
                    style={{
                      marginLeft: '8px',
                      padding: '2px 6px',
                      fontSize: '0.75em',
                      fontWeight: 'bold',
                      borderRadius: '3px',
                      backgroundColor: '#4CAF50',
                      color: '#fff',
                    }}
                  >
                    NEW
                  </span>
                )}
                {tx.pending && (
                  <span
                    style={{
                      marginLeft: '8px',
                      padding: '2px 6px',
                      fontSize: '0.75em',
                      fontWeight: 'bold',
                      borderRadius: '3px',
                      backgroundColor: '#FFA500',
                      color: '#fff',
                    }}
                  >
                    PENDING
                  </span>
                )}
              </td>
              <td className="table-category">{tx.category}</td>
              <td className="table-amount">{currencyFilter(tx.amount)}</td>
              <td className="table-date">{tx.date.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
