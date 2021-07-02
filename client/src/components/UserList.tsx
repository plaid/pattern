import React, { useState, useEffect } from 'react';

import { useUsers } from '../services';
import UserCard from './UserCard';
import { UserType } from './types';
// This provides developers with a view of all users, and ability to delete a user.
// View at path: "/admin"
const UserList = () => {
  const { allUsers, getUsers, usersById } = useUsers();
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
            <UserCard
              user={user}
              userId={user.id}
              removeButton
              linkButton={false}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default UserList;
