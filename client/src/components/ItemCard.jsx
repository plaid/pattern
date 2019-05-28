import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { AccountCard, MoreDetails } from '.';
import {
  useAccounts,
  useInstitutions,
  useItems,
  useTransactions,
} from '../services';
import { setItemToBadState } from '../services/api';
import { diffBetweenCurrentTime } from '../util';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';
const propTypes = {
  item: PropTypes.object.isRequired,
};

const ItemCard = ({ item, userId }) => {
  const [accounts, setAccounts] = useState([]);
  const [institution, setInstitution] = useState({});
  const [showAccounts, setShowAccounts] = useState(false);

  const { accountsByItem, deleteAccountsByItemId } = useAccounts();
  const { deleteItemById } = useItems();
  const { deleteTransactionsByItemId } = useTransactions();
  const {
    institutionsById,
    getInstitutionById,
    formatLogoSrc,
  } = useInstitutions();

  const { id, plaid_institution_id, plaid_item_id, status } = item;
  const isSandbox = PLAID_ENV === 'sandbox';
  const isGoodState = status === 'good';

  useEffect(() => {
    setAccounts(accountsByItem[id] || []);
  }, [accountsByItem, id]);

  useEffect(() => {
    setInstitution(institutionsById[plaid_institution_id] || {});
  }, [institutionsById, plaid_institution_id]);

  useEffect(() => {
    getInstitutionById(plaid_institution_id);
  }, [getInstitutionById, plaid_institution_id]);

  const handleSetBadState = () => setItemToBadState(id);
  const handleDeleteItem = () => {
    deleteItemById(id);
    deleteAccountsByItemId(id);
    deleteTransactionsByItemId(id);
  };

  return (
    <div className="box">
      <div className="card item-card">
        <div
          className="item-card__clickable"
          onClick={() => setShowAccounts(current => !current)}
        >
          <div className="item-card__column-1 bank-name">
            <img
              className="item-card__img"
              src={formatLogoSrc(institution.logo)}
              alt={institution && institution.name}
            />
            <p>{institution && institution.name}</p>
          </div>
          <div className="item-card__column-1">
            {isGoodState ? (
              <div className="item-card__status">Updated</div>
            ) : (
              <div className="item-card__status bad">Login Required</div>
            )}
          </div>
          <div className="item-card__column">
            <h3 className="heading">ITEM_ID</h3>
            <p className="value">{plaid_item_id}</p>
          </div>
          <div className="item-card__column-2">
            <h3 className="heading">LAST_UPDATED</h3>
            <p className="value">{diffBetweenCurrentTime(item.updated_at)}</p>
          </div>
        </div>
        <MoreDetails
          updateShown={!isGoodState}
          setBadStateShown={isSandbox && isGoodState}
          handleDelete={handleDeleteItem}
          handleSetBadState={handleSetBadState}
          userId={userId}
          itemId={id}
        />
      </div>
      {showAccounts && (
        <div>
          {accounts.map(account => (
            <div key={account.id}>
              <AccountCard account={account} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ItemCard.propTypes = propTypes;

export default ItemCard;
