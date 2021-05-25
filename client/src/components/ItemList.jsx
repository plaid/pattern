import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import sortBy from 'lodash/sortBy';
import NavigationLink from 'plaid-threads/NavigationLink';

import { SpendingInsights } from '.';
import { Property } from '.';
import { NetWorth } from '.';
import {
  useItems,
  useAccounts,
  useTransactions,
  useProperties,
  useUsers,
} from '../services';
import { pluralize } from '../util';
import ItemCard from './ItemCard';
import { useGenerateLinkConfig } from '../hooks';
import { Banner, LinkButton, UserDetails } from '.';

const ItemList = ({ match }) => {
  const [user, setUser] = useState({});
  const [items, setItems] = useState([]);
  const [config, setConfig] = useState({ token: null, onSucces: null });
  const [numOfItems, setNumOfItems] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [properties, setProperties] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const { getTransactionsByUserByDate, transactionsByUser } = useTransactions();
  const { getAccountsByUser, accountsByUser } = useAccounts();
  const { propertiesByUser, getPropertiesByUser } = useProperties();
  const { usersById, getUserById } = useUsers();
  const { itemsByUser, getItemsByUser } = useItems();
  const userId = Number(match.params.userId);
  const linkConfig = useGenerateLinkConfig(false, userId, null);

  // update data store with user
  useEffect(() => {
    getUserById(userId);
  }, [getUserById, userId]);

  // set state user from data store
  useEffect(() => {
    setUser(usersById[userId] || {});
  }, [usersById, userId]);

  useEffect(() => {
    getTransactionsByUserByDate(userId);
  }, [getTransactionsByUserByDate, userId]);

  useEffect(() => {
    setTransactions(transactionsByUser[userId] || []);
  }, [transactionsByUser, userId]);

  useEffect(() => {
    setAccounts(accountsByUser[userId] || []);
  }, [accountsByUser, userId]);

  useEffect(() => {
    getPropertiesByUser(userId);
  }, [getPropertiesByUser, userId]);

  useEffect(() => {
    setProperties(propertiesByUser.properties || []);
  }, [propertiesByUser, userId]);

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

  // update no of items from data store
  useEffect(() => {
    itemsByUser[user.id] && setNumOfItems(itemsByUser[user.id].length);
  }, [itemsByUser, user.id]);

  useEffect(() => {
    setConfig(linkConfig);
  }, [linkConfig, userId]);

  return (
    <div>
      <NavigationLink component={Link} to="/">
        BACK TO LOGIN
      </NavigationLink>
      <Banner />
      <div className="bottom-border-content user-card__detail">
        <UserDetails numOfItems={items.length} user={user} />
      </div>
      <NetWorth
        accounts={accounts}
        numOfItems={numOfItems}
        properties={properties}
      />
      <SpendingInsights transactions={transactions} />
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
        {config.token != null && (
          <LinkButton config={config} userId={userId} itemId={null}>
            Add Another Item
          </LinkButton>
        )}
        <Property userId={user.id} />
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
