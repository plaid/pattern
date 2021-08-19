import React, { useState } from 'react';

import { NumberInput } from 'plaid-threads/NumberInput';
import { Button } from 'plaid-threads/Button';
import { currencyFilter } from '../util';

interface Props {
  checkAmountAndInitiate: (amount: number) => void;
}
const TransferFunds: React.FC<Props> = (props: Props) => {
  const [transferAmount, setTransferAmount] = useState('');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.checkAmountAndInitiate(parseFloat(transferAmount));
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
          <Button small centered type="submit">
            Submit {amt}
          </Button>
        </form>
      </div>
    </>
  );
};
TransferFunds.displayName = 'TransferFunds';
export default TransferFunds;
