import React, { useState } from 'react';
import Button from 'plaid-threads/Button';

import { useUsers, useCurrentUser } from '../services';
import UserCard from './UserCard';

const UserList = () => {
  const { allUsers } = useUsers();
  const { userState } = useCurrentUser();
  const user = userState.currentUser;
  const [showAllUsers, setShowAllUsers] = useState(false);

  return (
    <>
      {user != null && user.username != null && (
        <>
          <div className="usersViewBtns">
            <Button
              centered
              small
              secondary
              inline
              onClick={() => setShowAllUsers(true)}
            >
              show all users
            </Button>
            <Button
              small
              inline
              centered
              secondary
              onClick={() => setShowAllUsers(false)}
            >
              show current user only
            </Button>
          </div>
          {showAllUsers && (
            <div>
              {allUsers.map(user => (
                <div key={user.id}>
                  <UserCard user={user} />
                </div>
              ))}
            </div>
          )}{' '}
          {!showAllUsers && <UserCard removeButton={false} user={user} />}
        </>
      )}
    </>
  );
};

export default UserList;
