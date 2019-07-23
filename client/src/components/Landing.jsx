import React, { useEffect } from 'react';

import { useUsers } from '../services';
import Banner from './Banner';
import UserList from './UserList';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV;

export default function Landing({ users }) {
  const { getUsers } = useUsers();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div>
      <Banner initialSubheading />
      <div className="bottom-border-content">
        <div className="landing__column">
          <h3 className="heading">STEP 1</h3>
          <p className="value landing__value">
            Add a user, and click the "Link an Item" button below to connect{' '}
            <a
              href="https://plaid.com/docs/quickstart/#item-overview"
              target="_blank"
              rel="noopener noreferrer"
            >
              Items
            </a>{' '}
            from the user.
          </p>
        </div>
        <div className="landing__column">
          <h3 className="heading">STEP 2</h3>
          <p className="value landing__value">
            <span>
              {`Select an institution to add accounts.
              Given you are in ${PLAID_ENV} mode, `}
            </span>
            {PLAID_ENV === 'sandbox' ? (
              <span>
                <a
                  href="https://plaid.com/docs/#test-credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  test credentials
                </a>{' '}
                are provided within Link after selecting an institution.
              </span>
            ) : (
              <span>test using live credentials</span>
            )}
          </p>
        </div>
        <div className="landing__column">
          <h3 className="heading">STEP 3</h3>
          <p className="value landing__value">
            Upon completion, a public_token will be passed to the server and
            exchanged for an access_token to get{' '}
            <a
              href="https://plaid.com/docs/#accounts"
              target="_blank"
              rel="noopener noreferrer"
            >
              account
            </a>{' '}
            and{' '}
            <a
              href="https://plaid.com/docs/quickstart/#transaction-data"
              target="_blank"
              rel="noopener noreferrer"
            >
              transaction
            </a>
            &nbsp;details
          </p>
        </div>
      </div>
      <UserList users={users} />
    </div>
  );
}
