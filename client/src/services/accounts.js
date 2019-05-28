import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useReducer,
  useCallback,
} from 'react';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';

import {
  getAccountsByItem as apiGetAccountsByItem,
  getAccountsByUser as apiGetAccountsByUser,
} from './api';

const AccountsContext = createContext();

/**
 * @desc Enumerated action types
 */
const types = {
  SUCCESSFUL_GET: 0,
  // FAILED_GET: 1,
  DELETE_BY_ITEM: 2,
  DELETE_BY_USER: 3,
  // SUCCESSFUL_DELETE: 4,
  // FAILED_DELETE: 5,
};

/**
 * @desc Maintains the Accounts context state and provides functions to update that state.
 */
export function AccountsProvider(props) {
  const [accountsById, dispatch] = useReducer(reducer, {});

  const hasRequested = useRef({
    byId: {},
    byItem: {},
    byUser: {},
  });

  /**
   * @desc Requests all Accounts that belong to an individual Item.
   * The api request will be bypassed if the data has already been fetched.
   * A 'refresh' parameter can force a request for new data even if local state exists.
   */
  const getAccountsByItem = useCallback(async (itemId, refresh) => {
    if (!hasRequested.current.byItem[itemId] || refresh) {
      hasRequested.current.byItem[itemId] = true;
      const { data: payload } = await apiGetAccountsByItem(itemId);
      dispatch([types.SUCCESSFUL_GET, payload]);
    }
  }, []);

  /**
   * @desc Requests all Accounts that belong to an individual User.
   * The api request will be bypassed if the data has already been fetched.
   * A 'refresh' parameter can force a request for new data even if local state exists.
   */
  const getAccountsByUser = useCallback(async (userId, refresh) => {
    if (!hasRequested.current.byUser[userId] || refresh) {
      hasRequested.current.byUser[userId] = true;
      const { data: payload } = await apiGetAccountsByUser(userId);
      dispatch([types.SUCCESSFUL_GET, payload]);
    }
  }, []);

  /**
   * @desc Will delete all accounts that belong to an individual Item.
   * There is no api request as apiDeleteItemById in items delete all related transactions
   */
  const deleteAccountsByItemId = useCallback(itemId => {
    dispatch([types.DELETE_BY_ITEM, itemId]);
  }, []);

  /**
   * @desc Will delete all accounts that belong to an individual User.
   * There is no api request as apiDeleteItemById in items delete all related transactions
   */
  const deleteAccountsByUserId = useCallback(userId => {
    dispatch([types.DELETE_BY_USER, userId]);
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
}

/**
 * @desc Handles updates to the Accounts state as dictated by dispatched actions.
 */
function reducer(state, [type, payload]) {
  switch (type) {
    case types.SUCCESSFUL_GET:
      if (!payload.length) {
        return state;
      }
      return {
        ...state,
        ...keyBy(payload, 'id'),
      };
    case types.DELETE_BY_ITEM:
      return omitBy(state, transaction => transaction.item_id === payload);
    case types.DELETE_BY_USER:
      return omitBy(state, transaction => transaction.user_id === payload);
    default:
      console.warn('unknown action: ', { type, payload });
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
