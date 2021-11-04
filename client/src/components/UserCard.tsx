import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import Button from 'plaid-threads/Button';
import Touchable from 'plaid-threads/Touchable';

import { UserDetails, LaunchLink } from '.';
import { useItems, useUsers, useLink } from '../services';
import { UserType } from './types';

interface Props {
  user: UserType;
  removeButton: boolean;
  linkButton: boolean;
  userId: number;
}

export default function UserCard(props: Props) {
  const [numOfItems, setNumOfItems] = useState(0);
  const [token, setToken] = useState('');
  const [hovered, setHovered] = useState(false);
  const { itemsByUser, getItemsByUser } = useItems();
  const { deleteUserById } = useUsers();
  const { generateLinkToken, linkTokens } = useLink();

  const initiateLink = async () => {
    // only generate a link token upon a click from enduser to add a bank;
    // if done earlier, it may expire before enduser actually activates Link to add a bank.
    await generateLinkToken(props.userId, null);
  };

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

  useEffect(() => {
    setToken(linkTokens.byUser[props.userId]);
  }, [linkTokens, props.userId, numOfItems]);

  const handleDeleteUser = () => {
    deleteUserById(props.user.id); // this will delete all items associated with a user
  };
  return (
    <div className="box user-card__box">
      <div className=" card user-card">
        <div
          className="hoverable"
          onMouseEnter={() => {
            if (numOfItems > 0) {
              setHovered(true);
            }
          }}
          onMouseLeave={() => {
            setHovered(false);
          }}
        >
          <Touchable
            className="user-card-clickable"
            component={HashLink}
            to={`/user/${props.userId}#itemCards`}
          >
            <div className="user-card__detail">
              <UserDetails
                hovered={hovered}
                user={props.user}
                numOfItems={numOfItems}
              />
            </div>
          </Touchable>
        </div>
        {(props.removeButton || (props.linkButton && numOfItems === 0)) && (
          <div className="user-card__buttons">
            {props.linkButton && numOfItems === 0 && (
              <Button
                large
                inline
                className="add-account__button"
                onClick={initiateLink}
              >
                Add a bank
              </Button>
            )}
            {token != null &&
              token.length > 0 &&
              props.linkButton &&
              numOfItems === 0 && (
                <LaunchLink userId={props.userId} token={token} itemId={null} />
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
  );
}
