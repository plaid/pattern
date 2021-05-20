import React, { useEffect, useState } from 'react';

import Modal from 'plaid-threads/Modal';
import ModalBody from 'plaid-threads/ModalBody';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';
import { useCurrentUser } from '../services';

// Component rendered when user is redirected back to site from Oauth institution site.  It initiates link immediately with
// configs that are generated with the link token, userId and itemId from local storage.
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
          <div className="loginHeader">User Login</div>
          <div className="loginInput">
            {' '}
            <TextInput
              id="id-6"
              placeholder="Enter User Name"
              value={value}
              onChange={e => setValue(e.currentTarget.value)}
            />
          </div>
          <Button
            className="loginSubmitBtn"
            centered
            inline
            small
            onClick={handleSubmit}
          >
            Submit
          </Button>

          <ModalBody onClickCancel={() => setShow(false)} isLoading={false} />
        </>
      </Modal>
    </div>
  );
};

export default Login;
