import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useReducer,
  useCallback,
  Dispatch,
} from 'react';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import omitBy from 'lodash/omitBy';

import { ItemType } from '../components/types';

import {
  getItemsByUser as apiGetItemsByUser,
  getItemById as apiGetItemById,
  deleteItemById as apiDeleteItemById,
} from './api';

interface ItemsState {
  [itemId: number]: ItemType;
}

const initialState: ItemsState = {};
type ItemsAction =
  | {
      type: 'SUCCESSFUL_REQUEST';
      payload: ItemType[];
    }
  | { type: 'SUCCESSFUL_DELETE'; payload: number }
  | { type: 'DELETE_BY_USER'; payload: number };

interface ItemsContextShape extends ItemsState {
  dispatch: Dispatch<ItemsAction>;
  deleteItemById: (id: number, userId: number) => void;
  getItemsByUser: (userId: number, refresh: boolean) => void;
  getItemById: (id: number, refresh: boolean) => void;
  itemsById: { [itemId: number]: ItemType[] };
  itemsByUser: { [userId: number]: ItemType[] };
  deleteItemsByUserId: (userId: number) => void;
}
const ItemsContext = createContext<ItemsContextShape>(
  initialState as ItemsContextShape
);

/**
 * @desc Maintains the Items context state and provides functions to update that state.
 */
export function ItemsProvider(props: any) {
  const [itemsById, dispatch] = useReducer(reducer, {});
  const hasRequested = useRef<{ byId: { [id: number]: boolean } }>({
    byId: {},
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
      dispatch({ type: 'SUCCESSFUL_REQUEST', payload: payload });
    }
  }, []);

  /**
   * @desc Requests all Items that belong to an individual User.
   */
  const getItemsByUser = useCallback(async userId => {
    const { data: payload } = await apiGetItemsByUser(userId);
    dispatch({ type: 'SUCCESSFUL_REQUEST', payload: payload });
  }, []);

  /**
   * @desc Will deletes Item by itemId.
   */
  const deleteItemById = useCallback(
    async (id, userId) => {
      await apiDeleteItemById(id);
      dispatch({ type: 'SUCCESSFUL_DELETE', payload: id });
      // Update items list after deletion.
      await getItemsByUser(userId);

      delete hasRequested.current.byId[id];
    },
    [getItemsByUser]
  );

  /**
   * @desc Will delete all items that belong to an individual User.
   * There is no api request as apiDeleteItemById in items delete all related transactions
   */
  const deleteItemsByUserId = useCallback(userId => {
    dispatch({ type: 'DELETE_BY_USER', payload: userId });
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
function reducer(state: ItemsState, action: ItemsAction) {
  switch (action.type) {
    case 'SUCCESSFUL_REQUEST':
      if (!action.payload.length) {
        return state;
      }

      return { ...state, ...keyBy(action.payload, 'id') };
    case 'SUCCESSFUL_DELETE':
      return omit(state, [action.payload]);
    case 'DELETE_BY_USER':
      return omitBy(state, items => items.user_id === action.payload);
    default:
      console.warn('unknown action');
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
