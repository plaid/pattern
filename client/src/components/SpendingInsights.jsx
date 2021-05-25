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

  // create category and name objects from transactions
  const categories = {};
  // final categories object should look like:
  // {
  //    Food and Drink: 365.99,
  //    Travel: 2,444.87,
  //    Shops: 566.43
  //    ...
  //  }
  monthlyTransactions.forEach(tx => {
    if (tx.category !== 'Payment' && tx.category !== 'Transfer')
      if (categories[tx.category] != null) {
        categories[tx.category] += tx.amount;
      } else {
        categories[tx.category] = tx.amount;
      }
  });

  const names = {};
  // final names object should look like:
  // {
  //    McDonalds: 563.23,
  //    Target: 345.23,
  //    Safeway: 897.77
  //    ...
  //  }
  monthlyTransactions.forEach(tx => {
    if (tx.category !== 'Payment' && tx.category !== 'Transfer')
      if (names[tx.name] != null) {
        names[tx.name] += tx.amount;
      } else {
        names[tx.name] = tx.amount;
      }
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
          <div className="data">
            <h4 className="tableHeading">Top 5 Vendors</h4>
            <div className="holdingsList">
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
