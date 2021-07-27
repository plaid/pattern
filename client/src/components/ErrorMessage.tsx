import React, { useState, useEffect } from 'react';
import { Callout } from 'plaid-threads/Callout';
import { IconButton } from 'plaid-threads/IconButton';
import { CloseS2 } from 'plaid-threads/Icons/CloseS2';

import useErrors from '../services/errors';

//  Allows user to input their personal assets such as a house or car.

export default function ErrorMessage() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const { error, resetError } = useErrors();

  useEffect(() => {
    const institution = error.institution;
    switch (error.code) {
      case 'INSTITUTION_NOT_RESPONDING':
        setShow(true);
        setMessage(
          `${institution} is having technical problems.  Please try again in a couple hours.`
        );
        break;
      case 'INSTITUTION_DOWN':
        setShow(true);
        setMessage(
          `${institution} is having technical problems.  Please try again in a couple hours.`
        );
        break;
      case 'INSTITUTION_NOT_AVAILABLE':
        setShow(true);
        setMessage(
          `The connection to ${institution} is currently down.  Please try again in a couple hours.`
        );
        break;
      case 'ITEM_LOCKED':
        setShow(true);
        setMessage(
          `Your account is locked.  Please work directly with ${institution} to unlock your account.`
        );
        break;
      default:
        setShow(false);
        break;
    }
  }, [error.code, error.institution]);

  return (
    <>
      {show && (
        <Callout className="errMsgCallout">
          <IconButton
            className="closeBtn"
            accessibilityLabel="close"
            onClick={() => {
              setShow(false);
              resetError();
            }}
            icon={<CloseS2 />}
          />
          Error: {error.code} - {message}
        </Callout>
      )}
    </>
  );
}
