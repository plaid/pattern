import React, { useEffect, useState } from 'react';
import Callout from 'plaid-threads/Callout';

import { LinkButton, ItemCard } from '.';
import { useItems, useLink } from '../services';
import { UserType, ItemType } from './types';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';

interface Props {
  user: UserType;
  removeButton: boolean;
  linkButton: boolean;
  userId: number;
  numOfItems: number;
  institutionName: string;
  accountName: string;
  item: ItemType;
  isIdentityChecked: boolean;
}

export default function UserCard(props: Props) {
  const [numOfItems, setNumOfItems] = useState(0);
  const [token, setToken] = useState('');
  const { itemsByUser, getItemsByUser } = useItems();
  const { generateLinkToken, linkTokens } = useLink();
  const status = props.item != null ? props.item.status : 'good';
  const isSandbox = PLAID_ENV === 'sandbox';
  const isGoodState = status === 'good';

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

  const userClassName =
    numOfItems === 0 ? 'card user-card' : 'card user-card__no-link';
  return (
    <>
      <div className="box user-card__box">
        <div className={userClassName}>
          <div className="user-card__info">
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
          </div>
          {(props.removeButton || (props.linkButton && numOfItems === 0)) && (
            <div className="user-card__button">
              {token != null && token.length > 0 && props.linkButton && (
                <LinkButton userId={props.userId} token={token} itemId={null}>
                  Add your checking or savings account
                </LinkButton>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="user-card__callouts">
        {isSandbox && !isGoodState && (
          <Callout warning>
            Please update your login credentials at your bank
          </Callout>
        )}
        {linkTokens.error.error_code != null && (
          <Callout warning>
            <div>
              Unable to fetch link_token: please make sure your backend server
              is running and that your .env file has been configured correctly.
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
      </div>
    </>
  );
}
