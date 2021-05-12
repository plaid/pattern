import React from 'react';
import Button from 'plaid-threads/Button';

import { useBoolean } from '../hooks';
import { useUsers } from '../services';
import { pluralize } from '../util';
import UserCard from './UserCard';
import AddUserForm from './AddUserForm';

const UserList = () => {
  const { allUsers } = useUsers();
  const [isAdding, showForm, hideForm, toggleForm] = useBoolean(false); // eslint-disable-line no-unused-vars

  return (
    <div>
      <div className="header">
        <h2 className="user-list-heading">
          {`${allUsers.length} ${pluralize('User', allUsers.length)}`}
        </h2>
        <Button onClick={toggleForm} centered inline>
          Add a New User
        </Button>
      </div>
      {/* @TODO handle prevention of duplicate username */}
      {isAdding && <AddUserForm hideForm={hideForm} />}
      {allUsers.map(user => (
        <div key={user.id}>
          <UserCard user={user} />
        </div>
      ))}
    </div>
  );
};

export default UserList;
