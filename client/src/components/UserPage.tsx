import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import sortBy from 'lodash/sortBy';
import NavigationLink from 'plaid-threads/NavigationLink';
import LoadingSpinner from 'plaid-threads/LoadingSpinner';
import Callout from 'plaid-threads/Callout';
import Button from 'plaid-threads/Button';

import { RouteInfo, ItemType, AccountType, AssetType } from './types';
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
  LaunchLink,
  SpendingInsights,
  NetWorth,
  ItemCard,
  UserCard,
  LoadingCallout,
  ErrorMessage,
} from '.';

// provides view of user's net worth, spending by category and allows them to explore
// account and transactions details for linked items

const UserPage = ({ match }: RouteComponentProps<RouteInfo>) => {
  const [user, setUser] = useState({
    id: 0,
    username: '',
    created_at: '',
    updated_at: '',
  });
  const [items, setItems] = useState<ItemType[]>([]);
  const [token, setToken] = useState('');
  const [numOfItems, setNumOfItems] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [assets, setAssets] = useState<AssetType[]>([]);

  const { getTransactionsByUser, transactionsByUser } = useTransactions();
  const { getAccountsByUser, accountsByUser } = useAccounts();
  const { assetsByUser, getAssetsByUser } = useAssets();
  const { usersById, getUserById } = useUsers();
  const { itemsByUser, getItemsByUser } = useItems();
  const userId = Number(match.params.userId);
  const { generateLinkToken, linkTokens } = useLink();

  const initiateLink = async () => {
    // only generate a link token upon a click from enduser to add a bank;
    // if done earlier, it may expire before enduser actually activates Link to add a bank.
    await generateLinkToken(userId, null);
  };

  // update data store with user
  useEffect(() => {
    getUserById(userId, false);
  }, [getUserById, userId]);

  // set state user from data store
  useEffect(() => {
    setUser(usersById[userId] || {});
  }, [usersById, userId]);

  useEffect(() => {
    // This gets transactions from the database only.
    // Note that calls to Plaid's transactions/get endpoint are only made in response
    // to receipt of a transactions webhook.
    getTransactionsByUser(userId);
  }, [getTransactionsByUser, userId]);

  useEffect(() => {
    setTransactions(transactionsByUser[userId] || []);
  }, [transactionsByUser, userId]);

  // update data store with the user's assets
  useEffect(() => {
    getAssetsByUser(userId);
  }, [getAssetsByUser, userId]);

  useEffect(() => {
    setAssets(assetsByUser.assets || []);
  }, [assetsByUser, userId]);

  // update data store with the user's items
  useEffect(() => {
    if (userId != null) {
      getItemsByUser(userId, true);
    }
  }, [getItemsByUser, userId]);

  // update state items from data store
  useEffect(() => {
    const newItems: Array<ItemType> = itemsByUser[userId] || [];
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
    setToken(linkTokens.byUser[userId]);
  }, [linkTokens, userId, numOfItems]);

  document.getElementsByTagName('body')[0].style.overflow = 'auto'; // to override overflow:hidden from link pane
  return (
    <div>
      <NavigationLink component={Link} to="/">
        BACK TO LOGIN
      </NavigationLink>
      <p />
      <NavigationLink component={Link} to={`/transactions/${userId}`}>
        USER TRANSACTIONS
      </NavigationLink>

      <Banner />
      {linkTokens.error.error_code != null && (
        <Callout warning>
          <div>
            Unable to fetch link_token: please make sure your backend server is
            running and that your .env file has been configured correctly.
          </div>
          <div>
            Error Code: <code>{linkTokens.error.error_code}</code>
          </div>
          <div>
            Error Type: <code>{linkTokens.error.error_type}</code>{' '}
          </div>
          <div>Error Message: {linkTokens.error.error_message}</div>
        </Callout>
      )}
      <UserCard user={user} userId={userId} removeButton={false} linkButton />
      {numOfItems === 0 && <ErrorMessage />}
      {numOfItems > 0 && transactions.length === 0 && (
        <div className="loading">
          <LoadingSpinner />
          <LoadingCallout />
        </div>
      )}
      {numOfItems > 0 && transactions.length > 0 && (
        <>
          <NetWorth
            accounts={accounts}
            numOfItems={numOfItems}
            personalAssets={assets}
            userId={userId}
            assetsOnly={false}
          />
          <SpendingInsights
            numOfItems={numOfItems}
            transactions={transactions}
          />
        </>
      )}
      {numOfItems === 0 && transactions.length === 0 && assets.length > 0 && (
        <>
          <NetWorth
            accounts={accounts}
            numOfItems={numOfItems}
            personalAssets={assets}
            userId={userId}
            assetsOnly
          />
        </>
      )}
      {numOfItems > 0 && (
        <>
          <div className="item__header">
            <div>
              <h2 className="item__header-heading">
                {`${items.length} ${pluralize('Bank', items.length)} Linked`}
              </h2>
              {!!items.length && (
                <p className="item__header-subheading">
                  Below is a list of all your connected banks. Click on a bank
                  to view its associated accounts.
                </p>
              )}
            </div>

            <Button
              large
              inline
              className="add-account__button"
              onClick={initiateLink}
            >
              Add another bank
            </Button>

            {token != null && token.length > 0 && (
              // Link will not render unless there is a link token
              <LaunchLink token={token} userId={userId} itemId={null} />
            )}
          </div>
          <ErrorMessage />
          {items.map(item => (
            <div id="itemCards" key={item.id}>
              <ItemCard item={item} userId={userId} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default UserPage;
