import React, { useState } from 'react';
import Modal from 'plaid-threads/Modal';
import ModalBody from 'plaid-threads/ModalBody';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';

import { useCurrentUser } from '../services';

const Login: React.FC = () => {
  const { login } = useCurrentUser();
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    setShow(false);
    login(value);
    setValue('');
  };

  return (
    <div>
      <Button centered inline onClick={() => setShow(!show)}>
        Login
      </Button>
      <Modal
        isOpen={show}
        onRequestClose={() => {
          setShow(false);
          setValue('');
        }}
      >
        <>
          <ModalBody
            onClickCancel={() => {
              setShow(false);
              setValue('');
            }}
            header="User Login"
            isLoading={false}
            onClickConfirm={handleSubmit}
            confirmText="Submit"
          >
            <TextInput
              label=""
              id="username"
              placeholder="Enter User Name"
              value={value}
              onChange={e => setValue(e.currentTarget.value)}
            />
          </ModalBody>
        </>
      </Modal>
    </div>
  );
};

Login.displayName = 'Login';
export default Login;
