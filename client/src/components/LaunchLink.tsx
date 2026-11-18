import React, { useEffect } from 'react';
import {
  usePlaidLink,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkError,
  PlaidLinkOptionsWithLinkToken,
  PlaidLinkOnEventMetadata,
  PlaidLinkStableEvent,
} from 'react-plaid-link';
import { useNavigate } from 'react-router-dom';

import { logEvent, logSuccess, logExit } from '../util/index.tsx'; // functions to log and save errors and metadata from Link events

import useItems from '../services/items.tsx';
import useLink from '../services/link.tsx';
import useErrors from '../services/errors.tsx';

import {
  addLinkSessionItems,
  exchangeToken,
  setItemState,
} from '../services/api.tsx';

interface Props {
  isOauth?: boolean;
  token: string;
  userId: number;
  itemId?: number | null;
  isMultiItem?: boolean;
  children?: React.ReactNode;
}

// Uses the usePlaidLink hook to manage the Plaid Link creation.  See https://github.com/plaid/react-plaid-link for full usage instructions.
// The link token passed to usePlaidLink cannot be null.  It must be generated outside of this component.  In this sample app, the link token
// is generated in the link context in client/src/services/link.js.

export default function LaunchLink(props: Props) {
  const navigate = useNavigate();
  const { getItemsByUser, getItemById } = useItems();
  const { generateLinkToken, deleteLinkToken } = useLink();
  const { setError, resetError } = useErrors();

  // define onSuccess, onExit and onEvent functions as configs for Plaid Link creation
  const onSuccess = async (
    publicToken: string | null,
    metadata: PlaidLinkOnSuccessMetadata
  ) => {
    // log and save metadata
    logSuccess(metadata, props.userId);
    if (props.itemId != null) {
      // update mode: no need to exchange public token
      await setItemState(props.itemId, 'good');
      deleteLinkToken(null, props.itemId);
      getItemById(props.itemId, true);
    } else if (props.isMultiItem) {
      // Multi-Item Link: publicToken is empty. The server receives a public token for
      // each linked Item in the SESSION_FINISHED webhook and exchanges them there
      // (onEvent below adds a fallback in case the webhook is missed).
    } else {
      // regular link mode: exchange public token for access token
      // call to Plaid api endpoint: /item/public_token/exchange in order to obtain access_token which is then stored with the created item
      await exchangeToken(
        publicToken!,
        metadata.institution,
        metadata.accounts,
        props.userId
      );
      getItemsByUser(props.userId, true);
    }
    resetError();
    deleteLinkToken(props.userId, null);
    navigate(`/user/${props.userId}`);
  };

  const onExit = async (
    error: PlaidLinkError | null,
    metadata: PlaidLinkOnExitMetadata
  ) => {
    // log and save error and metadata
    logExit(error, metadata, props.userId);
    if (error != null && error.error_code === 'INVALID_LINK_TOKEN') {
      await generateLinkToken(props.userId, props.itemId, props.isMultiItem);
    }
    if (error != null) {
      setError(error.error_code, error.display_message || error.error_message);
    }
    // to handle other error codes, see https://plaid.com/docs/errors/
  };

  const onEvent = async (
    eventName: PlaidLinkStableEvent | string,
    metadata: PlaidLinkOnEventMetadata
  ) => {
    // handle errors in the event end-user does not exit with onExit function error enabled.
    if (eventName === 'ERROR' && metadata.error_code != null) {
      setError(metadata.error_code, ' ');
    }
    logEvent(eventName, metadata);
    if (eventName === 'HANDOFF' && props.isMultiItem) {
      // Multi-Item Link: the server normally stores the Items when it receives the
      // SESSION_FINISHED webhook. In case that webhook is missed, also ask the server
      // to get the session's results from /link/token/get. Items already stored are skipped.
      try {
        await addLinkSessionItems(props.token);
        getItemsByUser(props.userId, true);
      } catch (err) {
        console.error('Error adding Multi-Item Link session Items:', err);
      }
    }
  };

  const config: PlaidLinkOptionsWithLinkToken = {
    onSuccess,
    onExit,
    onEvent,
    token: props.token,
  };

  if (props.isOauth) {
    config.receivedRedirectUri = window.location.href; // add additional receivedRedirectUri config when handling an OAuth redirect
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    // initializes Link automatically
    if (props.isOauth && ready) {
      open();
    } else if (ready) {
      // regular, non-OAuth case:
      // set link token, userId and itemId in local storage for use if needed later by OAuth

      localStorage.setItem(
        'oauthConfig',
        JSON.stringify({
          userId: props.userId,
          itemId: props.itemId,
          isMultiItem: props.isMultiItem,
          token: props.token,
        })
      );
      open();
    }
  }, [
    ready,
    open,
    props.isOauth,
    props.userId,
    props.itemId,
    props.isMultiItem,
    props.token,
  ]);

  return <></>;
}
