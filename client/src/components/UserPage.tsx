import React, { useEffect, useState, useCallback } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import sortBy from 'lodash/sortBy';
import NavigationLink from 'plaid-threads/NavigationLink';
import Callout from 'plaid-threads/Callout';

import {
  RouteInfo,
  ItemType,
  AccountType,
  AppFundType,
  UserType,
} from './types';
import { useItems, useAccounts, useUsers } from '../services';
import {
  setIdentityCheckById,
  getBalanceByItem,
  getAppFundsByUser,
} from '../services/api';

import {
  Banner,
  UserCard,
  ErrorMessage,
  ItemCard,
  ConfirmIdentity,
  MainAccount,
} from '.';

const UserPage = ({ match }: RouteComponentProps<RouteInfo>) => {
  const [user, setUser] = useState<UserType>({
    id: 0,
    username: null,
    fullname: null,
    email: null,
    identity_check: false,
    should_verify_identity: true,
    app_funds_balance: 0,
    created_at: '',
    updated_at: '',
  });
  const [appFund, setAppFund] = useState<AppFundType>();
  const [items, setItems] = useState<ItemType[]>([]);
  const [numOfItems, setNumOfItems] = useState(0);
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [isIdentityChecked, setIsIdentityChecked] = useState(
    user.identity_check
  );
  const [showBank, setShowBank] = useState(false);
  const {
    getAccountsByUser,
    accountsByUser,
    getAccountsByItem,
    accountsByItem,
  } = useAccounts();
  const { usersById, getUserById } = useUsers();
  const { itemsByUser, getItemsByUser } = useItems();
  const userId = Number(match.params.userId);

  const getAppFund = useCallback(async userId => {
    const { data: appFunds } = await getAppFundsByUser(userId);
    setAppFund(appFunds[0]);
  }, []);

  // functions to check username and email against data from identity/get
  const checkFullName = useCallback(
    (names: string[], fullname: string | null) => {
      // in case user enters "Last name, First name"
      if (fullname != null) {
        fullname = fullname.replace(',', ' ');
        const fullnameArray = fullname.split(' ');

        // if both the first name and last name of the username in this app are included somewhere in the
        // financial institution's names array, return true (anything entered by the user (except a comma)
        // must be included in the FI's names array).
        return fullnameArray.every(name => {
          return names.some(identName => {
            return identName.toUpperCase().indexOf(name.toUpperCase()) > -1;
          });
        });
      }
      return false;
    },
    []
  );

  const checkUserEmail = useCallback((emails: string[], user_email) => {
    return emails.includes(user_email);
  }, []);

  const updateAppFund = useCallback(async (appFund: AppFundType) => {
    setAppFund(appFund);
  }, []);

  const updateUser = useCallback(async (user: UserType) => {
    setUser(user);
  }, []);

  const getBalance = useCallback(async () => {
    await getBalanceByItem(items[0].id, accounts[0].plaid_account_id);
    await getAccountsByItem(items[0].id);
    const itemAccounts: AccountType[] = accountsByItem[items[0].id];
    setAccounts(itemAccounts || []);
  }, [accounts, accountsByItem, getAccountsByItem, items]);

  const userTransfer = () => {
    getBalance();
    setShowBank(true);
  };

  const closeView = () => {
    setShowBank(false);
  };

  // update data store with user
  useEffect(() => {
    getUserById(userId, false);
  }, [getUserById, userId]);

  // set state user from data store
  useEffect(() => {
    setUser(usersById[userId] || {});
    if (usersById[userId] != null) {
      if (usersById[userId].should_verify_identity) {
        setIsIdentityChecked(usersById[userId].identity_check);
      } else {
        setIsIdentityChecked(true);
      }
    }
  }, [usersById, userId]);

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
  }, [getAccountsByUser, userId, numOfItems]);

  useEffect(() => {
    setAccounts(accountsByUser[userId] || []);
  }, [accountsByUser, userId, numOfItems]);

  // update data store with the user's accounts
  useEffect(() => {
    getAppFund(userId);
  }, [userId, getAppFund]);

  useEffect(() => {
    // checks identity of user against identity/get data stored in accounts data
    // only checks if identity has not already been verified.

    if (
      accounts.length > 0 &&
      isIdentityChecked === false &&
      user.should_verify_identity
    ) {
      const fullnameCheck = checkFullName(
        accounts[0]!.owner_names,
        user.fullname
      );
      const emailCheck = checkUserEmail(accounts[0]!.emails, user.email);
      setIdentityCheckById(userId, fullnameCheck && emailCheck); // update user_table in db
      setIsIdentityChecked(fullnameCheck && emailCheck); // set state
    }
  }, [
    accounts,
    checkUserEmail,
    checkFullName,
    userId,
    isIdentityChecked,
    user,
  ]);
  document.getElementsByTagName('body')[0].style.overflow = 'auto'; // to override overflow:hidden from link pane
  return (
    <div>
      <NavigationLink component={Link} to="/">
        BACK TO LOGIN
      </NavigationLink>

      <Banner />
      <UserCard
        user={user}
        userId={userId}
        removeButton={false}
        linkButton={numOfItems === 0}
      />
      {numOfItems > 0 && (
        <>
          <ErrorMessage />
          {isIdentityChecked && (
            <>
              {showBank && (
                <ItemCard
                  item={items[0]}
                  isIdentityChecked={isIdentityChecked}
                  userId={userId}
                  updateAppFund={updateAppFund}
                  closeView={closeView}
                />
              )}
            </>
          )}

          {!isIdentityChecked && (
            <>
              <Callout warning>
                {' '}
                We were not able to verify your identity. Please update your
                name and email address below.{' '}
              </Callout>
              <ConfirmIdentity userId={userId} updateUser={updateUser} />
            </>
          )}
        </>
      )}
      {appFund != null && !showBank && isIdentityChecked && (
        <MainAccount
          userTransfer={userTransfer}
          user={user}
          updateUser={updateUser}
          appFund={appFund}
          numOfItems={numOfItems}
        />
      )}
    </div>
  );
};

export default UserPage;
