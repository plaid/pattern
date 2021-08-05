import React, { useEffect, useState } from 'react';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import Button from 'plaid-threads/Button';

import { AccountType } from './types';
import { currencyFilter } from '../util';

interface Props {
  account: AccountType;
}

// TODO: update all components to look like this:
// const ClientMetrics: React.FC<Props> = (props: Props) => ()

// ClientMetrics.displayName = 'ClientMetrics';
// export default ClientMetrics;
export default function AccountCard(props: Props) {
  return (
    <div className="accountContainer">
      <div className="account-data-row">
        <div className="account-data-row__left">
          <div className="account-data-row__name">{props.account.name}</div>
          <div className="account-data-row__balance">{`${startCase(
            toLower(props.account.subtype)
          )} • Balance ${currencyFilter(props.account.current_balance)}`}</div>
        </div>
      </div>
    </div>
  );
}
