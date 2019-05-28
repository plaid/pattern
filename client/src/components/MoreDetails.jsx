import React, { useState } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { IconDots, Button, LinkButton } from '.';

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

  MoreDetails.handleClickOutside = () => setmenuShown(false);

  return (
    <div className="more-details">
      <button
        className="more-details__icon"
        onClick={() => setmenuShown(current => !current)}
      >
        <IconDots />
      </button>
      {menuShown && (
        <div className="more-details__button-group">
          {setBadStateShown && (
            <Button
              altClasses="more-details_button"
              action={handleSetBadState}
              text="Reset Login"
            />
          )}
          {updateShown && (
            <LinkButton
              userid={userId}
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

const clickOutsideConfig = {
  handleClickOutside: () => MoreDetails.handleClickOutside,
};

export default onClickOutside(MoreDetails, clickOutsideConfig);
