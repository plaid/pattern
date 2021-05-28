import React, { useEffect } from 'react';
import Button from 'plaid-threads/Button';
import { useHistory, Link } from 'react-router-dom';

import { useUsers, useCurrentUser, useLinkEvents } from '../services';
import { Login, Banner, AddUserForm } from './';

import { useBoolean } from '../hooks';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV;

export default function Landing({}) {
  const { getUsers, usersById } = useUsers();
  const { userState, setCurrentUser } = useCurrentUser();
  const { linkEvents, getLinkEvents } = useLinkEvents();
  const [isAdding, showForm, hideForm, toggleForm] = useBoolean(false);
  const history = useHistory();

  useEffect(() => {
    getUsers();
  }, [getUsers, usersById]);

  useEffect(() => {
    if (userState.newUser != null) {
      setCurrentUser(userState.newUser);
    }
  }, [getUsers, usersById]);

  useEffect(() => {
    getLinkEvents();
  }, [getLinkEvents, usersById]);

  console.log(userState);

  const returnToCurrentUser = () => {
    history.push(`/user/${userState.currentUser.id}`);
  };

  return (
    <div>
      <Banner initialSubheading />
      <div className="btnsContainer">
        <Login />
        <Button className="btnWithMargin" onClick={toggleForm} centered inline>
          Add New User
        </Button>
        {userState.currentUser.username != null && (
          <Button
            className="btnWithMargin"
            centered
            inline
            onClick={returnToCurrentUser}
            // component={Link}
            // to = `/user/${userState.currentUser.id}/items`
          >
            Return to Current User
          </Button>
        )}
      </div>
      {isAdding && <AddUserForm hideForm={hideForm} />}
    </div>
  );
}
