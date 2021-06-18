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
    <div>
      <Button centered inline onClick={() => setShow(!show)}>
        Login
      </Button>
      <Modal isOpen={show} onRequestClose={() => setShow(false)}>
        <>
          <ModalBody
            onClickCancel={() => setShow(false)}
            header="User Login"
            isLoading={false}
            onClickConfirm={handleSubmit}
            confirmText="Submit"
            // TODO: file ticket in threads to fix body type
            // @ts-ignore
            body={
              <>
                <TextInput
                  label=""
                  id="id-6"
                  placeholder="Enter User Name"
                  value={value}
                  onChange={e => setValue(e.currentTarget.value)}
                />
              </>
            }
          >
            <TextInput
              label=""
              id="id-6"
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

export default Login;
