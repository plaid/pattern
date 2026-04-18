import React, { useState } from 'react';
import { Modal } from './ui/Modal.tsx';
import { ModalBody } from './ui/ModalBody.tsx';
import { Button } from './ui/Button.tsx';
import { TextInput } from './ui/TextInput.tsx';

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
      <Button onClick={() => setShow(!show)}>
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
              onKeyDown={e => {
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
