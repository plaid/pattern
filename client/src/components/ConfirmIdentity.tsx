import React, { useState, useEffect } from 'react';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';

import { useUsers } from '../services';
import { UserType } from './types';
import { updateUserInfo } from '../services/api';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV;

interface Props {
  userId: number;
  updateUser: (user: UserType) => void;
}
const ConfirmIdentity: React.FC<Props> = (props: Props) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');

  const { getUsers } = useUsers();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { data: users } = await updateUserInfo(props.userId, fullname, email);
    props.updateUser(users[0]);
    setFullname('');
    setEmail('');
  };

  const environment = PLAID_ENV === 'sandbox' ? 'sandbox' : 'development';

  const messages = {
    sandbox: {
      message: 'Re-enter sandbox name and email address in the input fields.',
      namePlaceholder: "sandbox: 'Alberta Charleson'",
      emailPlaceholder: "sandbox: 'accountholder0@example.com'",
    },
    development: {
      message:
        'Re-enter your full name and email as they are listed at your financial institution.',
      namePlaceholder: 'full name used at financial institution',
      emailPlaceholder: 'email used at financial institution',
    },
  };

  useEffect(() => {
    getUsers(true);
  }, [getUsers]);

  return (
    <div className="box addUserForm">
      <form>
        <div className="card">
          <div className="add-user__column-1">
            <h3 className="heading add-user__heading">Confirm your identity</h3>
            <p className="value add-user__value">
              {messages[environment].message}
            </p>
          </div>
          <div className="add-user__column-2">
            <TextInput
              id="fullname"
              name="fullname"
              required
              autoComplete="off"
              className="input_field"
              value={fullname}
              placeholder={messages[environment].namePlaceholder}
              label="Full Name"
              onChange={e => setFullname(e.target.value)}
            />
            <TextInput
              id="email"
              name="email"
              required
              autoComplete="off"
              className="input_field"
              value={email}
              placeholder={messages[environment].emailPlaceholder}
              label="Email"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="add-user__column-3">
            <Button
              className="add-user__button"
              centered
              small
              onClick={handleSubmit}
            >
              Confirm Identity
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

ConfirmIdentity.displayName = 'ConfirmIdentity';
export default ConfirmIdentity;
