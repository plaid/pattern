import React, { useState, useRef, useEffect } from 'react';
import { MenuIcon } from './ui/icons.tsx';
import { IconButton } from './ui/IconButton.tsx';

import LaunchLink from './LaunchLink.tsx';
import useOnClickOutside from '../hooks/useOnClickOutside.ts';
import useLink from '../services/link.tsx';

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

  const initiateLink = async () => {
    // creates new link token for each item in bad state
    // only generate a link token upon a click from enduser to update login;
    // if done earlier, it may expire before enduser actually activates link.
    await generateLinkToken(props.userId, props.itemId); // itemId is set because link is in update mode
  };

  useEffect(() => {
    setToken(linkTokens.byItem[props.itemId]);
  }, [linkTokens, props.itemId]);

  // display choice, depending on whether item is in "good" or "bad" state
  const linkChoice = props.setBadStateShown ? (
    // handleSetBadState uses sandbox/item/reset_login to send the ITEM_LOGIN_REQUIRED webhook;
    // app responds to this webhook by setting item to "bad" state (server/webhookHandlers/handleItemWebhook.js)
    <button className="menuOption block w-full text-left px-4 py-2 hover:bg-black-200 cursor-pointer" onClick={props.handleSetBadState}>
      Test Item Login Required Webhook
    </button>
  ) : (
    // item is in "bad" state;  launch link to login and return to "good" state
    <div>
      <button className="menuOption block w-full text-left px-4 py-2 hover:bg-black-200 cursor-pointer" onClick={initiateLink}>
        Update Login
      </button>
      {token != null && token.length > 0 && (
        <LaunchLink userId={props.userId} itemId={props.itemId} token={token} />
      )}
    </div>
  );

  const icon = (
    <div className="icon-button-container" ref={refToButton}>
      <IconButton
        accessibilityLabel="Navigation"
        icon={<MenuIcon />}
        onClick={() => setmenuShown(!menuShown)}
      />
    </div>
  );

  return (
    <div className="more-details" ref={refToMenu}>
      {icon}
      {menuShown && (
        <div className="absolute right-0 top-full z-10 bg-white border border-black-300 rounded shadow-md min-w-[200px]">
          {linkChoice}
          <button className="menuOption2 block w-full text-left px-4 py-2 hover:bg-black-200 cursor-pointer" onClick={props.handleDelete}>
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default MoreDetails;
