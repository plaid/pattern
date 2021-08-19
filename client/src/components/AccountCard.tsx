import React, { useState, useEffect } from 'react';

import { AccountType, UserType } from './types';
import { currencyFilter } from '../util';
import { TransferFunds } from '.';
import { updateAppFundsBalance } from '../services/api';

const IS_PROCESSOR = process.env.REACT_APP_IS_PROCESSOR;
interface Props {
  account: AccountType;
  userId: number;
  updateUser: (user: UserType) => void;
  closeView: () => void;
}

export default function AccountCard(props: Props) {
  const sendRequestToProcessor = (amount: number, processorToken: string) => {
    // api route to send processor_token and amount to transfer to
    // Dwolla or other processor initiate transfer endpoint
    console.log('sending' + amount + 'and' + processorToken + 'to processor');
    // return some sort of confirmation from Dwolla???
    return amount;
  };

  const completeTransfer = (amount: number, accountId: string) => {
    // api route to complete ach bank transfer
    console.log(
      'completing transfer of' + amount + ' from account # ' + accountId
    );
    return amount;
  };
  const account = props.account;
  const balance =
    account.available_balance != null
      ? account.available_balance
      : account.current_balance;
  const [isAmountOkay, setIsAmountOkay] = useState(true);

  const checkAmount = async (amount: number) => {
    const amountIsLessThanBalance = amount <= balance ? true : false;
    setIsAmountOkay(amountIsLessThanBalance);
    let confirmedAmount = 0;
    if (amountIsLessThanBalance) {
      confirmedAmount =
        IS_PROCESSOR === 'true'
          ? sendRequestToProcessor(amount, account.processor_token)
          : completeTransfer(amount, account.plaid_account_id);
    }
    if (confirmedAmount > 0) {
      const { data: users } = await updateAppFundsBalance(
        props.userId,
        confirmedAmount
      );
      props.updateUser(users[0]);
      props.closeView();
    }
  };
  return (
    <div className="accountContainer">
      <div className="account-data-row">
        <div className="account-data-row__left">
          <div className="account-data-row__name">{account.name}</div>
          <div className="account-data-row__balance">{`Balance:  ${currencyFilter(
            balance
          )}`}</div>
        </div>
        <div>
          {!isAmountOkay && <div>Too much!</div>}
          <TransferFunds checkAmount={checkAmount} />
        </div>
      </div>
    </div>
  );
}
