import React from 'react';
import PropTypes from 'prop-types';

import { currencyFilter, pluralize } from '../util';
import { Asset } from '.';
import { AccountType, AssetType } from './types';

interface Props {
  numOfItems: number;
  accounts: AccountType[];
  personalAssets: AssetType[];
  userId: number;
}

export default function NetWorth(props: Props) {
  // sums of account types
  const addAllAccounts = (
    accountSubtypes: Array<AccountType['subtype']>
  ): number =>
    props.accounts
      .filter(a => accountSubtypes.includes(a.subtype))
      .reduce((acc: number, val: AccountType) => acc + val.current_balance, 0);

  const depository: number = addAllAccounts([
    'checking',
    'savings',
    'cd',
    'money market',
  ]);
  const investment: number = addAllAccounts(['ira', '401k']);
  const loan: number = addAllAccounts(['student', 'mortgage']);
  const credit: number = addAllAccounts(['credit card']);

  const personalAssetValue = props.personalAssets.reduce((a, b) => {
    return a + b.value;
  }, 0);

  const assets = depository + investment + personalAssetValue;
  const liabilities = loan + credit;

  return (
    <div className="netWorthContainer">
      <h2 className="netWorthHeading">Net Worth</h2>
      <h4 className="tableSubHeading">
        A summary of your assets and liabilities
      </h4>
      <div className="netWorthText">{`Your total Across ${
        props.numOfItems
      } ${pluralize('Account', props.numOfItems)}`}</div>
      <h2 className="netWorthDollars">
        {currencyFilter(assets - liabilities)}
      </h2>
      <div className="holdingsContainer">
        <div className="userDataBox">
          <div className="holdingsList">
            <div className="assetsHeaderContainer">
              <h4 className="dollarsHeading">{currencyFilter(assets)}</h4>
              <Asset userId={props.userId} />
            </div>

            <div className="data">
              <p className="title">Assets</p>
              <p>{''}</p>
              <p className="dataItem">Cash</p>{' '}
              <p className="dataItem">{currencyFilter(depository)}</p>
              <p className="dataItem">Investment</p>
              <p className="dataItem">{currencyFilter(investment)}</p>
              {props.personalAssets.map(asset => (
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
