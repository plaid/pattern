import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { IconDots, Button, LinkButton } from '.';
import { useOnClickOutside } from '../hooks';
import { useLink } from '../services';
import Menu from 'plaid-threads/Icons/MenuS1';
import IconButton from 'plaid-threads/IconButton';
import Dropdown from 'plaid-threads/Dropdown';

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

  const [isOpen, setIsOpen] = useState(false);

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
      {setBadStateShown && (
        <Dropdown
          isOpen={isOpen}
          target={
            <IconButton
              ref={refToButton}
              accessibilityLabel="Navigation"
              icon={<Menu />}
              onClick={() => setIsOpen(!isOpen)}
            />
          }
        >
          {/* {setBadStateShown && ( */}
          <div>
            <Button
              altClasses="more-details_button"
              action={handleSetBadState}
              text="Reset Login"
              moreDetails={true}
            />
          </div>
          <div>
            <Button
              altClasses="more-details_button"
              text="Remove"
              action={handleDelete}
            />
          </div>
        </Dropdown>
      )}
      {updateShown && linkToken != null && callbacks != null && (
        <Dropdown
          isOpen={isOpen}
          target={
            <IconButton
              ref={refToButton}
              accessibilityLabel="Navigation"
              icon={<Menu />}
              onClick={() => setIsOpen(!isOpen)}
            />
          }
        >
          {/* {setBadStateShown && ( */}
          <div>
            <LinkButton
              userId={userId}
              itemId={itemId}
              linkToken={linkToken}
              callbacks={callbacks}
              altClasses="more-details_button"
            >
              Update Login
            </LinkButton>
          </div>
          <div>
            <Button
              altClasses="more-details_button"
              text="Remove"
              action={handleDelete}
            />
          </div>
        </Dropdown>
      )}
    </div>
  );
}

MoreDetails.propTypes = propTypes;
MoreDetails.defaultProps = defaultProps;

export default MoreDetails;
