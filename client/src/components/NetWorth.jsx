import React from 'react';
import PropTypes from 'prop-types';

import { currencyFilter, pluralize } from '../util';

NetWorth.propTypes = {
  accounts: PropTypes.array,
  numOfItems: PropTypes.number,
  properties: PropTypes.array,
};

export default function NetWorth({ numOfItems, accounts, properties }) {
  const propertyValue = properties.reduce((a, b) => {
    return a + b.value;
  }, 0);

  const accountTypes = {
    depository: {
      checking: 0,
      savings: 0,
      cd: 0,
      'money market': 0,
    },
    investment: {
      ira: 0,
      '401k': 0,
    },
    loan: {
      student: 0,
      mortgage: 0,
    },
    credit: {
      'credit card': 0,
    },
  };

  //create accountTypes object balances in accounts
  accounts.forEach(account => {
    accountTypes[account.type][account.subtype] += account.current_balance;
  });

  const addAll = accountType =>
    Object.values(accountType).reduce((a, b) => a + b);
  // sums of account types
  const depository = addAll(accountTypes.depository);
  const investment = addAll(accountTypes.investment);
  const loan = addAll(accountTypes.loan);
  const credit = addAll(accountTypes.credit);

  const assets = depository + investment + propertyValue;
  const liabilities = loan + credit;

  return (
    <div className="newWorthContainer">
      <h2 className="tableHeading">Net Worth</h2>
      <h4 className="tablesubHeading">
        A summary of your assets and liabilities
      </h4>
      <div className="netWorthText">{`Your total Across ${numOfItems} ${pluralize(
        'Account',
        numOfItems
      )}`}</div>
      <h2>{currencyFilter(assets - liabilities)}</h2>
      <div className="netWorthContainer">
        <div className="userDataBox">
          <div className="data">
            <h4 className="dollarsHeader">{currencyFilter(assets)}</h4>

            <div className="holdingsList">
              <p className="title">Assets</p>
              <p>{''}</p>
              <p>Cash</p> <p>{currencyFilter(depository)}</p>
              <p>Investment</p>
              <p>{currencyFilter(investment)}</p>
              {properties.map(property => (
                <>
                  <p>{property.description}</p>
                  <p>{currencyFilter(property.value)}</p>
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="userDataBox">
          <div className="data">
            <h4 className="dollarsHeader">{currencyFilter(liabilities)}</h4>

            <div className="holdingsList">
              <p className="title">Liabilities</p>
              <p>{''}</p>
              <p>Credit Cards</p> <p>{currencyFilter(credit)}</p>
              <p>Loans</p>
              <p>{currencyFilter(loan)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
