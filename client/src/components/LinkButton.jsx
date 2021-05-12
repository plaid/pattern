import React from 'react';
import propTypes from 'prop-types';
import Button from 'plaid-threads/Button';
import Touchable from 'plaid-threads/Touchable';
import { usePlaidLink } from 'react-plaid-link';

LinkButton.propTypes = {
  config: propTypes.object,
  update: propTypes.bool,
};

LinkButton.defaultProps = {
  config: null,
  update: false,
};

export default function LinkButton({ children, config, update }) {
  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {!update ? (
        <Button
          centered
          inline
          small
          disabled={!ready}
          onClick={() => {
            open();
          }}
        >
          {children}
        </Button>
      ) : (
        // case where link is launched in update mode from dropdown menu in the
        // item card after item is set to "bad state"
        <Touchable
          className="menuOption"
          disabled={!ready}
          onClick={() => {
            open();
          }}
        >
          {children}
        </Touchable>
      )}
    </>
  );
}
