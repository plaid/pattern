import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import Button from 'plaid-threads/Button';
import Touchable from 'plaid-threads/Touchable';
import { usePlaidLink } from 'react-plaid-link';
import { useHistory } from 'react-router-dom';

import { logSuccess, logExit } from '../util';
import { exchangeToken, postLinkEvent, setItemState } from '../services/api';
import { useItems, useLink } from '../services';

LinkButton.propTypes = {
  isOauth: propTypes.bool,
  userId: propTypes.number,
  itemId: propTypes.number || null,
  token: propTypes.string,
};

LinkButton.defaultProps = {
  isOauth: false,
  userId: null,
  itemId: null,
  token: null,
};

// TODO move to utils
// TODO do onSuccess and onEvent logging
const logEvent = (eventName, extra) => {
  console.log(`Link Event: ${eventName}`, extra);
};

// const logExit = async (
//   error,
//   { institution, link_session_id, request_id },
//   userId
// ) => {
//   logEvent('onExit', {
//     error,
//     institution,
//     link_session_id,
//     request_id,
//   });
//   const eventError = error || {};
//   await postLinkEvent({
//     userId,
//     link_session_id,
//     request_id,
//     type: 'exit',
//     ...eventError,
//   });
// };

export default function LinkButton({
  isOauth,
  children,
  token,
  userId,
  itemId,
}) {
  const history = useHistory();
  const { getItemsByUser, getItemById } = useItems();
  const { generateLinkToken } = useLink();

  const onSuccess = async (
    publicToken,
    { institution, accounts, link_session_id }
  ) => {
    console.log(institution);
    logSuccess(institution, accounts, link_session_id, userId);
    if (itemId != null) {
      // update mode: no need to exchange public token
      await setItemState(itemId, 'good');
      getItemById(itemId, true);
      // regular link mode: exchange public token for access token
    } else {
      await exchangeToken(publicToken, institution, accounts, userId);
      getItemsByUser(userId, true);
    }

    history.push(`/user/${userId}`);
  };

  const onExit = async (error, metadata) => {
    logExit(error, metadata, userId);
    if (error != null && error.error_code === 'INVALID_LINK_TOKEN') {
      await generateLinkToken(userId, itemId);
    }
  };

  const callbacks = {
    onSuccess: onSuccess,
    onExit: onExit,
    onEvent: logEvent,
  };

  const config = {
    ...callbacks,
    token: token,
    receivedRedirectUri: isOauth ? window.location.href : null, // add additional receivedRedirectUri config when handling an OAuth reidrect
  };

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    // initiallizes Link automatically if it is handling an OAuth reidrect
    if (isOauth && ready) {
      open();
    }
  }, [ready, open]);

  const handleClick = () => {
    // regular, non-OAuth case:
    // set link token, userId and itemId in local storage for use if needed later by OAuth
    localStorage.setItem(
      'oauthConfig',
      JSON.stringify({ userId: userId, itemId: itemId, token: token })
    );
    open();
  };

  return (
    <>
      {isOauth ? (
        // no link button rendered: OAuth will open automatically by useEffect on line 103
        <></>
      ) : itemId != null ? (
        // update mode: link is launched from dropdown menu in the
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
        // regular case for initializing Link from user card or from "add another item" button
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
