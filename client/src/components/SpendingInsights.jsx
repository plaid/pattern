import React from 'react';
import PropTypes from 'prop-types';

import { currencyFilter } from '../util';
import { CategoriesChart } from '.';

SpendingInsights.propTypes = {
  transactions: PropTypes.array,
};

export default function SpendingInsights({ transactions }) {
  // grab transactions from most recent month
  const today = new Date();
  const oneMonthAgo = new Date().setDate(today.getDate() - 30);
  const monthlyTransactions = transactions.filter(tx => {
    const date = new Date(tx.date);
    return date > oneMonthAgo;
  });

  const categories = {};

  monthlyTransactions.forEach(tx => {
    if (tx.category !== 'Payment' && tx.category !== 'Transfer')
      if (categories[tx.category] != null) {
        categories[tx.category] += tx.amount;
      } else {
        categories[tx.category] = tx.amount;
      }
  });
  console.log(categories);

  const names = {};

  monthlyTransactions.forEach(tx => {
    if (tx.category !== 'Payment' && tx.category !== 'Transfer')
      if (names[tx.name] != null) {
        names[tx.name] += tx.amount;
      } else {
        names[tx.name] = tx.amount;
      }
  });

  var sortableNames = [];

  for (const name in names) {
    sortableNames.push([name, names[name]]);
  }

  sortableNames.sort((a, b) => b[1] - a[1]);
  sortableNames = [...sortableNames.slice(0, 6)]; // top 6

  console.log(sortableNames);
  const categoryRows = [];
  for (const category in categories) {
    categoryRows.push(
      <tr className="transactions-data-rows">
        <td className="table-category">{category}</td>
        <td className="table-amount">{currencyFilter(categories[category])}</td>
      </tr>
    );
  }

  const vendorRows = sortableNames.map(vendor => {
    if (vendor[1] > 0)
      return (
        <tr className="transactions-data-rows">
          <td className="table-category">{vendor[0]}</td>
          <td className="table-amount">{currencyFilter(vendor[1])}</td>
        </tr>
      );
  });

  return (
    <div className="transactions">
      Monthly spending summary
      <table className="transactions-table">
        <thead className="transactions-header">
          <tr>
            <th className="table-category">Category</th>
            <th className="table-amount">Amount</th>
          </tr>
        </thead>
        <tbody className="transactions-body">{categoryRows}</tbody>
      </table>
      <table className="transactions-table">
        <thead className="transactions-header">
          <tr>
            <th className="table-category">Vendor</th>
            <th className="table-amount">Amount</th>
          </tr>
        </thead>
        <tbody className="transactions-body">{vendorRows}</tbody>
      </table>
      <CategoriesChart categories={categories} />
    </div>
  );
}
