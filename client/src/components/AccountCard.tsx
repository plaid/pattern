import React, { useEffect, useCallback } from 'react';

import { AccountType } from './types';
import { currencyFilter } from '../util';
import { getBalanceByItem } from '../services/api';

interface Props {
  account: AccountType;
}

export default function AccountCard(props: Props) {
  const getBalance = useCallback(() => {
    return getBalanceByItem(
      props.account.item_id,
      props.account.plaid_account_id
    );
  }, [props.account.item_id, props.account.plaid_account_id]);

  useEffect(() => {
    const account = getBalance();
    console.log(account);
  }, [getBalance]);
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
      </div>
    </div>
  );
}
