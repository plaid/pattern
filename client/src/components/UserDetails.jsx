import React from 'react';
import PropTypes from 'prop-types';

import { formatDate } from '../util';

const propTypes = {
  user: PropTypes.object.isRequired,
};

const UserDetails = ({ user }) => (
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
  </>
);

UserDetails.propTypes = propTypes;

export default UserDetails;
