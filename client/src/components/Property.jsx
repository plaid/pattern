import React, { useState } from 'react';
import Modal from 'plaid-threads/Modal';
import ModalBody from 'plaid-threads/ModalBody';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';
import NumberInput from 'plaid-threads/NumberInput';
import PropTypes from 'prop-types';

import { useProperties } from '../services';

Property.propTypes = {
  userId: PropTypes.number,
};

export default function Property({ userId }) {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const { addProperty } = useProperties();

  const handleSubmit = () => {
    setShow(false);
    addProperty(userId, description, parseInt(value));
  };

  return (
    <div>
      <Button centered inline small secondary onClick={() => setShow(!show)}>
        Add Asset
      </Button>
      <Modal isOpen={show} onRequestClose={() => setShow(false)}>
        <>
          <ModalBody
            onClickCancel={() => setShow(false)}
            header="Enter Your Property"
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
