import React, { useState, useEffect } from 'react';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';

import { useUsers, useCurrentUser } from '../services';

const AddUserForm = ({ hideForm }) => {
  const [username, setUsername] = useState('');

  const { addNewUser, getUsers } = useUsers();
  const { setNewUser } = useCurrentUser();

  const handleSubmit = async e => {
    e.preventDefault();
    await addNewUser(username);
    hideForm();
    setNewUser(username);
  };

  useEffect(() => {
    getUsers();
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
              type="text"
              name="username"
              required="required"
              autoComplete="off"
              className="input_field"
              value={username}
              placeholder="New user name"
              label="User_Name"
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="add-user__column-3">
            <Button className="add-user__button" centered small type="submit">
              Add User
            </Button>
            <Button
              className="add-user__button"
              centered
              small
              secondary
              type="cancel"
              onClick={hideForm}
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
