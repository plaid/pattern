import React, { useState } from 'react';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';

import { useUsers } from '../services';

const AddUserForm = ({ hideForm }) => {
  const [username, setUsername] = useState('');

  const { addNewUser } = useUsers();

  function handleSubmit(e) {
    e.preventDefault();
    addNewUser(username);
    hideForm();
  }

  return (
    <div className="box">
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="add-user__column-1">
            <h3 className="heading add-user__heading">Add a new user</h3>
            <p className="value add-user__value">
              Enter a name in the input field for your new user.
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
