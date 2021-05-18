import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import Button from 'plaid-threads/Button';
import Touchable from 'plaid-threads/Touchable';
import { usePlaidLink } from 'react-plaid-link';

LinkButton.propTypes = {
  config: propTypes.object,
  isUpdate: propTypes.bool,
  isOauth: propTypes.bool,
  userId: propTypes.string,
  itemId: propTypes.string,
};

LinkButton.defaultProps = {
  config: null,
  isUpdate: false,
  isOauth: false,
  userId: null,
  itemId: null,
};

export default function LinkButton({
  isOauth,
  children,
  config,
  isUpdate,
  userId,
  itemId,
}) {
  if (isOauth) {
    config.receivedRedirectUri = window.location.href;
  }
  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    // initiallizes link automatically if it is OAuth
    if (isOauth && ready) {
      open();
    }
  }, [ready, open]);

  const handleClick = () => {
    // set link token, userId and itemId in local storage for use by Oauth
    localStorage.setItem(
      'oauthConfig',
      JSON.stringify({ userId: userId, itemId: itemId, token: config.token })
    );
    open();
  };

  return (
    <>
      {isOauth ? (
        <></>
      ) : isUpdate ? (
        // case where link is launched in update mode from dropdown menu in the
        // item card after item is set to "bad state"
        <Touchable
          className="menuOption"
          disabled={!ready}
          onClick={() => {
            handleClick();
          }}
        >
          {children}
        </Touchable>
      ) : (
        <Button
          centered
          inline
          small
          disabled={!ready}
          onClick={() => {
            handleClick();
          }}
        >
          {children}
        </Button>
      )}
    </>
  );
}
