import React, { useEffect, useState } from 'react';

import { useUsers, useCurrentUser } from '../services';
import Login from './Login';
import Banner from './Banner';
import UserList from './UserList';
import AddUserForm from './AddUserForm';
import Button from 'plaid-threads/Button';

import { useBoolean } from '../hooks';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV;

export default function Landing({}) {
  const { getUsers, usersById } = useUsers();
  const { userState, setCurrentUser } = useCurrentUser();
  const currentUser = userState.currentUser;
  const [isAdding, showForm, hideForm, toggleForm] = useBoolean(false);

  useEffect(() => {
    getUsers();
  }, [getUsers, usersById]);

  useEffect(() => {
    if (userState.newUser != null) {
      setCurrentUser(userState.newUser);
    }
  }, [getUsers, usersById]);

  const buttons = (
    <div className="loginBtns">
      <Login />
      <Button onClick={toggleForm} centered inline>
        New User
      </Button>
    </div>
  );

  return (
    <div>
      <Banner initialSubheading />
      {buttons}
      {isAdding && <AddUserForm hideForm={hideForm} />}

      <UserList />
    </div>
  );
}
