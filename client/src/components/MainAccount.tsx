import React, { useEffect, useState, useCallback } from 'react';
import Note from 'plaid-threads/Note';
import Touchable from 'plaid-threads/Touchable';
import Button from 'plaid-threads/Button';
import { Institution } from 'plaid/dist/api';

import { ItemType, AccountType, UserType } from './types';
import { AccountCard, MoreDetails } from '.';
import { useAccounts, useInstitutions, useItems } from '../services';
import { setItemToBadState, getBalanceByItem } from '../services/api';
import { currencyFilter } from '../util';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';

interface Props {
  initiateTransfer: () => void;
  updateUser: (user: UserType) => void;
  user: UserType;
}

const MainAccount = (props: Props) => {
  const handleClick = () => {
    props.initiateTransfer();
  };
  return (
    <div className="mainAccountContainer">
      <div>
        <div className="mainAccountHeader">
          <h3 className="accountBalance">Plaid Pattern Funds Balance</h3>{' '}
          <Button onClick={handleClick} inline small>
            Transfer funds
          </Button>
        </div>
        <div>
          <h3 className="accountDollars">
            {currencyFilter(props.user.app_funds_balance)}
          </h3>
        </div>
      </div>
      <div>
        <div className="mainAccountHeader">
          <h3 className="transferHistory">Transfer History</h3>{' '}
        </div>
        <p>
          {' '}
          No history available. Transfer funds from your bank to see data here.
        </p>
      </div>
    </div>
  );
};

export default MainAccount;
