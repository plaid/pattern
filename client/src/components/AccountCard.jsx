import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import Button from 'plaid-threads/Button';

import { useTransactions } from '../services';
import { currencyFilter } from '../util';
import { TransactionsTable } from '.';

AccountCard.propTypes = {
  account: PropTypes.object.isRequired,
};

export default function AccountCard({ account }) {
  const [transactions, setTransactions] = useState([]);
  const [transactionsShown, setTransactionsShown] = useState(false);

  const { transactionsByAccount, getTransactionsByAccount } = useTransactions();

  const { id } = account;

  const toggleShowTransactions = () => {
    setTransactionsShown(shown => !shown);
  };

  useEffect(() => {
    getTransactionsByAccount(id);
  }, [getTransactionsByAccount, id]);

  useEffect(() => {
    setTransactions(transactionsByAccount[id] || []);
  }, [transactionsByAccount, id]);

  return (
    <div>
      <div className="account-data-row">
        <div className="account-data-row__left">
          <div className="account-data-row__name">{account.name}</div>
          <div className="account-data-row__balance">{`${startCase(
            toLower(account.subtype)
          )} • Balance ${currencyFilter(account.current_balance)}`}</div>
        </div>
        <div className="account-data-row__right">
          {!!transactions.length && (
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
