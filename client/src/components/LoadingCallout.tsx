import React, { useState, useEffect } from 'react';
import { Callout } from 'plaid-threads/Callout';
import InlineLink from 'plaid-threads/InlineLink';

//  Allows user to input their personal assets such as a house or car.

export default function LoadingCallout() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => setShow(true), 8000);
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <>
      {show && (
        <Callout>
          Transactions webhooks not received. See the{' '}
          <InlineLink href="https://github.com/plaid/pattern/blob/master/docs/troubleshooting.md">
            {' '}
            troubleshooting guide{' '}
          </InlineLink>{' '}
          to learn about receiving transactions webhooks with this sample app.
        </Callout>
      )}
    </>
  );
}
