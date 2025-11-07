import React, { useEffect, useState } from 'react';
import Note from 'plaid-threads/Note';
import Touchable from 'plaid-threads/Touchable';
import { InlineLink } from 'plaid-threads/InlineLink';
import { Callout } from 'plaid-threads/Callout';
import Button from 'plaid-threads/Button';
import { Institution } from 'plaid/dist/api';
import { toast } from 'react-toastify';

import { ItemType, AccountType } from './types';
import AccountCard from './AccountCard.tsx';
import MoreDetails from './MoreDetails.tsx';

import {
  useAccounts,
  useInstitutions,
  useItems,
  useTransactions,
} from '../services';
import { setItemToBadState, refreshTransactionsByItem } from '../services/api.tsx';
import { diffBetweenCurrentTime } from '../util/index.tsx';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';

interface Props {
  item: ItemType;
  userId: number;
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
    routing_numbers: [],
  });
  const [showAccounts, setShowAccounts] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { accountsByItem } = useAccounts();
  const { deleteAccountsByItemId } = useAccounts();
  const { deleteItemById } = useItems();
  const { deleteTransactionsByItemId, getTransactionsByItem } = useTransactions();
  const {
    institutionsById,
    getInstitutionById,
    formatLogoSrc,
  } = useInstitutions();
  const { id, plaid_institution_id, status } = props.item;
  const isSandbox = PLAID_ENV === 'sandbox';
  const isGoodState = status === 'good';

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
    deleteTransactionsByItemId(id);
  };
  const handleRefreshTransactions = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent expanding/collapsing the card
    setIsRefreshing(true);
    try {
      const { data } = await refreshTransactionsByItem(id);

      // Check if any transactions were immediately available
      const totalChanges = data.addedCount + data.modifiedCount + data.removedCount;

      if (totalChanges > 0) {
        toast.success(
          `Transactions refreshed: ${data.addedCount} added, ${data.modifiedCount} modified, ${data.removedCount} removed`
        );
        await getTransactionsByItem(id);
      } else {
        // No immediate updates, but refresh was initiated
        toast.info(
          'Transaction refresh initiated. New transactions will appear shortly when the webhook fires.'
        );
      }
    } catch (err: any) {
      const errorData = err?.response?.data?.error;
      let errorMessage = 'Failed to refresh transactions.';

      if (errorData) {
        // Show detailed error information from Plaid API
        const details = [];
        if (errorData.code) details.push(`Error: ${errorData.code}`);
        if (errorData.type) details.push(`Type: ${errorData.type}`);
        if (errorData.display_message) details.push(errorData.display_message);
        else if (errorData.message) details.push(errorData.message);

        if (details.length > 0) {
          errorMessage = `Failed to refresh transactions. ${details.join(' | ')}`;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  };

  const cardClassNames = showAccounts
    ? 'card item-card expanded'
    : 'card item-card';
  return (
    <div className="box">
      <div className={cardClassNames}>
        <Touchable
          className="item-card__clickable"
          onClick={() => setShowAccounts(current => !current)}
        >
          <div className="item-card__column-1">
            <img
              className="item-card__img"
              src={formatLogoSrc(institution.logo)}
              alt={institution && institution.name}
            />
            <p>{institution && institution.name}</p>
          </div>
          <div className="item-card__column-2">
            {isGoodState ? (
              <Note info solid>
                Updated
              </Note>
            ) : (
              <Note error solid>
                Login Required
              </Note>
            )}
            <Button
              small
              secondary
              onClick={handleRefreshTransactions}
              disabled={isRefreshing}
              style={{ marginTop: '8px' }}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Transactions'}
            </Button>
          </div>
          <div className="item-card__column-3">
            <h3 className="heading">LAST UPDATED</h3>
            <p className="value">
              {diffBetweenCurrentTime(props.item.updated_at)}
            </p>
          </div>
        </Touchable>
        <MoreDetails // The MoreDetails component allows developer to test the ITEM_LOGIN_REQUIRED webhook and Link update mode
          setBadStateShown={isSandbox && isGoodState}
          handleDelete={handleDeleteItem}
          handleSetBadState={handleSetBadState}
          userId={props.userId}
          itemId={id}
        />
      </div>
      {showAccounts && accounts.length > 0 && (
        <div>
          {accounts.map(account => (
            <div key={account.id}>
              <AccountCard account={account} />
            </div>
          ))}
        </div>
      )}
      {showAccounts && accounts.length === 0 && (
        <Callout>
          No transactions or accounts have been retrieved for this item. See the{' '}
          <InlineLink href="https://github.com/plaid/pattern/blob/master/docs/troubleshooting.md">
            {' '}
            troubleshooting guide{' '}
          </InlineLink>{' '}
          to learn about receiving transactions webhooks with this sample app.
        </Callout>
      )}
    </div>
  );
};

export default ItemCard;
