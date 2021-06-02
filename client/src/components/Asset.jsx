import React, { useState } from 'react';
import Modal from 'plaid-threads/Modal';
import ModalBody from 'plaid-threads/ModalBody';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';
import NumberInput from 'plaid-threads/NumberInput';
import PropTypes from 'prop-types';

import { useAssets } from '../services';

Asset.propTypes = {
  userId: PropTypes.number,
};

export default function Asset({ userId }) {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const { addAsset } = useAssets();

  const handleSubmit = () => {
    setShow(false);
    addAsset(userId, description, parseInt(value));
  };

  return (
    <div className="assetBtnContainer">
      <Button centered inline small secondary onClick={() => setShow(!show)}>
        Add An Asset
      </Button>
      <Modal isOpen={show} onRequestClose={() => setShow(false)}>
        <>
          <ModalBody
            onClickCancel={() => setShow(false)}
            header="Enter Your Asset"
            isLoading={false}
            onClickConfirm={handleSubmit}
            confirmText="Submit"
            body={
              <>
                <TextInput
                  id="id-6"
                  placeholder="Enter Asset Description (e.g. house or car)"
                  value={description}
                  onChange={e => setDescription(e.currentTarget.value)}
                />
                <NumberInput
                  id="id-6"
                  placeholder="Enter Asset Value (in dollars $)"
                  value={value}
                  onChange={e => setValue(e.currentTarget.value)}
                />
              </>
            }
          />
        </>
      </Modal>
    </div>
  );
}
