import React, { useState, useEffect } from 'react';

import { useUsers } from '../services';
import UserCard from './UserCard';
// This provides developers with a view of all users, and ability to delete a user.
// View at path: "/admin"
const UserList = () => {
  const { allUsers, getUsers, usersById } = useUsers();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, [getUsers, usersById]);

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
              admin={true}
              linkButton={false}
              assetButton={false}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default UserList;
