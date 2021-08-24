import React, { useState, useEffect } from 'react';
import Callout from 'plaid-threads/Callout';
import Button from 'plaid-threads/Button';
import ChevronS1Left from 'plaid-threads/Icons/ChevronS1Left';

import { AccountType, AppFundType } from './types';
import { currencyFilter } from '../util';
import { TransferFunds } from '.';
import { updateAppFundsBalance } from '../services/api';

const IS_PROCESSOR = process.env.REACT_APP_IS_PROCESSOR;
interface Props {
  account: AccountType;
  userId: number;
  updateAppFund: (appFund: AppFundType) => void;
  closeView: () => void;
}

export default function AccountCard(props: Props) {
  const account = props.account;
  const balance =
    account.available_balance != null
      ? account.available_balance
      : account.current_balance;
  const [isAmountOkay, setIsAmountOkay] = useState(true);
  const [transferAmount, setTransferAmount] = useState(0);
  const [
    showTransferConfirmationError,
    setShowTransferConfirmationError,
  ] = useState(false);

  const sendRequestToProcessor = (amount: number, processorToken: string) => {
    // placeholder code to simulate request to Dwolla/Processor:
    // api route to send processor_token and amount to transfer to
    // Dwolla or other processor initiate transfer endpoint
    console.log('sending' + amount + 'and' + processorToken + 'to processor');
    // return confirmation from Dwolla/Processor
    return amount;
  };

  const completeAchTransfer = (amount: number, accountId: string) => {
    // placeholder code to simulate ach bank transfer:
    // api route to complete ach bank transfer
    console.log(
      'completing transfer of' + amount + ' from account # ' + accountId
    );
    // return confirmation of ach transfer
    return amount;
  };

  const checkAmountAndInitiate = async (amount: number) => {
    setIsAmountOkay(amount <= balance);
    setTransferAmount(amount);
    setShowTransferConfirmationError(false);

    if (amount <= balance && amount > 0) {
      const confirmedAmount =
        IS_PROCESSOR === 'true'
          ? sendRequestToProcessor(amount, account.processor_token)
          : completeAchTransfer(amount, account.plaid_account_id);
      if (confirmedAmount == null) {
        setShowTransferConfirmationError(true);
      } else {
        const { data: appFunds } = await updateAppFundsBalance(
          props.userId,
          confirmedAmount
        );
        props.updateAppFund(appFunds[0]);
        props.closeView();
      }
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
          <TransferFunds checkAmountAndInitiate={checkAmountAndInitiate} />
        </div>
      </div>
      {!isAmountOkay && (
        <Callout warning>
          {' '}
          We are unable to verify {transferAmount} in your bank account.
        </Callout>
      )}
      {showTransferConfirmationError && (
        <Callout warning>
          {' '}
          Oops! Something went wrong with the transfer. Try again later.
        </Callout>
      )}
      <div className="backBtnHolder">
        <Button
          small
          centered
          secondary
          inline
          onClick={() => props.closeView()}
        >
          <ChevronS1Left /> Back
        </Button>
      </div>
    </div>
  );
}
