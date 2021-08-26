import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import Button from 'plaid-threads/Button';
import Touchable from 'plaid-threads/Touchable';
import Callout from 'plaid-threads/Callout';

import { LinkButton, ItemCard } from '.';
import { useItems, useUsers, useLink } from '../services';
import { UserType, ItemType } from './types';
import { currencyFilter } from '../util';

interface Props {
  user: UserType;
  removeButton: boolean;
  linkButton: boolean;
  userId: number;
  numOfItems: number;
  institutionName: string;
  accountName: string;
  accountBalance: string;
  item: ItemType;
  isIdentityChecked: boolean;
}

export default function UserCard(props: Props) {
  const [numOfItems, setNumOfItems] = useState(0);
  const [token, setToken] = useState('');
  const { itemsByUser, getItemsByUser } = useItems();
  const { deleteUserById } = useUsers();
  const { generateLinkToken, linkTokens } = useLink();

  // update data store with the user's items
  useEffect(() => {
    if (props.userId) {
      getItemsByUser(props.userId, true);
    }
  }, [getItemsByUser, props.userId]);

  // update no of items from data store
  useEffect(() => {
    if (itemsByUser[props.userId] != null) {
      setNumOfItems(itemsByUser[props.userId].length);
    } else {
      setNumOfItems(0);
    }
  }, [itemsByUser, props.userId]);

  // creates new link token upon change in user or number of items
  useEffect(() => {
    generateLinkToken(props.userId, null); // itemId is null
  }, [props.userId, generateLinkToken]);

  useEffect(() => {
    setToken(linkTokens.byUser[props.userId]);
  }, [linkTokens, props.userId, numOfItems]);

  const handleDeleteUser = () => {
    deleteUserById(props.user.id); // this will delete all items associated with a user
  };

  const userClassName =
    numOfItems === 0 ? 'card user-card' : 'card user-card-no-link';
  return (
    <>
      <div className="box user-card__box">
        <div className={userClassName}>
          <div>
            <Touchable
              className="user-card-info"
              component={HashLink}
              to={`/user/${props.userId}`}
            >
              <div>
                <h3 className="heading">username</h3>
                <p className="value">{props.user.username}</p>
              </div>
              {numOfItems !== 0 && (
                <ItemCard
                  item={props.item}
                  isIdentityChecked={props.isIdentityChecked}
                  userId={props.userId}
                  accountName={props.accountName}
                  numOfItems={props.numOfItems}
                />
              )}
            </Touchable>
          </div>
          {(props.removeButton || (props.linkButton && numOfItems === 0)) && (
            <div className="user-card__button">
              {token != null && token.length > 0 && props.linkButton && (
                <LinkButton userId={props.userId} token={token} itemId={null}>
                  Add your checking or savings account
                </LinkButton>
              )}
              {props.removeButton && (
                <Button
                  className="remove"
                  onClick={handleDeleteUser}
                  small
                  inline
                  centered
                  secondary
                >
                  Delete user
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {linkTokens.error.error_code != null && (
        <Callout warning>
          <div>
            Unable to fetch link_token: please make sure your backend server is
            running and that your .env file has been configured correctly.
          </div>
          <div>
            Error Code: <code>{linkTokens.error.error_code}</code>
          </div>
          <div>
            Error Type: <code>{linkTokens.error.error_type}</code>{' '}
          </div>
          <div>Error Message: {linkTokens.error.error_message}</div>
        </Callout>
      )}
    </>
  );
}
