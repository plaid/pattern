import React from 'react';

import { currencyFilter, pluralize } from '../util';
import { Asset } from '.';
import { AccountType, AssetType } from './types';
interface Props {
  numOfItems: number;
  accounts: AccountType[];
  personalAssets: AssetType[];
  userId: number;
}

interface Depository {
  checking: number;
  savings: number;
  cd: number;
  'money market': number;
}

interface Investment {
  ira: number;
  '401k': number;
}

interface Loan {
  student: number;
  mortgage: number;
}

interface Credit {
  'credit card': number;
}

type AccountTypes = Depository | Investment | Loan | Credit;
interface BankAccountTypes {
  [propName: string]: AccountTypes;
}

export default function NetWorth(props: Props) {
  const accountTypes: BankAccountTypes = {
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
      student: 52,
      mortgage: 0,
    },
    credit: {
      'credit card': 98,
    },
  };

  //create accountTypes balances object

  props.accounts.forEach(account => {
    //@ts-ignore
    accountTypes[account.type][account.subtype as keyof AccountTypes] +=
      account.current_balance;
  });

  // sums of account types
  const addAllAccounts = (accountType: AccountTypes): number =>
    Object.values(accountType).reduce((a: number, b: number) => a + b);

  const depository: number = addAllAccounts(accountTypes.depository);
  const investment: number = addAllAccounts(accountTypes.investment);
  const loan: number = addAllAccounts(accountTypes.loan);
  const credit: number = addAllAccounts(accountTypes.credit);

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
      <div className="netWorthText">{`Your total across ${
        props.numOfItems
      } bank ${pluralize('account', props.numOfItems)}`}</div>
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
