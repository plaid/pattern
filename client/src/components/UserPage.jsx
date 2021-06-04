import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import sortBy from 'lodash/sortBy';
import NavigationLink from 'plaid-threads/NavigationLink';

import {
  useItems,
  useAccounts,
  useTransactions,
  useUsers,
  useAssets,
  useLink,
} from '../services';

import { pluralize } from '../util';

import {
  Banner,
  LinkButton,
  SpendingInsights,
  NetWorth,
  ItemCard,
  UserCard,
} from '.';

const UserPage = ({ match }) => {
  const [user, setUser] = useState({});
  const [items, setItems] = useState([]);
  const [token, setToken] = useState(null);
  const [numOfItems, setNumOfItems] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [assets, setAssets] = useState([]);

  const { getTransactionsByUser, transactionsByUser } = useTransactions();
  const { getAccountsByUser, accountsByUser } = useAccounts();
  const { assetsByUser, getAssetsByUser } = useAssets();
  const { usersById, getUserById } = useUsers();
  const { itemsByUser, getItemsByUser } = useItems();
  const userId = Number(match.params.userId);
  const { generateLinkToken, linkTokens } = useLink();

  // update data store with user
  useEffect(() => {
    getUserById(userId);
  }, [getUserById, userId]);

  // set state user from data store
  useEffect(() => {
    setUser(usersById[userId] || {});
  }, [usersById, userId]);

  useEffect(() => {
    getTransactionsByUser(userId);
  }, [getTransactionsByUser, userId]);

  useEffect(() => {
    setTransactions(transactionsByUser[userId] || []);
  }, [transactionsByUser, userId]);

  useEffect(() => {
    getAssetsByUser(userId);
  }, [getAssetsByUser, userId]);

  useEffect(() => {
    setAssets(assetsByUser.assets || []);
  }, [assetsByUser, userId]);

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

  // update no of items from data store
  useEffect(() => {
    if (itemsByUser[userId] != null) {
      setNumOfItems(itemsByUser[userId].length);
    } else {
      setNumOfItems(0);
    }
  }, [itemsByUser, userId]);

  // update data store with the user's accounts
  useEffect(() => {
    getAccountsByUser(userId);
  }, [getAccountsByUser, userId]);

  useEffect(() => {
    setAccounts(accountsByUser[userId] || []);
  }, [accountsByUser, userId]);

  useEffect(() => {
    generateLinkToken(userId, null); // itemId is null
  }, [userId, numOfItems]);

  useEffect(() => {
    setToken(linkTokens.byUser[userId]);
    console.log(linkTokens);
  }, [linkTokens, userId, numOfItems]);

  return (
    <div>
      <NavigationLink component={Link} to="/">
        BACK TO LOGIN
      </NavigationLink>
      <Banner />
      <UserCard user={user} removeButton={false} />
      {numOfItems > 0 && (
        <>
          <NetWorth
            accounts={accounts}
            numOfItems={numOfItems}
            personalAssets={assets}
            userId={userId}
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
            {token != null && (
              <LinkButton token={token} userId={userId} itemId={null}>
                Add Another Item
              </LinkButton>
            )}
          </div>
          {items.map(item => (
            <div id="itemCards" key={item.id}>
              <ItemCard item={item} userId={userId} removeButton={false} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default UserPage;
