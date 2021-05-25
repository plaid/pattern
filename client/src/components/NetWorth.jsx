import React from 'react';
import PropTypes from 'prop-types';

import { currencyFilter } from '../util';
import { useProperties } from '../services';
import { pluralize } from '../util';

NetWorth.propTypes = {
  transactions: PropTypes.array,
};

export default function NetWorth({ numOfItems, accounts }) {
  const { propertiesByUser } = useProperties();
  const propertyValue = propertiesByUser.properties.reduce((a, b) => {
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

  accounts.forEach(account => {
    accountTypes[account.type][account.subtype] += account.current_balance;
  });

  // sums of account types
  const depository = Object.values(accountTypes.depository).reduce(
    (a, b) => a + b
  );
  const investment = Object.values(accountTypes.investment).reduce(
    (a, b) => a + b
  );
  const loan = Object.values(accountTypes.loan).reduce((a, b) => a + b);
  const credit = Object.values(accountTypes.credit).reduce((a, b) => a + b);

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
        <div className="holdingsContainer">
          <div className="assets">
            <h4 className="dollars">{currencyFilter(assets)}</h4>
            <p>Assets</p>
          </div>
        </div>
        <div className="holdingsContainer">
          <div className="liabilities">
            <h4 className="dollars">{currencyFilter(liabilities)}</h4>
            <p>Liabilities</p>
          </div>
        </div>
      </div>
    </div>
  );
}
