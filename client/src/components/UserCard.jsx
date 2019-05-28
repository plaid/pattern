import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { UserDetails, MoreDetails } from '.';
import { useItems, useUsers } from '../services';
import { pluralize } from '../util';
import LinkButton from './LinkButton';

const propTypes = {
  user: PropTypes.object.isRequired,
};

const UserCard = ({ user }) => {
  const [numOfItems, setNumOfItems] = useState(0);
  const { itemsByUser, getItemsByUser } = useItems();

  const { deleteUserById } = useUsers();

  // update data store with the user's items
  useEffect(() => {
    getItemsByUser(user.id);
  }, [getItemsByUser, user.id]);

  // update no of items from data store
  useEffect(() => {
    itemsByUser[user.id] && setNumOfItems(itemsByUser[user.id].length);
  }, [itemsByUser, user.id]);

  const handleDeleteUser = () => {
    deleteUserById(user.id);
  };

  return (
    <div className="box user-card__box">
      <div className="card user-card">
        <div className="user-card__detail">
          <UserDetails user={user} />
        </div>
        <div className="user-card__button-group">
          <LinkButton primary userId={user.id}>
            Link an Item
          </LinkButton>
          {!!numOfItems && (
            <Link className="user-card__link" to={`/user/${user.id}/items`}>
              {`View ${numOfItems} Linked ${pluralize('Item', numOfItems)}`}
            </Link>
          )}
        </div>
        <MoreDetails handleDelete={handleDeleteUser} />
      </div>
    </div>
  );
};

UserCard.propTypes = propTypes;

export default UserCard;
