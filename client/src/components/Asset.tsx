import React, { useState } from 'react';
import Modal from 'plaid-threads/Modal';
import ModalBody from 'plaid-threads/ModalBody';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';
import NumberInput from 'plaid-threads/NumberInput';

import { useAssets } from '../services';

interface Props {
  userId: number;
}

//  Allows user to input their personal assets such as a house or car.

export default function Asset(props: Props) {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const { addAsset } = useAssets();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setShow(false);
    addAsset(props.userId, description, parseFloat(value));
    setDescription('');
    setValue('');
  };

  return (
    <div className="assetBtnContainer">
      <Button centered inline small secondary onClick={() => setShow(!show)}>
        Add An Asset
      </Button>
      <Modal isOpen={show} onRequestClose={() => setShow(false)}>
        <>
          <ModalBody
            header="Enter Your Asset"
            isLoading={false}
            onClickCancel={() => setShow(false)}
          >
            <form onSubmit={handleSubmit}>
              <TextInput
                required
                label=""
                id="id-6"
                placeholder="Enter Asset Description (e.g. house or car)"
                value={description}
                onChange={e => setDescription(e.currentTarget.value)}
              />
              <NumberInput
                required
                label=""
                id="id-6"
                placeholder="Enter Asset Value (in dollars $)"
                value={value}
                onChange={e => setValue(e.currentTarget.value)}
              />
              <Button wide type="submit">
                Submit
              </Button>
            </form>
          </ModalBody>
        </>
      </Modal>
    </div>
  );
}
