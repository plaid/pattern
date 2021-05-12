import React from 'react';
import PropTypes from 'prop-types';
import { pluralize } from '../util';

import { formatDate } from '../util';

const propTypes = {
  user: PropTypes.object.isRequired,
  numOfItems: PropTypes.number,
  hovered: PropTypes.bool,
};

const UserDetails = ({ user, numOfItems, hovered }) => (
  <>
    <div className="user-card__column-1">
      <h3 className="heading">User_ID</h3>
      <p className="value">{user.id}</p>
    </div>
    <div className="user-card__column-2">
      <h3 className="heading">User_NAME</h3>
      <p className="value">{user.username}</p>
    </div>
    <div className="user-card__column-3">
      <h3 className="heading">CREATED_AT</h3>
      <p className="value">{formatDate(user.created_at)}</p>
    </div>
    <div className="user-card__column-4">
      <h3 className="heading">LINKED_ITEMS</h3>
      <p className="value">
        {hovered ? 'View ' : ''}{' '}
        {`${numOfItems} ${pluralize('item', numOfItems)}`}
      </p>
    </div>
  </>
);

UserDetails.propTypes = propTypes;

export default UserDetails;
