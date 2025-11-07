import React, { useState } from 'react';
import Modal from 'plaid-threads/Modal';
import ModalBody from 'plaid-threads/ModalBody';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';

import { useCurrentUser } from '../services';

const Login = () => {
  const { login } = useCurrentUser();
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    setShow(false);
    login(value);
  };

  return (
    <>
      <Button centered inline onClick={() => setShow(!show)}>
        Login
      </Button>
      {show && (
        <Modal isOpen={show} onRequestClose={() => setShow(false)}>
          <ModalBody
            onClickCancel={() => setShow(false)}
            header="User Login"
            isLoading={false}
            onClickConfirm={handleSubmit}
            confirmText="Submit"
          >
            <TextInput
              label="Username"
              id="username-input"
              placeholder="Enter User Name"
              value={value}
              onChange={e => setValue(e.currentTarget.value)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  );
};

export default Login;
