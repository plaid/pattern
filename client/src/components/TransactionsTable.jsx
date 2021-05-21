import React from 'react';
import PropTypes from 'prop-types';

import { currencyFilter } from '../util';

TransactionsTable.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default function TransactionsTable({ transactions }) {
  const categories = {};

  transactions.forEach(tx => {
    if (categories[tx.category] != null) {
      categories[tx.category] += tx.amount;
    } else {
      categories[tx.category] = tx.amount;
    }
  });
  console.log(categories);

  const names = {};

  transactions.forEach(tx => {
    if (names[tx.name] != null) {
      names[tx.name] += tx.amount;
    } else {
      names[tx.name] = tx.amount;
    }
  });
  console.log(names);

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
          {transactions.map(tx => (
            <tr key={tx.id} className="transactions-data-rows">
              <td className="table-name">{tx.name}</td>
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
