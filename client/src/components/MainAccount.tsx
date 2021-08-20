import React, { useEffect, useState, useCallback } from 'react';
import Note from 'plaid-threads/Note';
import Touchable from 'plaid-threads/Touchable';
import Button from 'plaid-threads/Button';
import { Institution } from 'plaid/dist/api';

import { ItemType, AccountType, UserType, AppFundType } from './types';
import { AccountCard, MoreDetails } from '.';
import { useAccounts, useInstitutions, useItems } from '../services';
import { setItemToBadState, getBalanceByItem } from '../services/api';
import { currencyFilter } from '../util';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';

interface Props {
  initiateTransfer: () => void;
  updateUser: (user: UserType) => void;
  user: UserType;
  appFund: AppFundType;
  numOfItems: number;
}

const MainAccount = (props: Props) => {
  const handleClick = () => {
    props.initiateTransfer();
  };
  return (
    <div className="mainAccountContainer">
      <div className="mainAccountHeader">
        <h3 className="accountBalance">Plaid Pattern Funds Balance</h3>{' '}
        {props.numOfItems > 0 && (
          <Button onClick={handleClick} inline small>
            Transfer funds
          </Button>
        )}
      </div>
      <div>
        <h3 className="accountDollars">
          {currencyFilter(props.appFund.balance)}
        </h3>
      </div>
    </div>
  );
};

export default MainAccount;
