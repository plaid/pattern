import React, { useState, useRef, useEffect } from 'react';
import Menu from 'plaid-threads/Icons/MenuS1';
import Dropdown from 'plaid-threads/Dropdown';
import IconButton from 'plaid-threads/IconButton';
import Touchable from 'plaid-threads/Touchable';

import { LinkButton } from '.';
import { useOnClickOutside } from '../hooks';
import { useLink } from '../services';

interface Props {
  setBadStateShown: boolean;
  handleSetBadState: () => void;
  userId: number;
  itemId: number;
  handleDelete: () => void;
}

//TODO: rename this component to LinkUpdateBtn
export function MoreDetails(props: Props) {
  const [token, setToken] = useState('');

  const { generateLinkToken, linkTokens } = useLink();
  // creates new link token for each item in bad state
  useEffect(() => {
    generateLinkToken(props.userId, props.itemId); // itemId is set because link is in update mode
  }, [props.userId, props.itemId, generateLinkToken]);

  useEffect(() => {
    setToken(linkTokens.byItem[props.itemId]);
  }, [linkTokens, props.itemId]);

  return (
    <div className="more-details">
      {token != null && token.length > 0 && (
        <LinkButton userId={props.userId} itemId={props.itemId} token={token}>
          Update Login
        </LinkButton>
      )}
    </div>
  );
}

export default MoreDetails;
