import React, { useState, useEffect } from 'react';
import { Callout } from 'plaid-threads/Callout';

import useErrors from '../services/errors';

//  Allows user to input their personal assets such as a house or car.

export default function ErrorMessage() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const { error } = useErrors();

  useEffect(() => {
    const institution = error.institution;
    switch (error.code) {
      case 'INSTITUTION_NOT_RESPONDING':
        setShow(true);
        setMessage(
          `${institution} is having technical problems.  Please try again in a couple hours.`
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
    <div className="errorMessage" onClick={() => setShow(false)}>
      {show && (
        <Callout>
          Error: {error.code} - {message}
        </Callout>
      )}
    </div>
  );
}
