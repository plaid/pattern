import React, { useState, useEffect } from 'react';

import { HashLink } from 'react-router-hash-link';
import Button from 'plaid-threads/Button';
import Touchable from 'plaid-threads/Touchable';
import { useUsers } from '../services';
import { UserType } from './types';
// This provides developers with a list of all users by username, and ability to delete a user.
// View at path: "/admin"
const UserList = () => {
  const { allUsers, getUsers, usersById, deleteUserById } = useUsers();
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    getUsers(true);
  }, [getUsers]);

  useEffect(() => {
    setUsers(allUsers);
  }, [allUsers, usersById]);

  return (
    <>
      <h5>For developer admin use</h5>

      <div>
        {users.map(user => (
          <div key={user.id}>
            <div className="user-list">
              <Touchable
                className="user-list__touchable"
                component={HashLink}
                to={`/user/${user.id}`}
              >
                <div className="user-list__name">{user.username}</div>
              </Touchable>
              <div>
                <Button
                  small
                  inline
                  centered
                  onClick={() => deleteUserById(user.id)}
                >
                  delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserList;
