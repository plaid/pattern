import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { HashLink } from 'react-router-hash-link';
import Button from 'plaid-threads/Button';
import Touchable from 'plaid-threads/Touchable';

import { UserDetails, LinkButton } from '.';
import { useItems, useUsers, useLink } from '../services';

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
  const [token, setToken] = useState(null);
  const [hovered, setHovered] = useState(false);

  const { itemsByUser, getItemsByUser } = useItems();
  const { deleteUserById } = useUsers();
  const { generateLinkToken, linkTokens } = useLink();

  // update data store with the user's items
  useEffect(() => {
    if (user.id) {
      getItemsByUser(user.id);
    }
  }, [getItemsByUser, user.id]);

  // update no of items from data store
  useEffect(() => {
    if (itemsByUser[user.id] != null) {
      setNumOfItems(itemsByUser[user.id].length);
    } else {
      setNumOfItems(0);
    }
  }, [itemsByUser, user.id]);

  // creates new link token upon change in user or number of items
  useEffect(() => {
    generateLinkToken(user.id, null); // itemId is null
  }, [user.id, numOfItems, generateLinkToken]);

  useEffect(() => {
    setToken(linkTokens.byUser[user.id]);
  }, [linkTokens, user.id, numOfItems]);

  const handleDeleteUser = () => {
    deleteUserById(user.id); // this will delete all items associated with a user
  };
  return (
    <div className="box user-card__box">
      <div className=" card user-card">
        <div
          className="hoverable"
          onMouseEnter={() => {
            if (numOfItems > 0) {
              setHovered(true);
            }
          }}
          onMouseLeave={() => {
            setHovered(false);
          }}
        >
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
        </div>

        <div className="user-card__buttons">
          {token != null && linkButton && (
            <LinkButton userId={user.id} token={token} itemId={null}>
              Add a Bank
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
