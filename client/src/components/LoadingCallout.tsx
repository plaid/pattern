import React, { useState, useEffect } from 'react';
import { Callout } from './ui/Callout.tsx';

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
          <a
            className="text-blue-900 underline hover:text-blue-1000"
            href="https://github.com/plaid/pattern/blob/master/docs/troubleshooting.md"
          >
            {' '}
            troubleshooting guide{' '}
          </a>{' '}
          to learn about receiving transactions webhooks with this sample app.
        </Callout>
      )}
    </>
  );
}
