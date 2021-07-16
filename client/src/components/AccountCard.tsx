import React, { useEffect, useState } from 'react';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import Button from 'plaid-threads/Button';

import { AccountType } from './types';
import { useTransactions } from '../services';
import { currencyFilter } from '../util';
import { TransactionsTable } from '.';

interface Props {
  account: AccountType;
}

// TODO: update all components to look like this:
// const ClientMetrics: React.FC<Props> = (props: Props) => ()

// ClientMetrics.displayName = 'ClientMetrics';
// export default ClientMetrics;
export default function AccountCard(props: Props) {
  const [transactions, setTransactions] = useState([]);
  const [transactionsShown, setTransactionsShown] = useState(false);

  const { transactionsByAccount, getTransactionsByAccount } = useTransactions();

  const { id } = props.account;

  const toggleShowTransactions = () => {
    setTransactionsShown(shown => !shown);
  };

  useEffect(() => {
    getTransactionsByAccount(id);
  }, [getTransactionsByAccount, transactionsByAccount, id]);

  useEffect(() => {
    setTransactions(transactionsByAccount[id] || []);
  }, [transactionsByAccount, id]);

  return (
    <div>
      <div className="account-data-row">
        <div className="account-data-row__left">
          <div className="account-data-row__name">{props.account.name}</div>
          <div className="account-data-row__balance">{`${startCase(
            toLower(props.account.subtype)
          )} • Balance ${currencyFilter(props.account.current_balance)}`}</div>
        </div>
        <div className="account-data-row__right">
          {transactions.length !== 0 && (
            <Button onClick={toggleShowTransactions} centered small inline>
              {transactionsShown ? 'Hide Transactions' : 'View Transactions'}
            </Button>
          )}
        </div>
      </div>
      {transactionsShown && <TransactionsTable transactions={transactions} />}
    </div>
  );
}
