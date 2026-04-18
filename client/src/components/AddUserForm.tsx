import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button.tsx';
import { TextInput } from './ui/TextInput.tsx';

import { useUsers, useCurrentUser } from '../services';

interface Props {
  hideForm: () => void;
}
const AddUserForm = (props: Props) => {
  const [username, setUsername] = useState('');

  const { addNewUser, getUsers } = useUsers();
  const { setNewUser } = useCurrentUser();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await addNewUser(username);
    setNewUser(username);
    props.hideForm();
  };

  useEffect(() => {
    getUsers(true);
  }, [addNewUser, getUsers]);

  return (
    <div className="box addUserForm">
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="add-user__column-1">
            <h3 className="heading add-user__heading">Add a new user</h3>
            <p className="value add-user__value">
              Enter your name in the input field.
            </p>
          </div>
          <div className="add-user__column-2">
            <TextInput
              id="username"
              name="username"
              required
              autoComplete="off"
              className="input_field"
              value={username}
              placeholder="New user name"
              label=""
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="add-user__column-3">
            <Button className="add-user__button" small type="submit">
              Add User
            </Button>
            <Button
              className="add-user__button"
              small
              secondary
              onClick={props.hideForm}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
