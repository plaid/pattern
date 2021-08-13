import React, { useState } from 'react';

import { NumberInput } from 'plaid-threads/NumberInput';
import { Button } from 'plaid-threads/Button';

import { currencyFilter } from '../util';

// Component rendered when user is redirected back to site from Oauth institution site.
// It initiates link immediately with the original link token that was set in local storage
// from the initial link initialization.
const TransferFunds = () => {
  const [transferAmount, setTransferAmount] = useState('');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // checkAmount(); logic to check if amount is less than balance/get available balance
    setTransferAmount('');
  };

  const amt =
    parseFloat(transferAmount) > 0
      ? currencyFilter(parseFloat(transferAmount))
      : '';
  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <NumberInput
            id="transferAmount"
            name="transfer amount"
            value={transferAmount}
            required
            placeholder="0.00"
            label="transfer_amount"
            onChange={e => setTransferAmount(e.currentTarget.value)}
          />
          <Button type="submit">Transfer {amt}</Button>
        </form>
      </div>
    </>
  );
};

export default TransferFunds;
