import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, LinkButton } from '.';
import { useOnClickOutside } from '../hooks';
import { useLink } from '../services';
import Menu from 'plaid-threads/Icons/MenuS1';
import IconButton from 'plaid-threads/IconButton';
import Dropdown from 'plaid-threads/Dropdown';

const propTypes = {
  handleDelete: PropTypes.func.isRequired,
};

const defaultProps = {
  handleUpdate: () => {},
  setBadStateShown: false,
  handleSetBadState: () => {},
};

export function MoreDetails({
  handleDelete,
  setBadStateShown,
  handleSetBadState,
  userId,
  itemId,
}) {
  const [menuShown, setmenuShown] = useState(false);
  const refToButton = useRef();
  const { generateLinkConfigs, linkConfigs } = useLink();
  const [linkToken, setLinkToken] = useState(null);
  const [callbacks, setCallbacks] = useState(null);
  const refToMenu = useOnClickOutside({
    callback: () => {
      setmenuShown(false);
    },
    ignoreRef: refToButton,
  });

  // get link configs from link context
  useEffect(() => {
    generateLinkConfigs(userId, itemId);
  }, [generateLinkConfigs, itemId]);

  // set linkToken and callbacks from configs from link context
  useEffect(() => {
    if (linkConfigs.byItem[itemId]) {
      setLinkToken(linkConfigs.byItem[itemId].linkToken);
      setCallbacks(linkConfigs.byItem[itemId].callbacks);
    }
  }, [linkConfigs]);

  const linkChoice = setBadStateShown ? (
    <Button
      altClasses="more-details_button"
      action={handleSetBadState}
      text="Reset Login"
      moreDetails={true}
    />
  ) : linkToken != null && callbacks != null ? (
    <LinkButton
      userId={userId}
      itemId={itemId}
      linkToken={linkToken}
      callbacks={callbacks}
      altClasses="more-details_button"
      update={true}
    >
      Update Login
    </LinkButton>
  ) : (
    <></>
  );

  return (
    <div className="more-details" ref={refToMenu}>
      <div ref={refToButton}> </div>
      <Dropdown
        isOpen={menuShown}
        target={
          <IconButton
            accessibilityLabel="Navigation"
            icon={<Menu />}
            onClick={() => setmenuShown(!menuShown)}
          />
        }
      >
        <div>{linkChoice}</div>
        <div>
          <Button
            altClasses="more-details_button"
            text="Remove"
            action={handleDelete}
          />
        </div>
      </Dropdown>
    </div>
  );
}

MoreDetails.propTypes = propTypes;
MoreDetails.defaultProps = defaultProps;

export default MoreDetails;
