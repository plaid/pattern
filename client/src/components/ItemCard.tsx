import React, { useEffect, useState, useCallback } from 'react';
import Note from 'plaid-threads/Note';
import Touchable from 'plaid-threads/Touchable';
import { Institution } from 'plaid/dist/api';

import { ItemType, AccountType, AppFundType } from './types';
import { AccountCard, MoreDetails } from '.';
import { useAccounts, useInstitutions, useItems } from '../services';
import { setItemToBadState, getBalanceByItem } from '../services/api';
import { diffBetweenCurrentTime } from '../util';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';

interface Props {
  item: ItemType;
  userId: number;
  isIdentityChecked: boolean;
  updateAppFund: (appFund: AppFundType) => void;
  closeView: () => void;
}

const ItemCard = (props: Props) => {
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [institution, setInstitution] = useState<Institution>({
    logo: '',
    name: '',
    institution_id: '',
    oauth: false,
    products: [],
    country_codes: [],
  });

  const {
    deleteAccountsByItemId,
    accountsByItem,
    getAccountsByItem,
  } = useAccounts();
  const { deleteItemById } = useItems();
  const {
    institutionsById,
    getInstitutionById,
    formatLogoSrc,
  } = useInstitutions();
  const { id, plaid_institution_id, status } = props.item;
  const isSandbox = PLAID_ENV === 'sandbox';
  const isGoodState = status === 'good';

  useEffect(() => {
    getAccountsByItem(id);
  }, [getAccountsByItem, id]);

  useEffect(() => {
    const itemAccounts: AccountType[] = accountsByItem[id];
    setAccounts(itemAccounts || []);
  }, [accountsByItem, id]);

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
  };

  return (
    <div className="box">
      <div className="card item-card item-card_clickable">
        <div className="item-card__column-1 ">
          <img
            className="item-card__img"
            src={formatLogoSrc(institution.logo)}
            alt={institution && institution.name}
          />
          <p>{institution && institution.name}</p>
        </div>
        <div className="item-card__column-2">
          {props.isIdentityChecked ? (
            <Note info solid>
              identification <br />
              verified
            </Note>
          ) : (
            <Note error solid>
              identification <br />
              not verified
            </Note>
          )}
        </div>
        <div className="item-card__column-3">
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

        <MoreDetails // The MoreDetails component allows developer to test the ITEM_LOGIN_REQUIRED webhook and Link update mode
          setBadStateShown={isSandbox && isGoodState}
          handleDelete={handleDeleteItem}
          handleSetBadState={handleSetBadState}
          userId={props.userId}
          itemId={id}
        />
      </div>

      <div className="accounts">
        {accounts.map(account => (
          <div key={account.id}>
            <AccountCard
              account={account}
              userId={props.userId}
              updateAppFund={props.updateAppFund}
              closeView={props.closeView}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemCard;
