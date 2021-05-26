import React from 'react';
import PropTypes from 'prop-types';

import { currencyFilter } from '../util';
import { CategoriesChart } from '.';

SpendingInsights.propTypes = {
  transactions: PropTypes.array,
};

export default function SpendingInsights({ transactions }) {
  // grab transactions from most recent month and filter out transfers and payments
  const today = new Date();
  const oneMonthAgo = new Date().setDate(today.getDate() - 30);
  const monthlyTransactions = transactions.filter(tx => {
    const date = new Date(tx.date);
    return (
      date > oneMonthAgo &&
      tx.category !== 'Payment' &&
      tx.category !== 'Transfer'
    );
  });

  // create category and name objects from transactions
  const categories = {};
  monthlyTransactions.forEach(tx => {
    categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
  });

  const names = {};
  monthlyTransactions.forEach(tx => {
    names[tx.name] = (names[tx.name] || 0) + tx.amount;
  });

  // sort names by spending totals
  var sortableNames = [];
  for (const name in names) {
    sortableNames.push([name, names[name]]);
  }
  sortableNames.sort((a, b) => b[1] - a[1]);
  sortableNames.splice(5); // top 5

  return (
    <div>
      <h2>Monthly Spending</h2>
      <div className="monthlySpendingContainer">
        <div className="userDataBox">
          <CategoriesChart categories={categories} />
        </div>
        <div className="userDataBox">
          <div className="holdingsList">
            <h4 className="tableHeading">Top 5 Vendors</h4>
            <div className="data">
              <p className="title">Vendor</p> <p className="title">Amount</p>
              {sortableNames.map(vendor => (
                <>
                  <p>{vendor[0]}</p>
                  <p>{currencyFilter(vendor[1])}</p>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
