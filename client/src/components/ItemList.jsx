import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import sortBy from 'lodash/sortBy';

import { useItems, useAccounts, useUsers, useLink } from '../services';
import { pluralize } from '../util';
import ItemCard from './ItemCard';
import { Banner, LinkButton, UserDetails } from '.';

const ItemList = ({ match }) => {
  const [user, setUser] = useState({});
  const [items, setItems] = useState([]);

  const { usersById, getUserById } = useUsers();
  const { itemsByUser, getItemsByUser } = useItems();
  const { getAccountsByUser } = useAccounts();
  const { generateLinkConfigs, linkConfigs } = useLink();
  const [linkToken, setLinkToken] = useState(null);
  const [callbacks, setCallbacks] = useState(null);
  const itemId = null;

  const userId = Number(match.params.userId);

  // update data store with user
  useEffect(() => {
    getUserById(userId);
  }, [getUserById, userId]);

  // set state user from data store
  useEffect(() => {
    setUser(usersById[userId] || {});
  }, [usersById, userId]);

  // update data store with the user's items
  useEffect(() => {
    getItemsByUser(userId);
  }, [getItemsByUser, userId]);

  // update state items from data store
  useEffect(() => {
    const newItems = itemsByUser[userId] || [];
    const orderedItems = sortBy(
      newItems,
      item => new Date(item.updated_at)
    ).reverse();
    setItems(orderedItems);
  }, [itemsByUser, userId]);

  // update data store with the user's accounts
  useEffect(() => {
    getAccountsByUser(userId);
  }, [getAccountsByUser, userId]);

  // get linkToken and configs for Link
  useEffect(() => {
    generateLinkConfigs(userId, itemId);
  }, [generateLinkConfigs, userId]);

  //set link token and configs for Link
  useEffect(() => {
    if (linkConfigs.byUser[userId]) {
      setLinkToken(linkConfigs.byUser[userId].linkToken);
      setCallbacks(linkConfigs.byUser[userId].callbacks);
    }
  }, [linkConfigs]);
  console.log('in userlist: ', linkToken, callbacks);
  return (
    <div>
      <Link to={`/`} className="back-to-user__link">{`< BACK TO USERS`}</Link>
      <Banner />
      <div className="bottom-border-content">
        <UserDetails user={user} />
      </div>
      <div className="item__header">
        <div>
          <h2 className="item__header-heading">
            {`${items.length} ${pluralize('Item', items.length)} Linked`}
          </h2>
          {!!items.length && (
            <p className="item__header-subheading">
              Below is a list of all the&nbsp;
              <a
                href="https://plaid.com/docs/quickstart/#item-overview"
                target="_blank"
                rel="noopener noreferrer"
              >
                items
              </a>
              . Click on an item to view its associated accounts.
            </p>
          )}
        </div>
        {linkToken != null && callbacks != null && (
          <LinkButton
            linkToken={linkToken}
            primary
            userId={user.id}
            callbacks={callbacks}
          >
            Add Another Item
          </LinkButton>
        )}
      </div>
      {items.map(item => (
        <div key={item.id}>
          <ItemCard item={item} userId={userId} />
        </div>
      ))}
    </div>
  );
};

export default ItemList;
