import React, { useState, useRef, useEffect } from 'react';
import Button from 'plaid-threads/Button';

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
export function UpdateLink(props: Props) {
  const [token, setToken] = useState('');

  const { generateLinkToken, linkTokens } = useLink();

  const initiateLinkUpdate = async () => {
    generateLinkToken(props.userId, props.itemId, false); // itemId is set because link is in update mode; isAuth and isIdentity are false in update mode;
  };

  useEffect(() => {
    setToken(linkTokens.byItem[props.itemId]);
  }, [linkTokens, props.itemId]);

  return (
    <div className="more-details">
      {
        <Button small centered inline onClick={initiateLinkUpdate}>
          Update Login
        </Button>
      }
      {token != null && token.length > 0 && (
        <LinkButton
          userId={props.userId}
          itemId={props.itemId}
          token={token}
          isAuth={false}
          isIdentity={false}
        />
      )}
    </div>
  );
}

export default UpdateLink;
