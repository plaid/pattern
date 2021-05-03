import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { UserDetails, MoreDetails } from '.';
import { useItems, useUsers, useLink } from '../services';
import { pluralize } from '../util';
import LinkButton from './LinkButton';

const propTypes = {
  user: PropTypes.object.isRequired,
};

const UserCard = ({ user }) => {
  const [numOfItems, setNumOfItems] = useState(0);
  const { itemsByUser, getItemsByUser } = useItems();
  const { generateLinkConfigs, linkConfigs } = useLink();
  const [linkToken, setLinkToken] = useState(null);
  const [callbacks, setCallbacks] = useState(null);
  const { deleteUserById } = useUsers();
  const itemID = null;

  // update data store with the user's items
  useEffect(() => {
    getItemsByUser(user.id, itemID);
  }, [getItemsByUser, user.id]);

  // update no of items from data store
  useEffect(() => {
    itemsByUser[user.id] && setNumOfItems(itemsByUser[user.id].length);
  }, [itemsByUser, user.id]);

  // update data store with the user's items
  useEffect(() => {
    generateLinkConfigs(user.id, itemID);
  }, [getItemsByUser, user.id]);

  useEffect(() => {
    if (linkConfigs.byUser[user.id]) {
      setLinkToken(linkConfigs.byUser[user.id].linkToken);
      setCallbacks(linkConfigs.byUser[user.id].callbacks);
    }
  }, [linkConfigs]);

  const handleDeleteUser = () => {
    deleteUserById(user.id);
  };
  console.log('here i am: ', linkToken, callbacks);
  return (
    <div className="box user-card__box">
      <div className="card user-card">
        <div className="user-card__detail">
          <UserDetails user={user} />
        </div>
        <div className="user-card__button-group">
          {linkToken != null && callbacks != null && (
            <LinkButton
              linkToken={linkToken}
              primary
              userId={user.id}
              callbacks={callbacks}
            >
              Link an Item
            </LinkButton>
          )}
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
