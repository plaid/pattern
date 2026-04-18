import React, { useState } from 'react';
import { Modal } from './ui/Modal.tsx';
import { ModalBody } from './ui/ModalBody.tsx';
import { Button } from './ui/Button.tsx';
import { TextInput } from './ui/TextInput.tsx';

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
      <Button small secondary onClick={() => setShow(!show)}>
        Add An Asset
      </Button>
      <Modal isOpen={show} onRequestClose={() => setShow(false)}>
        <ModalBody
          header="Enter Your Asset"
          isLoading={false}
          onClickCancel={() => setShow(false)}
        >
          <form onSubmit={handleSubmit}>
            <TextInput
              required
              label=""
              id="asset-description"
              placeholder="Enter Asset Description (e.g. house or car)"
              value={description}
              onChange={e => setDescription(e.currentTarget.value)}
            />
            <TextInput
              required
              label=""
              id="asset-value"
              type="number"
              placeholder="Enter Asset Value (in dollars $)"
              value={value}
              onChange={e => setValue(e.currentTarget.value)}
            />
            <Button wide type="submit">
              Submit
            </Button>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
