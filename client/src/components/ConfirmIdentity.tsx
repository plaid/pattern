import React, { useState, useEffect } from 'react';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';

import { useUsers, useCurrentUser } from '../services';
import { UserType } from './types';
import { updateUserInfo } from '../services/api';

interface Props {
  userId: number;
  updateUser: (user: UserType) => void;
}
const ConfirmIdentity: React.FC<Props> = (props: Props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const { addNewUser, getUsers } = useUsers();
  const { setCurrentUser } = useCurrentUser();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { data: users } = await updateUserInfo(props.userId, username, email);
    await setCurrentUser(username);
    props.updateUser(users[0]);
  };

  useEffect(() => {
    getUsers(true);
  }, [addNewUser, getUsers]);

  return (
    <div className="box addUserForm">
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="add-user__column-1">
            <h3 className="heading add-user__heading">Confirm your identity</h3>
            <p className="value add-user__value">
              Re-enter your full name and email as they are listed at your
              financial institution.
            </p>
          </div>
          <div className="add-user__column-2">
            <TextInput
              id="username"
              name="full_name"
              required
              autoComplete="off"
              className="input_field"
              value={username}
              placeholder="user name used at financial institution"
              label="Full Name"
              onChange={e => setUsername(e.target.value)}
            />
            <TextInput
              id="email"
              name="email"
              required
              autoComplete="off"
              className="input_field"
              value={email}
              placeholder="email used at financial institution"
              label="Email"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="add-user__column-3">
            <Button className="add-user__button" centered small type="submit">
              Confirm
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

ConfirmIdentity.displayName = 'ConfirmIdentity';
export default ConfirmIdentity;
