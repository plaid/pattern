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
  getTransactionsByAccount as apiGetTransactionsByAccount,
  getTransactionsByItem as apiGetTransactionsByItem,
  getTransactionsByUser as apiGetTransactionsByUser,
} from './api';

const TransactionsContext = createContext();

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
 * @desc Maintains the Transactions context state and provides functions to update that state.
 */
export function TransactionsProvider(props) {
  const [transactionsById, dispatch] = useReducer(reducer, {});

  const hasRequested = useRef({
    byAccount: {},
    byItem: {},
    byUser: {},
  });

  /**
   * @desc Requests all Transactions that belong to an individual Account.
   * The api request will be bypassed if the data has already been fetched.
   * A 'refresh' parameter can force a request for new data even if local state exists.
   */
  const getTransactionsByAccount = useCallback(async (accountId, refresh) => {
    if (!hasRequested.current.byAccount[accountId] || refresh) {
      hasRequested.current.byAccount[accountId] = true;
      const { data: payload } = await apiGetTransactionsByAccount(accountId);
      dispatch([types.SUCCESSFUL_GET, payload]);
    }
  }, []);

  /**
   * @desc Requests all Transactions that belong to an individual Item.
   * The api request will be bypassed if the data has already been fetched.
   * A 'refresh' parameter can force a request for new data even if local state exists.
   */
  const getTransactionsByItem = useCallback(async (itemId, refresh) => {
    if (!hasRequested.current.byItem[itemId] || refresh) {
      hasRequested.current.byItem[itemId] = true;
      const { data: payload } = await apiGetTransactionsByItem(itemId);
      dispatch([types.SUCCESSFUL_GET, payload]);
    }
  }, []);

  /**
   * @desc Requests all Transactions that belong to an individual User.
   * The api request will be bypassed if the data has already been fetched.
   * A 'refresh' parameter can force a request for new data even if local state exists.
   */
  const getTransactionsByUser = useCallback(async (userId, refresh) => {
    if (!hasRequested.current.byUser[userId] || refresh) {
      hasRequested.current.byUser[userId] = true;
      const { data: payload } = await apiGetTransactionsByUser(userId);
      dispatch([types.SUCCESSFUL_GET, payload]);
    }
  }, []);

  /**
   * @desc Will Delete all transactions that belong to an individual Item.
   * There is no api request as apiDeleteItemById in items delete all related transactions
   */
  const deleteTransactionsByItemId = useCallback(itemId => {
    dispatch([types.DELETE_BY_ITEM, itemId]);
  }, []);

  /**
   * @desc Will Delete all transactions that belong to an individual User.
   * There is no api request as apiDeleteItemById in items delete all related transactions
   */
  const deleteTransactionsByUserId = useCallback(userId => {
    dispatch([types.DELETE_BY_ITEM, userId]);
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Transactions data. useMemo will prevent
   * these from being rebuilt on every render unless transactionsById is updated in the reducer.
   */
  const value = useMemo(() => {
    const allTransactions = Object.values(transactionsById);

    return {
      allTransactions,
      transactionsById,
      transactionsByAccount: groupBy(allTransactions, 'account_id'),
      transactionsByItem: groupBy(allTransactions, 'item_id'),
      transactionsByUser: groupBy(allTransactions, 'user_id'),
      getTransactionsByAccount,
      getTransactionsByItem,
      getTransactionsByUser,
      deleteTransactionsByItemId,
      deleteTransactionsByUserId,
    };
  }, [
    transactionsById,
    getTransactionsByAccount,
    getTransactionsByItem,
    getTransactionsByUser,
    deleteTransactionsByItemId,
    deleteTransactionsByUserId,
  ]);

  return <TransactionsContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Transactions state as dictated by dispatched actions.
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
 * @desc A convenience hook to provide access to the Transactions context state in components.
 */
export default function useTransactions() {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error(
      `useTransactions must be used within a TransactionsProvider`
    );
  }

  return context;
}
