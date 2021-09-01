import React, { useEffect, useState, useCallback } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import sortBy from 'lodash/sortBy';
import NavigationLink from 'plaid-threads/NavigationLink';
import Callout from 'plaid-threads/Callout';
import { Institution } from 'plaid/dist/api';
import { currencyFilter } from '../util';

import {
  RouteInfo,
  ItemType,
  AccountType,
  AppFundType,
  UserType,
} from './types';
import { useItems, useAccounts, useUsers, useInstitutions } from '../services';
import {
  setIdentityCheckById,
  getBalanceByItem,
  getAppFundsByUser,
} from '../services/api';

import {
  Banner,
  UserCard,
  ErrorMessage,
  ConfirmIdentity,
  MainAccount,
  AccountCard,
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
  const [account, setAccount] = useState<AccountType | null>(null);
  const [institution, setInstitution] = useState<Institution>({
    logo: '',
    name: '',
    institution_id: '',
    oauth: false,
    products: [],
    country_codes: [],
  });

  const [isIdentityChecked, setIsIdentityChecked] = useState(
    user.identity_check
  );
  const [showTransfer, setShowTransfer] = useState(false);
  const {
    getAccountsByUser,
    accountsByUser,
    getAccountsByItem,
    accountsByItem,
  } = useAccounts();
  const { usersById, getUserById } = useUsers();
  const { itemsByUser, getItemsByUser } = useItems();
  const { institutionsById, getInstitutionById } = useInstitutions();
  const userId = Number(match.params.userId);

  const getAppFund = useCallback(async userId => {
    const { data: appFunds } = await getAppFundsByUser(userId);
    setAppFund(appFunds);
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
    console.log(appFund);
    setAppFund(appFund);
  }, []);

  const updateUser = useCallback(async (user: UserType) => {
    setUser(user);
  }, []);

  const getBalance = useCallback(async () => {
    if (
      account != null &&
      (account.number_of_transfers !== 0 || account.available_balance == null)
    ) {
      //if this is not the initial transfer
      await getBalanceByItem(items[0].id, account.plaid_account_id);
      await getAccountsByItem(items[0].id);
      const itemAccounts: AccountType[] = accountsByItem[items[0].id];
      setAccount(itemAccounts[0] || {});
    }
  }, [accountsByItem, account, getAccountsByItem, items]);

  const userTransfer = () => {
    getBalance();
    setShowTransfer(true);
  };

  const closeTransferView = () => {
    setShowTransfer(false);
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
    setItems(newItems);
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
    if (accountsByUser[userId] != null && accountsByUser[userId].length > 0) {
      setAccount(accountsByUser[userId][0]);
    }
  }, [accountsByUser, userId, numOfItems]);

  // update institution

  useEffect(() => {
    if (items[0] != null) {
      setInstitution(institutionsById[items[0].plaid_institution_id] || {});
    }
  }, [institutionsById, items]);

  useEffect(() => {
    if (items[0] != null) {
      getInstitutionById(items[0].plaid_institution_id);
    }
  }, [getInstitutionById, items]);

  // update data store with the user's accounts
  useEffect(() => {
    getAppFund(userId);
  }, [userId, getAppFund]);

  useEffect(() => {
    // checks identity of user against identity/get data stored in accounts data
    // only checks if identity has not already been verified.

    if (
      account != null &&
      isIdentityChecked === false &&
      user.should_verify_identity
    ) {
      const fullnameCheck = checkFullName(account.owner_names, user.fullname);
      const emailCheck = checkUserEmail(account!.emails, user.email);
      setIdentityCheckById(userId, fullnameCheck && emailCheck); // update user_table in db
      setIsIdentityChecked(fullnameCheck && emailCheck); // set state
    }
  }, [account, checkUserEmail, checkFullName, userId, isIdentityChecked, user]);

  const accountName = account != null ? `${account.name}` : '';

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
        numOfItems={numOfItems}
        institutionName={institution.name}
        accountName={accountName}
        item={items[0]}
        isIdentityChecked={isIdentityChecked}
      />
      {numOfItems > 0 && (
        <>
          <ErrorMessage />

          {isIdentityChecked && (
            <>
              {showTransfer && account != null && (
                <AccountCard
                  institutionName={institution.name}
                  userId={userId}
                  updateAppFund={updateAppFund}
                  closeTransferView={closeTransferView}
                  account={account}
                  setAccount={setAccount}
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
      {appFund != null && !showTransfer && isIdentityChecked && (
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
