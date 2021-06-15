import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Menu from 'plaid-threads/Icons/MenuS1';
import Dropdown from 'plaid-threads/Dropdown';
import IconButton from 'plaid-threads/IconButton';
import Touchable from 'plaid-threads/Touchable';

import { LinkButton } from '.';
import { useOnClickOutside } from '../hooks';
import { useLink } from '../services';

const propTypes = {
  handleDelete: PropTypes.func.isRequired,
};

const defaultProps = {
  handleUpdate: () => {},
  setBadStateShown: false,
  handleSetBadState: () => {},
};

// Provides for testing of the ITEM_LOGIN_REQUIRED webhook and Link update mode
export function MoreDetails({
  handleDelete,
  setBadStateShown,
  handleSetBadState,
  userId,
  itemId,
}) {
  const [menuShown, setmenuShown] = useState(false);
  const [token, setToken] = useState(null);
  const refToButton = useRef();
  const refToMenu = useOnClickOutside({
    callback: () => {
      setmenuShown(false);
    },
    ignoreRef: refToButton,
  });

  const { generateLinkToken, linkTokens } = useLink();
  // creates new link token for each item in bad state
  useEffect(() => {
    generateLinkToken(userId, itemId); // itemId is set because link is in update mode
  }, [userId, itemId, generateLinkToken]);

  useEffect(() => {
    setToken(linkTokens.byItem[itemId]);
  }, [linkTokens, userId, itemId]);

  // display choice, depending on whether item is in "good" or "bad" state
  const linkChoice = setBadStateShown ? (
    // handleSetBadState uses sandbox/item/reset_login to send the ITEM_LOGIN_REQUIRED webhook;
    // app responds to this webhook by setting item to "bad" state (server/webhookHandlers/handleItemWebhook.js)
    <Touchable className="menuOption" onClick={handleSetBadState}>
      Reset Login
    </Touchable>
  ) : token != null ? (
    // item is in "bad" state;  launch link to login and return to "good" state
    <div>
      <LinkButton userId={userId} itemId={itemId} token={token}>
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

        <Touchable className="menuOption" onClick={handleDelete}>
          Remove
        </Touchable>
      </Dropdown>
    </div>
  );
}

MoreDetails.propTypes = propTypes;
MoreDetails.defaultProps = defaultProps;

export default MoreDetails;
