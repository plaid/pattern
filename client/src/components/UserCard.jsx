import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { HashLink } from 'react-router-hash-link';
import Button from 'plaid-threads/Button';
import Touchable from 'plaid-threads/Touchable';

import { UserDetails, LinkButton } from '.';
import { useItems, useUsers } from '../services';
import { useGenerateLinkConfig } from '../hooks';

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  removeButton: PropTypes.bool,
  linkButton: PropTypes.bool,
};

UserCard.defaultProps = {
  user: {},
  removeButton: true,
  linkButton: true,
};

export default function UserCard({ user, removeButton, linkButton }) {
  const [numOfItems, setNumOfItems] = useState(0);
  const [config, setConfig] = useState({ token: null, onSucces: null });
  const [hovered, setHovered] = useState(false);

  const { itemsByUser, getItemsByUser } = useItems();
  const { deleteUserById } = useUsers();
  const linkConfig = useGenerateLinkConfig(false, user.id, null);

  // update data store with the user's items
  useEffect(() => {
    getItemsByUser(user.id);
  }, [getItemsByUser, user.id]);

  // update no of items from data store
  useEffect(() => {
    if (itemsByUser[user.id] != null) {
      setNumOfItems(itemsByUser[user.id].length);
    } else {
      setNumOfItems(0);
    }
  }, [itemsByUser, user.id]);

  useEffect(() => {
    setConfig(linkConfig);
  }, [linkConfig, user.id]);

  const handleDeleteUser = () => {
    deleteUserById(user.id); // this will delete all items associated with a user
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
          component={HashLink}
          to={`/user/${user.id}#itemCards`}
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
          {config.token != null && linkButton && (
            <LinkButton userId={user.id} config={config} itemId={null}>
              Link an Item
            </LinkButton>
          )}
          {removeButton && (
            <Button
              className="remove"
              onClick={handleDeleteUser}
              small
              inline
              centered
              secondary
            >
              Delete user
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
