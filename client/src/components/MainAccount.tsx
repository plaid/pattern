import React from 'react';

import Button from 'plaid-threads/Button';

import { UserType, AppFundType } from './types';

import { currencyFilter } from '../util';

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
