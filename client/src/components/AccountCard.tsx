import React from 'react';
import { AccountType } from './types';
import { currencyFilter } from '../util';

import { TransferFunds } from '.';
interface Props {
  account: AccountType;
}

export default function AccountCard(props: Props) {
  return (
    <div className="accountContainer">
      <div className="account-data-row">
        <div className="account-data-row__left">
          <div className="account-data-row__name">{props.account.name}</div>
          <div className="account-data-row__balance">{`Current Balance:  ${currencyFilter(
            props.account.current_balance
          )}`}</div>
          <div className="account-data-row__balance">{`Available Balance:  ${currencyFilter(
            props.account.available_balance
          )}`}</div>
        </div>
        <TransferFunds />
      </div>
    </div>
  );
}
