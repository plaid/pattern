import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'plaid-threads/Button';

import { UserDetails, LinkButton } from '.';
import { useItems, useUsers, useLink } from '../services';
import { pluralize } from '../util';

const propTypes = {
  user: PropTypes.object.isRequired,
};

const UserCard = ({ user }) => {
  const [numOfItems, setNumOfItems] = useState(0);
  const [linkToken, setLinkToken] = useState(null);
  const [callbacks, setCallbacks] = useState(null);

  const { itemsByUser, getItemsByUser } = useItems();
  const { generateLinkConfigs, linkConfigs } = useLink();
  const { deleteUserById } = useUsers();

  // update data store with the user's items
  useEffect(() => {
    getItemsByUser(user.id);
  }, [getItemsByUser, user.id]);

  // update no of items from data store
  useEffect(() => {
    itemsByUser[user.id] && setNumOfItems(itemsByUser[user.id].length);
  }, [itemsByUser, user.id]);

  // get link configs from link context
  useEffect(() => {
    generateLinkConfigs(user.id);
  }, [generateLinkConfigs, user.id]);

  // set linkToken and callbacks from configs from link context
  useEffect(() => {
    if (linkConfigs.byUser[user.id]) {
      setLinkToken(linkConfigs.byUser[user.id].linkToken);
      setCallbacks(linkConfigs.byUser[user.id].callbacks);
    }
  }, [linkConfigs.byUser[user.id]]);

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
            {linkToken != null && callbacks != null && (
              <LinkButton
                linkToken={linkToken}
                userId={user.id}
                callbacks={callbacks}
              >
                Link an Item
              </LinkButton>
            )}
            {!!numOfItems && (
              <Link
                className="user-card__items__link"
                to={`/user/${user.id}/items`}
              >
                {`View ${numOfItems} Linked ${pluralize('Item', numOfItems)}`}
              </Link>
            )}
          </div>
          <Button onClick={handleDeleteUser} centered userCard={true} inline>
            Remove user
          </Button>
        </div>
      </div>
    </div>
  );
};

UserCard.propTypes = propTypes;

export default UserCard;
