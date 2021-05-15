import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'plaid-threads/Button';
import Touchable from 'plaid-threads/Touchable';

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
  const [hovered, setHovered] = useState(false);

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
    <div
      className="box user-card__box"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <div className=" card user-card">
        <Touchable
          className="user-card-clickable"
          component={Link}
          to={`/user/${user.id}/items`}
        >
          <div className="user-card__detail">
            <UserDetails
              hovered={hovered}
              user={user}
              numOfItems={numOfItems}
            />
          </div>
        </Touchable>

        <div className="user-card__buttons">
          {config.token != null && (
            <LinkButton userId={user.id} config={config}>
              Link an Item
            </LinkButton>
          )}

          <Button
            className="remove"
            onClick={handleDeleteUser}
            small
            inline
            centered
            secondary
          >
            Remove user
          </Button>
        </div>
      </div>
    </div>
  );
};

UserCard.propTypes = propTypes;

export default UserCard;
