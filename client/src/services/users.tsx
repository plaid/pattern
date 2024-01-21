import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useReducer,
  useCallback,
  Dispatch,
} from 'react';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import { toast } from 'react-toastify';

import { UserType } from '../components/types';
import { useAccounts, useItems, useTransactions } from '.';
import {
  getUsers as apiGetUsers,
  getUserById as apiGetUserById,
  addNewUser as apiAddNewUser,
  deleteUserById as apiDeleteUserById,
} from './api';

interface UsersState {
  [key: string]: UserType | any;
}

const initialState = {};
type UsersAction =
  | {
      type: 'SUCCESSFUL_GET';
      payload: UserType;
    }
  | { type: 'SUCCESSFUL_DELETE'; payload: number };

interface UsersContextShape extends UsersState {
  dispatch: Dispatch<UsersAction>;
}
const UsersContext = createContext<UsersContextShape>(
  initialState as UsersContextShape
);

/**
 * @desc Maintains the Users context state and provides functions to update that state.
 */
export function UsersProvider(props: any) {
  const [usersById, dispatch] = useReducer(reducer, {});
  const { deleteAccountsByUserId } = useAccounts();
  const { deleteItemsByUserId } = useItems();
  const { deleteTransactionsByUserId } = useTransactions();

  const hasRequested = useRef<{
    all: Boolean;
    byId: { [id: number]: boolean };
  }>({
    all: false,
    byId: {},
  });

  /**
   * @desc Creates a new user
   */
  const addNewUser = useCallback(async username => {
    try {
      const { data: payload } = await apiAddNewUser(username);
      dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as any).response;
        if (response && response.status === 409) {
          toast.error(`Username ${username} already exists`);
        } else {
          toast.error('Error adding new user');
        }
      } else {
        toast.error('An unknown error occurred');
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
      dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
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
      dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
    }
  }, []);

  /**
   * @desc Will delete User by userId.
   */
  const deleteUserById = useCallback(
    async id => {
      await apiDeleteUserById(id); // this will delete all items associated with user
      deleteItemsByUserId(id);
      deleteAccountsByUserId(id);
      deleteTransactionsByUserId(id);
      dispatch({ type: 'SUCCESSFUL_DELETE', payload: id });
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
function reducer(state: UsersState, action: UsersAction | any) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      if (!action.payload.length) {
        return state;
      }
      return {
        ...state,
        ...keyBy(action.payload, 'id'),
      };
    case 'SUCCESSFUL_DELETE':
      return omit(state, [action.payload]);
    default:
      console.warn('unknown action: ', action.type, action.payload);
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
