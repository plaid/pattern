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

// Provides for testing of the ITEM_LOGIN_REQUIRED webhook and Link update mode
export function MoreDetails(props: Props) {
  const [menuShown, setmenuShown] = useState(false);
  const [token, setToken] = useState('');
  const refToButton = useRef<HTMLDivElement>(null);
  const refToMenu: React.RefObject<HTMLDivElement> = useOnClickOutside({
    callback: () => {
      setmenuShown(false);
    },
    ignoreRef: refToButton,
  });

  const { generateLinkToken, linkTokens } = useLink();
  // creates new link token for each item in bad state
  useEffect(() => {
    generateLinkToken(props.userId, props.itemId); // itemId is set because link is in update mode
  }, [props.userId, props.itemId, generateLinkToken]);

  useEffect(() => {
    setToken(linkTokens.byItem[props.itemId]);
  }, [linkTokens, props.itemId]);

  // display choice, depending on whether item is in "good" or "bad" state
  const linkChoice = props.setBadStateShown ? (
    // handleSetBadState uses sandbox/item/reset_login to send the ITEM_LOGIN_REQUIRED webhook;
    // app responds to this webhook by setting item to "bad" state (server/webhookHandlers/handleItemWebhook.js)
    <Touchable className="menuOption" onClick={props.handleSetBadState}>
      Test Item Login Required Webhook
    </Touchable>
  ) : token != null && token.length > 0 ? (
    // item is in "bad" state;  launch link to login and return to "good" state
    <div>
      <LinkButton userId={props.userId} itemId={props.itemId} token={token}>
        Update Login
      </LinkButton>
    </div>
  ) : (
    <></>
  );

  const icon = (
    <div className="icon-button-container" ref={refToButton}>
      <IconButton
        accessibilityLabel="Navigation"
        icon={<Menu />}
        onClick={() => setmenuShown(!menuShown)}
      />
    </div>
  );

  return (
    <div className="more-details" ref={refToMenu}>
      <Dropdown isOpen={menuShown} target={icon}>
        {linkChoice}

        <Touchable className="menuOption2" onClick={props.handleDelete}>
          Remove
        </Touchable>
      </Dropdown>
    </div>
  );
}

export default MoreDetails;
