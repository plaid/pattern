import React, { useEffect, useState } from 'react';
import Callout from 'plaid-threads/Callout';
import Button from 'plaid-threads/Button';
import Note from 'plaid-threads/Note';
import { Institution } from 'plaid/dist/api';

import { LinkButton, UpdateLink } from '.';
import { useItems, useLink, useInstitutions, useAccounts } from '../services';
import { UserType, ItemType } from './types';
import { setItemToBadState } from '../services/api';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';
const IS_PROCESSOR = process.env.REACT_APP_IS_PROCESSOR;

interface Props {
  user: UserType;
  removeButton: boolean;
  linkButton: boolean;
  userId: number;
  numOfItems: number;
  accountName: string;
  item: ItemType | null;
  isIdentityChecked: boolean;
}

export default function Item(props: Props) {
  const [numOfItems, setNumOfItems] = useState(0);
  const [token, setToken] = useState<string | null>('');
  const [institution, setInstitution] = useState<Institution | null>(null);

  const { itemsByUser, getItemsByUser, deleteItemById } = useItems();
  const { deleteAccountsByItemId } = useAccounts();
  const { institutionsById, getInstitutionById } = useInstitutions();
  const { generateLinkToken, linkTokens, deleteLinkToken } = useLink();
  const status = props.item != null ? props.item.status : 'good';
  const isSandbox = PLAID_ENV === 'sandbox';
  const isGoodState = status === 'good';
  const isAuth = IS_PROCESSOR === 'true' ? false : true;
  const isIdentity = props.user.should_verify_identity;
  const id = props.item != null ? props.item.id : 0;
  const plaid_institution_id =
    props.item != null ? props.item.plaid_institution_id : null;

  const initiateLink = async () => {
    // only generate a link token upon a click from enduser to add a bank;
    // if done earlier, it may expire before enuser actually activates Link to add a bank.
    await generateLinkToken(props.userId, null, isIdentity);
  };

  const handleSetBadState = () => {
    setItemToBadState(id);
  };
  const handleDeleteItem = () => {
    deleteItemById(id, props.userId);
    deleteAccountsByItemId(id);
    deleteLinkToken(props.userId);
  };
  // update data store with the user's items
  useEffect(() => {
    getItemsByUser(props.userId, true);
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
    if (numOfItems === 0) {
      setToken(linkTokens.byUser[props.userId]);
    } else {
      setToken(null);
    }
  }, [linkTokens, props.userId, numOfItems]);

  useEffect(() => {
    if (plaid_institution_id != null) {
      setInstitution(institutionsById[plaid_institution_id] || {});
    }
  }, [institutionsById, plaid_institution_id]);

  useEffect(() => {
    if (plaid_institution_id != null) {
      getInstitutionById(plaid_institution_id);
    }
  }, [getInstitutionById, plaid_institution_id]);

  return (
    <>
      <div>
        {numOfItems !== 0 && (
          <>
            <h3 className="subheading">Linked Bank</h3>
            <div className="item-info">
              <div>
                <h3 className="heading">bank</h3>
                {institution != null && (
                  <p className="value">{institution.name}</p>
                )}
              </div>
              <div>
                <h3 className="heading">account</h3>
                <p className="value">{props.accountName}</p>
              </div>
              <div>
                <h3 className="heading"> login status</h3>
                <div className="update-mode__note">
                  {isGoodState ? (
                    <Note info solid>
                      Login Updated
                    </Note>
                  ) : (
                    <Note error solid>
                      Login Required
                    </Note>
                  )}
                </div>
              </div>
              <div>
                <h3 className="heading">actions</h3>
                <div className="actions-container">
                  {isSandbox && isGoodState && (
                    <Button
                      tertiary
                      small
                      centered
                      className="action__button"
                      inline
                      onClick={handleSetBadState}
                    >
                      Test Item Login Required
                    </Button>
                  )}
                  {isSandbox && !isGoodState && (
                    <UpdateLink
                      setBadStateShown={isSandbox && isGoodState}
                      handleDelete={handleDeleteItem}
                      handleSetBadState={handleSetBadState}
                      userId={props.userId}
                      itemId={id}
                    />
                  )}
                  <Button
                    small
                    inline
                    tertiary
                    className="action__button remove-bank"
                    centered
                    onClick={handleDeleteItem}
                  >
                    Remove Bank
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
        {numOfItems === 0 && (
          <Button
            large
            inline
            className="add-account__button"
            onClick={initiateLink}
          >
            Add a bank account
          </Button>
        )}
        {(props.removeButton || (props.linkButton && numOfItems === 0)) && (
          // Plaid React Link cannot be rendered without a link token
          <div className="item__button">
            {token != null && props.linkButton && (
              <LinkButton
                userId={props.userId}
                token={token}
                itemId={null}
                isAuth={isAuth}
                isIdentity={isIdentity}
              />
            )}
          </div>
        )}
      </div>
      <div className="item__callouts">
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
