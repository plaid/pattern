import React, { useEffect, useState, useCallback } from 'react';
import propTypes from 'prop-types';
import Button from 'plaid-threads/Button';
import { usePlaidLink } from 'react-plaid-link';

import { useLink } from '../services';

import {
  exchangeToken,
  getLinkToken,
  postLinkEvent,
  setItemState,
} from '../services/api';
import { useItems } from '../services';

LinkButton.propTypes = {
  userId: propTypes.number,
  itemId: propTypes.number,
  altClasses: propTypes.string,
  primary: propTypes.bool,
  linkToken: propTypes.string,
};

LinkButton.defaultProps = {
  userId: null,
  itemId: null,
  altClasses: null,
  primary: false,
  linkToken: null,
  callbacks: null,
};

export default function LinkButton({
  children,
  userId,
  itemId,
  altClasses,
  primary,
  linkToken,
  callbacks,
}) {
  const { getItemsByUser, getItemById } = useItems();

  const isPrimary = primary ? 'button--is-primary' : '';
  const classlist = altClasses !== null ? altClasses : '';
  function logEvent(eventName, extra) {
    console.log(`Link Event: ${eventName}`, extra);
  }

  const linkConfig = {
    ...callbacks,
    token: linkToken,
  };

  const { open, ready } = usePlaidLink(linkConfig);

  return (
    <Button
      centered
      className={`button ${isPrimary} ${classlist}`}
      disabled={!ready}
      onClick={() => {
        open();
      }}
    >
      {children}
    </Button>
  );
}
