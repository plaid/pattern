import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useReducer,
  useCallback,
} from 'react';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import { toast } from 'react-toastify';

import { useAccounts, useItems, useTransactions } from '.';
import {
  getUsers as apiGetUsers,
  getUserById as apiGetUserById,
  addNewUser as apiAddNewUser,
  deleteUserById as apiDeleteUserById,
} from './api';

const UsersContext = createContext();

/**
 * @desc Enumerated action types
 */
const types = {
  SUCCESSFUL_GET: 0,
  // FAILED_GET: 1,
  // DELETE_BY_ID: 2,
  SUCCESSFUL_DELETE: 3,
  // FAILED_DELETE: 4,
};

/**
 * @desc Maintains the Users context state and provides functions to update that state.
 */
export function UsersProvider(props) {
  const [usersById, dispatch] = useReducer(reducer, {});
  const { deleteAccountsByUserId } = useAccounts();
  const { deleteItemsByUserId } = useItems();
  const { deleteTransactionsByUserId } = useTransactions();

  const hasRequested = useRef({
    all: false,
    byId: {},
  });

  /**
   * @desc Creates a new user
   */
  const addNewUser = useCallback(async username => {
    try {
      const { data: payload } = await apiAddNewUser(username);
      dispatch([types.SUCCESSFUL_GET, payload]);
    } catch (err) {
      const { response } = err;
      if (response && response.status === 409) {
        toast.error(`Username ${username} already exists`);
      } else {
        toast.error('Error adding new user');
      }
    }
  }, []);

  /**
   * @desc Requests all Users.
   * The api request will be bypassed if the data has already been fetched.
   * A 'refresh' parameter can force a request for new data even if local state exists.
   */
  const getUsers = useCallback(async refresh => {
    if (!hasRequested.current.all || refresh) {
      hasRequested.current.all = true;
      const { data: payload } = await apiGetUsers();
      dispatch([types.SUCCESSFUL_GET, payload]);
    }
  }, []);

  /**
   * @desc Requests details for a single User.
   * The api request will be bypassed if the data has already been fetched.
   * A 'refresh' parameter can force a request for new data even if local state exists.
   */
  const getUserById = useCallback(async (id, refresh) => {
    if (!hasRequested.current.byId[id] || refresh) {
      hasRequested.current.byId[id] = true;
      const { data: payload } = await apiGetUserById(id);
      dispatch([types.SUCCESSFUL_GET, payload]);
    }
  }, []);

  /**
   * @desc Will delete User by userId.
   */
  const deleteUserById = useCallback(
    async id => {
      await apiDeleteUserById(id);
      deleteItemsByUserId(id);
      deleteAccountsByUserId(id);
      deleteTransactionsByUserId(id);
      dispatch([types.SUCCESSFUL_DELETE, id]);
      delete hasRequested.current.byId[id];
    },
    [deleteItemsByUserId, deleteAccountsByUserId, deleteTransactionsByUserId]
  );

  /**
   * @desc Builds a more accessible state shape from the Users data. useMemo will prevent
   * these from being rebuilt on every render unless usersById is updated in the reducer.
   */
  const value = useMemo(() => {
    const allUsers = Object.values(usersById);
    return {
      allUsers,
      usersById,
      getUsers,
      getUserById,
      getUsersById: getUserById,
      addNewUser,
      deleteUserById,
    };
  }, [usersById, getUsers, getUserById, addNewUser, deleteUserById]);

  return <UsersContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Users state as dictated by dispatched actions.
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
    case types.SUCCESSFUL_DELETE:
      return omit(state, [payload]);
    default:
      console.warn('unknown action: ', { type, payload });
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Users context state in components.
 */
export default function useUsers() {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error(`useUsers must be used within a UsersProvider`);
  }

  return context;
}
