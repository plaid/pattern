import React, { useEffect, useState } from 'react';
import Note from 'plaid-threads/Note';
import Button from 'plaid-threads/Button';
import { Institution } from 'plaid/dist/api';

import { ItemType } from './types';
import { UpdateLink } from '.';
import { useAccounts, useInstitutions, useItems, useLink } from '../services';
import { setItemToBadState } from '../services/api';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';

interface Props {
  item: ItemType;
  userId: number;
  isIdentityChecked: boolean;
  numOfItems: number;
  accountName: string;
}

const ItemCard = (props: Props) => {
  const [institution, setInstitution] = useState<Institution>({
    logo: '',
    name: '',
    institution_id: '',
    oauth: false,
    products: [],
    country_codes: [],
  });

  const { deleteAccountsByItemId } = useAccounts();
  const { deleteItemById } = useItems();
  const { institutionsById, getInstitutionById } = useInstitutions();
  const { id, plaid_institution_id, status } = props.item;
  const isSandbox = PLAID_ENV === 'sandbox';
  const isGoodState = status === 'good';
  const { deleteLinkToken } = useLink();

  useEffect(() => {
    setInstitution(institutionsById[plaid_institution_id] || {});
  }, [institutionsById, plaid_institution_id]);

  useEffect(() => {
    getInstitutionById(plaid_institution_id);
  }, [getInstitutionById, plaid_institution_id]);

  const handleSetBadState = () => {
    setItemToBadState(id);
  };
  const handleDeleteItem = () => {
    deleteItemById(id, props.userId);
    deleteAccountsByItemId(id);
    deleteLinkToken(props.userId);
  };

  return (
    <>
      <div>
        <h3 className="heading">bank</h3>
        <p className="value">{institution.name}</p>
      </div>
      <div>
        <h3 className="heading">account</h3>
        <p className="value">{props.accountName}</p>
      </div>
      {props.numOfItems !== 0 && (
        <>
          <div className="test-update-mode">
            <div>
              {isGoodState ? (
                <Note info solid>
                  Login
                  <br />
                  Updated
                </Note>
              ) : (
                <Note error solid>
                  Login <br /> Required
                </Note>
              )}
            </div>
            {isSandbox && isGoodState && (
              <Button
                tertiary
                small
                centered
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
          </div>

          <Button small inline secondary centered onClick={handleDeleteItem}>
            Remove Bank
          </Button>
        </>
      )}
    </>
  );
};

export default ItemCard;
