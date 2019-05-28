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
import omit from 'lodash/omit';
import omitBy from 'lodash/omitBy';

import {
  getItemsByUser as apiGetItemsByUser,
  getItemById as apiGetItemById,
  deleteItemById as apiDeleteItemById,
} from './api';

const ItemsContext = createContext();

/**
 * @desc Enumerated action types
 */
const types = {
  SUCCESSFUL_GET: 0,
  // FAILED_GET: 1,
  // DELETE_BY_ID: 2,
  DELETE_BY_USER: 3,
  SUCCESSFUL_DELETE: 4,
  // FAILED_DELETE: 5,
};

/**
 * @desc Maintains the Items context state and provides functions to update that state.
 */
export function ItemsProvider(props) {
  const [itemsById, dispatch] = useReducer(reducer, {});

  const hasRequested = useRef({
    byId: {},
    byUser: {},
  });

  /**
   * @desc Requests details for a single Item.
   * The api request will be bypassed if the data has already been fetched.
   * A 'refresh' parameter can force a request for new data even if local state exists.
   */
  const getItemById = useCallback(async (id, refresh) => {
    if (!hasRequested.current.byId[id] || refresh) {
      hasRequested.current.byId[id] = true;
      const { data: payload } = await apiGetItemById(id);
      dispatch([types.SUCCESSFUL_REQUEST, payload]);
    }
  }, []);

  /**
   * @desc Requests all Items that belong to an individual User.
   */
  const getItemsByUser = useCallback(async (userId, refresh) => {
    if (!hasRequested.current.byUser[userId] || refresh) {
      hasRequested.current.byUser[userId] = true;
      const { data: payload } = await apiGetItemsByUser(userId);
      dispatch([types.SUCCESSFUL_REQUEST, payload]);
    }
  }, []);

  /**
   * @desc Will deletes Item by itemId.
   * The api request will be bypassed if the data has already been fetched.
   * A 'refresh' parameter can force a request for new data even if local state exists.
   */
  const deleteItemById = useCallback(async id => {
    await apiDeleteItemById(id);
    dispatch([types.SUCCESSFUL_DELETE, id]);
    delete hasRequested.current.byId[id];
  }, []);

  /**
   * @desc Will delete all items that belong to an individual User.
   * There is no api request as apiDeleteItemById in items delete all related transactions
   */
  const deleteItemsByUserId = useCallback(userId => {
    dispatch([types.DELETE_BY_USER, userId]);
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Items data. useMemo will prevent
   * these from being rebuilt on every render unless itemsById is updated in the reducer.
   */
  const value = useMemo(() => {
    const allItems = Object.values(itemsById);

    return {
      allItems,
      itemsById,
      itemsByUser: groupBy(allItems, 'user_id'),
      getItemById,
      getItemsByUser,
      deleteItemById,
      deleteItemsByUserId,
    };
  }, [
    itemsById,
    getItemById,
    getItemsByUser,
    deleteItemById,
    deleteItemsByUserId,
  ]);

  return <ItemsContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Items state as dictated by dispatched actions.
 */
function reducer(state, [type, payload]) {
  switch (type) {
    case types.SUCCESSFUL_REQUEST:
      if (!payload.length) {
        return state;
      }

      return { ...state, ...keyBy(payload, 'id') };
    case types.SUCCESSFUL_DELETE:
      return omit(state, [payload]);
    case types.DELETE_BY_USER:
      return omitBy(state, items => items.user_id === payload);
    default:
      console.warn('unknown action: ', { type, payload });
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Items context state in components.
 */
export default function useItems() {
  const context = useContext(ItemsContext);

  if (!context) {
    throw new Error(`useItems must be used within an ItemsProvider`);
  }

  return context;
}
