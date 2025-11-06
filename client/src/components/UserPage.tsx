import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import sortBy from 'lodash/sortBy';
import NavigationLink from 'plaid-threads/NavigationLink';
import LoadingSpinner from 'plaid-threads/LoadingSpinner';
import Callout from 'plaid-threads/Callout';
import Button from 'plaid-threads/Button';

import { RouteInfo, ItemType, AccountType, AssetType } from './types';

import useItems from '../services/items.tsx';
import useTransactions from '../services/transactions.tsx';
import useUsers from '../services/users.tsx';
import useAssets from '../services/assets.tsx';
import useLink from '../services/link.tsx';
import useAccounts from '../services/accounts.tsx';

import { pluralize } from '../util/index.tsx';

import Banner from './Banner.tsx';
import LaunchLink from './LaunchLink.tsx';
import SpendingInsights from './SpendingInsights.tsx';
import NetWorth from './NetWorth.tsx';
import ItemCard from './ItemCard.tsx';
import UserCard from './UserCard.tsx';
import LoadingCallout from './LoadingCallout.tsx';
import ErrorMessage from './ErrorMessage.tsx';
import TransactionsTable from './TransactionsTable.tsx';


// provides view of user's net worth, spending by category and allows them to explore
// account and transactions details for linked items

const UserPage = () => {
  const { userId } = useParams<{ userId: string }>();
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

      <Banner />
      {linkTokens.error.error_code != null && (
        <Callout warning>
          <div>
            <strong>Unable to connect to Plaid:</strong> Please make sure your backend server is
            running and that your .env file has been configured with valid Plaid credentials.
          </div>
          <div style={{ marginTop: '8px' }}>
            <strong>Error Code:</strong> <code>{linkTokens.error.error_code}</code>
          </div>
          <div>
            <strong>Error Type:</strong> <code>{linkTokens.error.error_type}</code>
          </div>
          <div>
            <strong>Error Message:</strong> {linkTokens.error.error_message}
          </div>
        </Callout>
      )}
      <UserCard user={user} userId={userId} removeButton={false} linkButton />

      <Callout style={{ marginBottom: '2rem' }}>
        <div>
          <strong>💡 Testing with Dynamic Transaction Data:</strong>
        </div>
        <div style={{ marginTop: '8px' }}>
          To test with realistic data, link a <strong>non-OAuth institution</strong> like{' '}
          <strong>First Platypus Bank</strong> and use these Plaid Link credentials:{' '}
          <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>
            user_transactions_dynamic
          </code>{' '}
          (any password). The "Refresh Transactions" button will trigger simulated transaction updates.
          See the README for more information about testing with realistic transaction data.
        </div>
      </Callout>

      {numOfItems === 0 && <ErrorMessage />}
      {numOfItems > 0 && transactions.length === 0 && (
        <div className="loading">
          <LoadingSpinner />
          <LoadingCallout />
        </div>
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
      {numOfItems > 0 && transactions.length > 0 && (
        <>
          <div className="item__header" style={{ marginTop: '3rem' }}>
            <h2 className="item__header-heading">All Transactions</h2>
            <p className="item__header-subheading">
              Complete transaction history across all linked accounts
            </p>
          </div>
          <div className="box">
            <TransactionsTable transactions={transactions} />
          </div>
          <SpendingInsights
            numOfItems={numOfItems}
            transactions={transactions}
          />
          <NetWorth
            accounts={accounts}
            numOfItems={numOfItems}
            personalAssets={assets}
            userId={userId}
            assetsOnly={false}
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
    </div>
  );
};

export default UserPage;
