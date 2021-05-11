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
  const [config, setConfig] = useState({ token: null, onSucces: null });
  const { generateLinkConfigs, linkConfigs } = useLink();
  const refToButton = useRef();
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
      setConfig(linkConfigs.byItem[itemId]);
    }
  }, [linkConfigs.byItem[itemId]]);

  // show choice to set state to "bad" or initiate link in update mode,
  // depending on whether item is in a good state or bad state
  const linkChoice = setBadStateShown ? (
    <Touchable className="menuOption" onClick={handleSetBadState}>
      Reset Login
    </Touchable>
  ) : updateShown && config.token != null && config.onSuccess != null ? (
    <div>
      <LinkButton userId={userId} itemId={itemId} config={config} update={true}>
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
