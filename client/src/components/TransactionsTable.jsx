import React from 'react';
import PropTypes from 'prop-types';

import { currencyFilter } from '../util';

TransactionsTable.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default function TransactionsTable({ transactions }) {
  return (
    <div className="transactions">
      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th className="table-name">Name</th>
              <th className="table-category">Category</th>
              <th className="table-amount">Amount</th>
              <th className="table-date">Date</th>
            </tr>
          </thead>
        </table>
        <div className="transactions-body">
          <table>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td className="table-name">{tx.name}</td>
                  <td className="table-category">{tx.category}</td>
                  <td className="table-amount">{currencyFilter(tx.amount)}</td>
                  <td className="table-date">{tx.date.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
