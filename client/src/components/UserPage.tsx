import React, { useEffect, useState, useCallback } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import NavigationLink from 'plaid-threads/NavigationLink';
import Callout from 'plaid-threads/Callout';
import { Institution } from 'plaid/dist/api';

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
  ConfirmIdentityForm,
  PatternAccount,
  Transfers,
} from '.';

const UserPage = ({ match }: RouteComponentProps<RouteInfo>) => {
  const [user, setUser] = useState<UserType>({
    id: 0,
    username: null,
    fullname: null,
    email: null,
    identity_check: false,
    should_verify_identity: true,
    created_at: '',
    updated_at: '',
  });
  const [appFund, setAppFund] = useState<AppFundType | null>(null);
  const [item, setItem] = useState<ItemType | null>(null);
  const [numOfItems, setNumOfItems] = useState(0);
  const [account, setAccount] = useState<AccountType | null>(null);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [isIdentityChecked, setIsIdentityChecked] = useState(
    user.identity_check
  );
  const [showTransfer, setShowTransfer] = useState(false);
  const { getAccountsByUser, accountsByUser } = useAccounts();
  const { usersById, getUserById } = useUsers();
  const { itemsByUser, getItemsByUser } = useItems();
  const { institutionsById, getInstitutionById } = useInstitutions();
  const userId = Number(match.params.userId);

  const getAppFund = useCallback(async userId => {
    const { data: appFunds } = await getAppFundsByUser(userId);
    setAppFund(appFunds);
  }, []);

  const getBalance = useCallback(async () => {
    // This is triggered when user clicks "transfer funds."
    // Only call balance/get if this is not the initial transfer (because the balance data already exists
    // from the auth/get or identity/get make upon creating the item).
    // However, if neither auth nor identity have not been called on item creation (i.e. account.available_balance=null),
    // make the balance/get call
    if (
      account != null &&
      item != null &&
      (account.number_of_transfers !== 0 || account.available_balance == null)
    ) {
      const { data: newAccount } = await getBalanceByItem(
        item.id,
        account.plaid_account_id
      );
      setAccount(newAccount || {});
    }
  }, [account, item]);

  const userTransfer = () => {
    getBalance();
    setShowTransfer(true);
  };

  // functions to check username and email against data from identity/get
  const checkFullName = useCallback(
    // ownerNames is the ownernames array returned from identity/get
    (ownerNames: string[], fullname: string | null) => {
      // in case user enters "Last name, First name"
      if (fullname != null) {
        fullname = fullname.replace(',', ' ');
        const fullnameArray = fullname.split(' ');

        // if both the first name and last name of the username in this app are included somewhere in the
        // financial institution's onwerNames array, return true (anything entered by the user (except a comma)
        // must be included in the FI's ownerNames array).
        return fullnameArray.every(name => {
          return ownerNames.some(identName => {
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
  // update data store with user
  useEffect(() => {
    getUserById(userId, false);
  }, [getUserById, userId]);

  // set state user and isIdentityChecked from data store
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

  // update data store with the user's item
  useEffect(() => {
    if (userId != null) {
      getItemsByUser(userId, true);
    }
  }, [getItemsByUser, userId]);

  // update state item from data store
  useEffect(() => {
    const newItems: Array<ItemType> = itemsByUser[userId] || [];
    setItem(newItems[0]);
  }, [itemsByUser, userId]);

  // update state number of items from data store
  useEffect(() => {
    if (itemsByUser[userId] != null) {
      setNumOfItems(itemsByUser[userId].length);
    } else {
      setNumOfItems(0);
    }
  }, [itemsByUser, userId]);

  // update data store with the user's account
  useEffect(() => {
    getAccountsByUser(userId);
  }, [getAccountsByUser, userId, numOfItems]);

  // update state account from data store
  useEffect(() => {
    if (accountsByUser[userId] != null && accountsByUser[userId].length > 0) {
      setAccount(accountsByUser[userId][0]);
    }
  }, [accountsByUser, userId, numOfItems]);

  // update data store with institutions
  useEffect(() => {
    if (item != null) {
      getInstitutionById(item.plaid_institution_id);
    }
  }, [getInstitutionById, item]);

  // update state institution from data store
  useEffect(() => {
    if (item != null) {
      setInstitution(institutionsById[item.plaid_institution_id] || {});
    }
  }, [institutionsById, item]);

  // update state with the user's app fund
  useEffect(() => {
    getAppFund(userId);
  }, [userId, getAppFund]);

  useEffect(() => {
    // checks identity of user against identity/get data stored in accounts database
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
        accountName={accountName}
        item={item}
        isIdentityChecked={isIdentityChecked}
      />
      <ErrorMessage />
      {numOfItems > 0 && !isIdentityChecked && (
        <>
          <Callout warning>
            {' '}
            We were not able to verify your identity. Please update your name
            and email address below.{' '}
          </Callout>
          <ConfirmIdentityForm userId={userId} setUser={setUser} />
        </>
      )}
      {appFund != null && !showTransfer && isIdentityChecked && (
        <PatternAccount
          userTransfer={userTransfer}
          user={user}
          appFund={appFund}
          numOfItems={numOfItems}
        />
      )}
      {isIdentityChecked && (
        <>
          {showTransfer && account != null && institution != null && (
            <Transfers
              institutionName={institution.name}
              userId={userId}
              setAppFund={setAppFund}
              setShowTransfer={setShowTransfer}
              account={account}
              setAccount={setAccount}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserPage;
