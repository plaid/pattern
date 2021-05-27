import React from 'react';
import PropTypes from 'prop-types';

import { currencyFilter, pluralize } from '../util';

NetWorth.propTypes = {
  accounts: PropTypes.array,
  numOfItems: PropTypes.number,
  personalAssets: PropTypes.array,
};

export default function NetWorth({ numOfItems, accounts, personalAssets }) {
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

  //create accountTypes balances object
  accounts.forEach(account => {
    accountTypes[account.type][account.subtype] += account.current_balance;
  });

  // sums of account types
  const addAllAccounts = accountType =>
    Object.values(accountType).reduce((a, b) => a + b);

  const depository = addAllAccounts(accountTypes.depository);
  const investment = addAllAccounts(accountTypes.investment);
  const loan = addAllAccounts(accountTypes.loan);
  const credit = addAllAccounts(accountTypes.credit);

  const personalAssetValue = personalAssets.reduce((a, b) => {
    return a + b.value;
  }, 0);

  const assets = depository + investment + personalAssetValue;
  const liabilities = loan + credit;

  return (
    <div className="netWorthContainer">
      <h2 className="tableHeading">Net Worth</h2>
      <h4 className="tableSubHeading">
        A summary of your assets and liabilities
      </h4>
      <div className="netWorthText">{`Your total Across ${numOfItems} ${pluralize(
        'Account',
        numOfItems
      )}`}</div>
      <h2 className="netWorthDollars">
        {currencyFilter(assets - liabilities)}
      </h2>
      <div className="holdingsContainer">
        <div className="userDataBox">
          <div className="holdingsList">
            <h4 className="dollarsHeading">{currencyFilter(assets)}</h4>

            <div className="data">
              <p className="title">Assets</p>
              <p>{''}</p>
              <p className="dataItem">Cash</p>{' '}
              <p className="dataItem">{currencyFilter(depository)}</p>
              <p className="dataItem">Investment</p>
              <p className="dataItem">{currencyFilter(investment)}</p>
              {personalAssets.map(asset => (
                <>
                  <p className="dataItem">{asset.description}</p>
                  <p className="dataItem">{currencyFilter(asset.value)}</p>
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="userDataBox">
          <div className="holdingsList">
            <h4 className="dollarsHeading">{currencyFilter(liabilities)}</h4>

            <div className="data">
              <p className="title">Liabilities</p>
              <p>{''}</p>
              <p className="dataItem">Credit Cards</p>{' '}
              <p className="dataItem">{currencyFilter(credit)}</p>
              <p className="dataItem">Loans</p>
              <p className="dataItem">{currencyFilter(loan)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
