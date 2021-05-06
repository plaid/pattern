import React from 'react';
import propTypes from 'prop-types';
import Button from 'plaid-threads/Button';
import { usePlaidLink } from 'react-plaid-link';

LinkButton.propTypes = {
  linkToken: propTypes.string,
  callbacks: propTypes.object,
  update: propTypes.bool,
};

LinkButton.defaultProps = {
  linkToken: null,
  callbacks: null,
  update: false,
};

export default function LinkButton({ children, linkToken, callbacks, update }) {
  const linkConfig = {
    ...callbacks,
    token: linkToken,
  };

  const { open, ready } = usePlaidLink(linkConfig);

  return (
    <>
      {!update && (
        <Button
          centered
          inline
          disabled={!ready}
          onClick={() => {
            open();
          }}
        >
          {children}
        </Button>
      )}
      {update && ( // case where link is launched in update mode from dropdown menu in the
        // item card after item is set to "bad state"
        <div
          disabled={!ready}
          onClick={() => {
            open();
          }}
        >
          {children}
        </div>
      )}
    </>
  );
}
