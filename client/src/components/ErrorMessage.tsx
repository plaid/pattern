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
      case 'INTERNAL_SERVER_ERROR':
        setShow(true);
        setMessage(
          `We are having technical difficulties.  Please try again in a couple hours.`
        );
        break;

      case 'USER_SETUP_REQUIRED':
        setShow(true);
        setMessage(
          `Please login directly with ${institution} to complete your account setup.  Then return here to re-authenticate. `
        );
        break;
      case 'ITEM_LOCKED':
        setShow(true);
        setMessage(
          `Your account is locked.  Please work directly with ${institution} to unlock your account.`
        );
        break;
      case 'INVALID_CREDENTIALS':
        setShow(true);
        setMessage(`Please check your credentials and retry logging in.`);
        break;
      case 'INVALID_UPDATED_USERNAME':
        setShow(true);
        setMessage(
          `Please check your username and retry logging in.  Remember to use the same capitalization you used in your original username.`
        );
        break;
      case 'INSUFFICIENT_CREDENTIALS':
        setShow(true);
        setMessage(`Please check your credentials and retry logging in.`);
        break;
      case 'MFA_NOT_SUPPORTED':
        setShow(true);
        setMessage(
          `The multi-factor authentication used by ${institution} is not supported.  Please try another institution.`
        );
        break;

      case 'NO_ACCOUNTS':
        setShow(true);
        setMessage(
          `Although your credentials are correct, there are no associated accounts with ${institution}.  Please try another institution.`
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
          Error: {error.code} <br />
          {message}
        </Callout>
      )}
    </>
  );
}
