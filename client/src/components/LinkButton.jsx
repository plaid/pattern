import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import Button from 'plaid-threads/Button';
import Touchable from 'plaid-threads/Touchable';
import { usePlaidLink } from 'react-plaid-link';

LinkButton.propTypes = {
  config: propTypes.object,
  isUpdate: propTypes.bool,
  isOauth: propTypes.bool,
  userId: propTypes.number,
  itemId: propTypes.number || null,
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
  // add additional receivedRedirectUri config when re-launching Link in Oauth.
  if (isOauth) {
    config.receivedRedirectUri = window.location.href;
  }
  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    // initiallizes Link automatically if it is handling an OAuth reidrect
    if (isOauth && ready) {
      open();
    }
  }, [ready, open]);

  const handleClick = () => {
    // set link token, userId and itemId in local storage for use if necessary by Oauth
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
        // case where Link is launched in update mode from dropdown menu in the
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
        // regular case for initializing Link from user card or from user item list
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
