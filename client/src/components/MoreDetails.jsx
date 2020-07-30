import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { IconDots, Button, LinkButton } from '.';
import { useOnClickOutside } from '../hooks';

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
  const refToMenu = useOnClickOutside({
    callback: () => setmenuShown(false),
    ignoreRef: refToButton,
  });
  console.log('detail', userId, itemId, 'updateShown', updateShown);
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
          {updateShown && (
            <LinkButton
              userId={userId}
              itemId={itemId}
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
