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
  badState: false,
  handleUpdate: () => {},
  setBadStateShown: false,
  handleSetBadState: () => {},
};

export function MoreDetails({
  handleDelete,
  badState,
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

  const { generateLinkToken, linkToken } = useLink();

  useEffect(() => {
    generateLinkToken(false, userId, itemId);
  }, [userId, badState]);

  useEffect(() => {
    setToken(linkToken.byItem[itemId]);
  }, [linkToken, userId, badState]);

  // show choice to set state to "bad" or initiate link in update mode,
  // depending on whether item is in a good state or bad state
  const linkChoice = setBadStateShown ? (
    <Touchable className="menuOption" onClick={handleSetBadState}>
      Reset Login
    </Touchable>
  ) : badState && token != null ? (
    <div>
      <LinkButton
        userId={userId}
        itemId={itemId} // only case where itemId is not null is in link update mode
        token={token}
        isUpdate={true}
      >
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
