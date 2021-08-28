import React, { useState } from 'react';
import Callout from 'plaid-threads/Callout';
import { Button } from 'plaid-threads/Button';

import { AccountType, AppFundType } from './types';
import { currencyFilter } from '../util';
import { TransferFunds } from '.';
import { updateAppFundsBalance } from '../services/api';

const IS_PROCESSOR = process.env.REACT_APP_IS_PROCESSOR;
interface Props {
  account: AccountType;
  userId: number;
  updateAppFund: (appFund: AppFundType) => void;
  closeTransferView: () => void;
  institutionName: string;
}

export default function AccountCard(props: Props) {
  const account = props.account;
  const balance =
    account.available_balance != null
      ? account.available_balance
      : account.current_balance;
  const [isAmountOkay, setIsAmountOkay] = useState(true);
  const [transferAmount, setTransferAmount] = useState(0);
  const [isTransferConfirmed, setIsTransferconfirmed] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const [
    showTransferConfirmationError,
    setShowTransferConfirmationError,
  ] = useState(false);

  const errorMessage = !isAmountOkay
    ? `We are unable to verify ${currencyFilter(
        transferAmount
      )} in your bank account.`
    : `Oops! Something went wrong with the transfer. Try again later.`;

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
        setIsTransferconfirmed(true);
      }
    }
  };
  return (
    <>
      <div>
        {showInput && (
          <TransferFunds
            closeTransferView={props.closeTransferView}
            checkAmountAndInitiate={checkAmountAndInitiate}
            setShowInput={setShowInput}
          />
        )}
        {isTransferConfirmed && (
          <>
            <div className="transferFundsHeader">
              <h3 className="transferFundsTitle">Transfer Confirmed</h3>{' '}
            </div>
            <p>{`You have successfully transferred ${currencyFilter(
              transferAmount
            )} from ${
              props.institutionName
            } to your Plaid Pattern Account.`}</p>
            <Button
              small
              centered
              inline
              onClick={() => props.closeTransferView()}
            >
              Done
            </Button>
          </>
        )}
        {(!isAmountOkay || showTransferConfirmationError) && (
          <>
            <div className="transferFundsHeader">
              <h3 className="transferFundsTitle">Transfer Error</h3>{' '}
            </div>
            <Callout className="callout" warning>
              {' '}
              {errorMessage}
            </Callout>
            <Button
              small
              centered
              inline
              onClick={() => props.closeTransferView()}
            >
              Back
            </Button>
          </>
        )}
      </div>
    </>
  );
}
