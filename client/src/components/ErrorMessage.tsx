import React, { useState, useEffect } from 'react';
import { Callout } from 'plaid-threads/Callout';
import { IconButton } from 'plaid-threads/IconButton';
import { CloseS2 } from 'plaid-threads/Icons/CloseS2';

import useErrors from '../services/errors';

// link errors that require a prompt for the enduser

export default function ErrorMessage() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const { error, resetError } = useErrors();

  useEffect(() => {
    const errors = [
      'INSTITUTION_NOT_RESPONDING',
      'INSTITUTION_DOWN',
      'INSTITUTION_NOT_AVAILABLE',
      'INTERNAL_SERVER_ERROR',
      'USER_SETUP_REQUIRED',
      'ITEM_LOCKED',
      'INVALID_CREDENTIALS',
      'INVALID_UPDATED_USERNAME',
      'INSUFFICIENT_CREDENTIALS',
      'MFA_NOT_SUPPORTED',
      'NO_ACCOUNTS',
    ];

    if (error.code != null && errors.includes(error.code)) {
      setShow(true);
      setMessage(error.message);
    } else {
      setShow(false);
    }
  }, [error.code, error.message]);

  return (
    <>
      {show && (
        <Callout className="error-msg__callout">
          <IconButton
            className="close-error__button"
            accessibilityLabel="close"
            onClick={() => {
              setShow(false);
              resetError();
            }}
            icon={<CloseS2 />}
          />
          Error: {error.code} <br />
          {message}
        </Callout>
      )}
    </>
  );
}
