import React from 'react';
import { pluralize } from '../util';

import { formatDate } from '../util';
import { UserType } from './types';

interface Props {
  user: UserType;
  numOfItems: number;
  hovered: boolean;
}

const UserDetails = (props: Props) => {
  return (
    <>
      <div className="user-card__column-1">
        <h3 className="heading">User_ID</h3>
        <p className="value">{props.user.id}</p>
      </div>
      <div className="user-card__column-2">
        <h3 className="heading">User_NAME</h3>
        <p className="value">{props.user.username}</p>
      </div>
      <div className="user-card__column-3">
        <h3 className="heading">CREATED_AT</h3>
        <p className="value">{formatDate(props.user.created_at)}</p>
      </div>
      <div className="user-card__column-4">
        <h3 className="heading">LINKED_ITEMS</h3>
        <p className="value">
          {props.hovered ? 'View ' : ''}{' '}
          {`${props.numOfItems} ${pluralize('item', props.numOfItems)}`}
        </p>
      </div>
    </>
  );
};

export default UserDetails;
