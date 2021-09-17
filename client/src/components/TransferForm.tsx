import React, { useState } from 'react';

import { NumberInput } from 'plaid-threads/NumberInput';
import { Button } from 'plaid-threads/Button';
import { currencyFilter } from '../util';

interface Props {
  checkAmountAndInitiate: (amount: number) => void;
  setShowTransfer: (arg: boolean) => void;
  setShowInput: (arg: boolean) => void;
}
const TransferForm: React.FC<Props> = (props: Props) => {
  const [transferAmount, setTransferAmount] = useState('');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.checkAmountAndInitiate(parseFloat(transferAmount));
    setTransferAmount('');
    props.setShowInput(false);
  };

  const amt =
    parseFloat(transferAmount) > 0
      ? currencyFilter(parseFloat(transferAmount))
      : '';
  return (
    <>
      <div>
        <div>
          <h3 className="subheading">Transfer Funds</h3>{' '}
        </div>
        <h4 className="transfer__title">Enter amount</h4>
        <form onSubmit={handleSubmit}>
          <NumberInput
            id="transferAmount"
            name="transfer amount"
            value={transferAmount}
            required
            placeholder="$0.00"
            label="Transfer amount"
            onChange={e => setTransferAmount(e.currentTarget.value)}
            className="transfer-funds__input"
          />
          <Button
            small
            centered
            secondary
            inline
            onClick={() => props.setShowTransfer(false)}
          >
            Back
          </Button>
          <Button small centered inline type="submit">
            Submit {amt}
          </Button>
        </form>
      </div>
    </>
  );
};
TransferForm.displayName = 'TransferForm';
export default TransferForm;
