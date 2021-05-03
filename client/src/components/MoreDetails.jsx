import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { IconDots, Button, LinkButton } from '.';
import { useOnClickOutside } from '../hooks';
import { useItems, useUsers, useLink } from '../services';

const propTypes = {
  handleDelete: PropTypes.func.isRequired,
};

const defaultProps = {
  updateShown: false,
  handleUpdate: () => {},
  setBadStateShown: false,
  handleSetBadState: () => {},
};

export function MoreDetails({
  handleDelete,
  updateShown,
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
    callback: () => setmenuShown(false),
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

  return (
    <div className="more-details">
      <button
        ref={refToButton}
        className="more-details__icon"
        onClick={() => setmenuShown(current => !current)}
      >
        <IconDots />
      </button>
      {menuShown && (
        <div className="more-details__button-group" ref={refToMenu}>
          {setBadStateShown && (
            <Button
              altClasses="more-details_button"
              action={handleSetBadState}
              text="Reset Login"
            />
          )}
          {updateShown && linkToken != null && callbacks != null && (
            <LinkButton
              userId={userId}
              itemId={itemId}
              linkToken={linkToken}
              callbacks={callbacks}
              altClasses="more-details_button"
            >
              Update Login
            </LinkButton>
          )}
          <Button
            altClasses="more-details_button"
            text="Remove"
            action={handleDelete}
          />
        </div>
      )}
    </div>
  );
}

MoreDetails.propTypes = propTypes;
MoreDetails.defaultProps = defaultProps;

export default MoreDetails;
