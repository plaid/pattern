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
    <div className="user-card__column-2">
      <h3 className="heading">User Name</h3>
      <p className="value">{user.username}</p>
    </div>
    <div className="user-card__column-3">
      <h3 className="heading">Create on</h3>
      <p className="value">{formatDate(user.created_at)}</p>
    </div>
    <div className="user-card__column-4">
      <h3 className="heading">Number of banks connected</h3>
      <p className="value">
        {hovered ? 'View ' : ''}{' '}
        {`${numOfItems} ${pluralize('bank', numOfItems)}`}
      </p>
    </div>
  </>
);

UserDetails.propTypes = propTypes;

export default UserDetails;
