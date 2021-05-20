import React from 'react';

import { useUsers, useCurrentUser } from '../services';
import UserCard from './UserCard';

const UserList = () => {
  const { allUsers } = useUsers();
  const { userState } = useCurrentUser();
  const user = userState.currentUser;

  return (
    <>
      {user != null && user.username != null && (
        <div>
          {allUsers.map(user => (
            <div key={user.id}>
              <UserCard user={user} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UserList;
