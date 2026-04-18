import React, { useState, useEffect } from 'react';
import { Callout } from './ui/Callout.tsx';
import { IconButton } from './ui/IconButton.tsx';
import { CloseIcon } from './ui/icons.tsx';

import useErrors from '../services/errors.tsx';

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
    }
  }, [error.code, error.message]);

  return (
    <>
      {show && (
        <Callout className="errMsgCallout" warning>
          <IconButton
            className="closeBtn"
            accessibilityLabel="close"
            onClick={() => {
              setShow(false);
              resetError();
            }}
            icon={<CloseIcon />}
          />
          <div>
            <strong>Connection Error:</strong> {error.code}
          </div>
          <div style={{ marginTop: '8px' }}>
            {message}
          </div>
        </Callout>
      )}
    </>
  );
}
