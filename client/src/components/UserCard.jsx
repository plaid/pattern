import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'plaid-threads/Button';

import { UserDetails, LinkButton } from '.';
import { useItems, useUsers } from '../services';
import { useGenerateLinkConfig } from '../hooks';
import { pluralize } from '../util';

const propTypes = {
  user: PropTypes.object.isRequired,
};

const UserCard = ({ user }) => {
  const [numOfItems, setNumOfItems] = useState(0);
  const [config, setConfig] = useState({ token: null, onSucces: null });

  const { itemsByUser, getItemsByUser } = useItems();
  const { deleteUserById } = useUsers();
  const getLinkConfig = useGenerateLinkConfig(user.id, null);

  // update data store with the user's items
  useEffect(() => {
    getItemsByUser(user.id);
  }, [getItemsByUser, user.id]);

  // update no of items from data store
  useEffect(() => {
    itemsByUser[user.id] && setNumOfItems(itemsByUser[user.id].length);
  }, [itemsByUser, user.id]);

  useEffect(() => {
    setConfig(getLinkConfig);
  }, [getLinkConfig, user.id]);

  const handleDeleteUser = () => {
    deleteUserById(user.id);
  };
  return (
    <div className="box user-card__box">
      <div className="card user-card">
        <div className="user-card__detail">
          <UserDetails user={user} />
        </div>
        <div className="user-card__buttons">
          <div className="user-card__link__button">
            {config.token != null && (
              <LinkButton userId={user.id} config={config}>
                Link an Item
              </LinkButton>
            )}
            {numOfItems !== 0 && (
              <Link
                className="user-card__items__link"
                to={`/user/${user.id}/items`}
              >
                {`View ${numOfItems} Linked ${pluralize('Item', numOfItems)}`}
              </Link>
            )}
          </div>
          <Button onClick={handleDeleteUser} small centered inline>
            Remove user
          </Button>
        </div>
      </div>
    </div>
  );
};

UserCard.propTypes = propTypes;

export default UserCard;
