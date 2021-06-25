import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  Dispatch,
  ReactNode,
} from 'react';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import { AccountType } from '../components/types';

import {
  getAccountsByItem as apiGetAccountsByItem,
  getAccountsByUser as apiGetAccountsByUser,
} from './api';

interface AccountsState {
  [accountId: number]: AccountType;
}

const initialState: AccountsState = {};
type AccountsAction =
  | {
      type: 'SUCCESSFUL_GET';
      payload: AccountType[];
    }
  | { type: 'DELETE_BY_ITEM'; payload: number }
  | { type: 'DELETE_BY_USER'; payload: number };

interface AccountsContextShape extends AccountsState {
  dispatch: Dispatch<AccountsAction>;
  accountsByItem: { [itemId: number]: AccountType[] };
  deleteAccountsByItemId: (itemId: number) => void;
  getAccountsByUser: (userId: number) => void;
  accountsByUser: { [user_id: number]: AccountType[] };
  deleteAccountsByUserId: (userId: number) => void;
}
const AccountsContext = createContext<AccountsContextShape>(
  initialState as AccountsContextShape
);

/**
 * @desc Maintains the Accounts context state and provides functions to update that state.
 */
export const AccountsProvider: React.FC<{ children: ReactNode }> = (
  props: any
) => {
  const [accountsById, dispatch] = useReducer(reducer, initialState);

  /**
   * @desc Requests all Accounts that belong to an individual Item.
   */
  const getAccountsByItem = useCallback(async itemId => {
    const { data: payload } = await apiGetAccountsByItem(itemId);
    dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
  }, []);

  /**
   * @desc Requests all Accounts that belong to an individual User.
   */
  const getAccountsByUser = useCallback(async userId => {
    const { data: payload } = await apiGetAccountsByUser(userId);
    dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
  }, []);

  /**
   * @desc Will delete all accounts that belong to an individual Item.
   * There is no api request as apiDeleteItemById in items delete all related transactions
   */
  const deleteAccountsByItemId = useCallback(itemId => {
    dispatch({ type: 'DELETE_BY_ITEM', payload: itemId });
  }, []);

  /**
   * @desc Will delete all accounts that belong to an individual User.
   * There is no api request as apiDeleteItemById in items delete all related transactions
   */
  const deleteAccountsByUserId = useCallback(userId => {
    dispatch({ type: 'DELETE_BY_USER', payload: userId });
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Accounts data. useMemo will prevent
   * these from being rebuilt on every render unless accountsById is updated in the reducer.
   */
  const value = useMemo(() => {
    const allAccounts = Object.values(accountsById);

    return {
      allAccounts,
      accountsById,
      accountsByItem: groupBy(allAccounts, 'item_id'),
      accountsByUser: groupBy(allAccounts, 'user_id'),
      getAccountsByItem,
      getAccountsByUser,
      deleteAccountsByItemId,
      deleteAccountsByUserId,
    };
  }, [
    accountsById,
    getAccountsByItem,
    getAccountsByUser,
    deleteAccountsByItemId,
    deleteAccountsByUserId,
  ]);

  return <AccountsContext.Provider value={value} {...props} />;
};

/**
 * @desc Handles updates to the Accounts state as dictated by dispatched actions.
 */
function reducer(state: AccountsState, action: AccountsAction) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      if (!action.payload.length) {
        return state;
      }
      return {
        ...state,
        ...keyBy(action.payload, 'id'),
      };
    case 'DELETE_BY_ITEM':
      return omitBy(
        state,
        transaction => transaction.item_id === action.payload
      );
    case 'DELETE_BY_USER':
      return omitBy(
        state,
        transaction => transaction.user_id === action.payload
      );
    default:
      console.warn('unknown action');
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Accounts context state in components.
 */
export default function useAccounts() {
  const context = useContext(AccountsContext);

  if (!context) {
    throw new Error(`useAccounts must be used within an AccountsProvider`);
  }

  return context;
}
