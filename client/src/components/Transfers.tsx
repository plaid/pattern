import React, { useState } from 'react';
import Callout from 'plaid-threads/Callout';
import { Button } from 'plaid-threads/Button';

import { AccountType, AppFundType } from './types';
import { currencyFilter } from '../util';
import { TransferForm } from '.';
import { updateAppFundsBalance } from '../services/api';

const IS_PROCESSOR = process.env.REACT_APP_IS_PROCESSOR;

interface TransferResponse {
  newAccount: AccountType;
  newAppFunds: AppFundType;
}
interface Props {
  account: AccountType;
  userId: number;
  setAppFund: (appFund: AppFundType) => void;
  setShowTransfer: (arg: boolean) => void;
  institutionName: string | null;
  setAccount: (arg: AccountType) => void;
}

// This component checks to make sure the amount of transfer does not
// exceed the balance in the account and then initiates the ach transfer or processor request.
// Note that no transfers are actually made in this sample app; therefore balances in
// linked accounts (either in sandbox or development) will not actually be decremented when
// a transfer is made in this app.

const Transfers: React.FC<Props> = (props: Props) => {
  const [isAmountOkay, setIsAmountOkay] = useState(true);
  const [transferAmount, setTransferAmount] = useState(0);
  const [isTransferConfirmed, setIsTransferconfirmed] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const account = props.account;
  const [
    showTransferConfirmationError,
    setShowTransferConfirmationError,
  ] = useState(false);

  // use available_balance only; leave it up to developer to decide
  // the risk of using current_balance:
  const balance = account.available_balance;

  const errorMessage = !isAmountOkay
    ? transferAmount <= 0
      ? `You must enter an amount greater than $0.00`
      : `We are unable to verify ${currencyFilter(
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
    setIsAmountOkay(balance != null && amount <= balance && amount > 0);
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
        const response: TransferResponse | any = await updateAppFundsBalance(
          // this route updates the appFunds with the new balance and also
          // increments the number of transfers for this account by 1
          props.userId,
          confirmedAmount,
          account.plaid_account_id
        );
        props.setAppFund(response.data.newAppFunds);
        props.setAccount(response.data.newAccount);
        setIsTransferconfirmed(true);
      }
    }
  };

  return (
    <div className="transfers">
      {showInput && (
        <TransferForm
          setShowTransfer={props.setShowTransfer}
          checkAmountAndInitiate={checkAmountAndInitiate}
          setShowInput={setShowInput}
        />
      )}
      {isTransferConfirmed && (
        <>
          <div>
            <h3 className="subheading">Transfer Confirmed</h3>{' '}
          </div>
          <p>{`You have successfully transferred ${currencyFilter(
            transferAmount
          )} from ${props.institutionName} to your Plaid Pattern Account.`}</p>
          <Button
            small
            centered
            inline
            onClick={() => props.setShowTransfer(false)}
          >
            Done
          </Button>
        </>
      )}
      {(!isAmountOkay || showTransferConfirmationError) && (
        <>
          <div>
            <h3 className="subheading">Transfer Error</h3>{' '}
          </div>
          <Callout className="callout" warning>
            {' '}
            {errorMessage}
          </Callout>
          <Button
            small
            centered
            inline
            onClick={() => props.setShowTransfer(false)}
          >
            Back
          </Button>
        </>
      )}
    </div>
  );
};

Transfers.displayName = 'Transfers';
export default Transfers;
