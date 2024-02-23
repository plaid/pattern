import React from 'react';

import { currencyFilter } from '../util';
import { TransactionType } from './types';

interface Props {
  transactions: TransactionType[];
}

export default function TransactionsTable(props: Props) {
  // Sort transactions by date
  const sortedTransactions = props.transactions.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // For ascending order; use `dateB - dateA` for descending order
  });
  return (
    <div className="transactions">
      <table className="transactions-table">
        <thead className="transactions-header">
          <tr>
            <th className="table-name">Name</th>
            <th className="table-category">Category</th>
            <th className="table-label">Label</th>
            <th className="table-amount">Amount</th>
            <th className="table-date">Date</th>
          </tr>
        </thead>
        <tbody className="transactions-body">
          {sortedTransactions.map(tx => (
            <tr key={tx.id} className="transactions-data-rows">
              <td className="table-name">{tx.name}</td>
              <td className="table-category">{tx.category}</td>
              <td className="table-label">{tx.label}</td>
              <td className="table-amount">{currencyFilter(tx.amount)}</td>
              <td className="table-date">{tx.date.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
