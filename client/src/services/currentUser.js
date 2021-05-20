import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from 'react';
import { toast } from 'react-toastify';

import { login as apiLogin } from './api';

const CurrentUserContext = createContext();

/**
 * @desc Enumerated action types
 */
const types = {
  SUCCESSFUL_GET: 0,
  FAILED_GET: 1,
  ADD_USER: 2,
  REMOVE_CURRENT_USER: 3,
};

/**
 * @desc Maintains the currentUser context state
 */
export function CurrentUserProvider(props) {
  const [userState, dispatch] = useReducer(reducer, {
    currentUser: {},
    newUser: null,
  });

  /**
   * @desc Requests details for a single User.
   */
  const login = useCallback(async (username, refresh) => {
    try {
      const { data: payload } = await apiLogin(username);
      if (payload != null) {
        toast.success(`Successful login.  Welcome back ${username}`);
        dispatch([types.SUCCESSFUL_GET, payload]);
      } else {
        toast.error(`Username ${username} is invalid.  Try again. `);
        dispatch([types.FAILED_GET]);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const setCurrentUser = useCallback(async username => {
    try {
      const { data: payload } = await apiLogin(username);
      if (payload != null) {
        dispatch([types.SUCCESSFUL_GET, payload]);
      } else {
        dispatch([types.FAILED_GET]);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const newUser = useCallback(async username => {
    dispatch([types.ADD_USER, username]);
  }, []);

  const removeCurrentUser = useCallback(async userId => {
    if (userState.currentUser.id === userId) {
      dispatch([types.REMOVE_CURRENT_USER]);
    }
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Users data. useMemo will prevent
   * these from being rebuilt on every render unless usersById is updated in the reducer.
   */
  const value = useMemo(() => {
    return {
      userState,
      login,
      setCurrentUser,
      newUser,
      removeCurrentUser,
    };
  }, [userState, login, setCurrentUser, removeCurrentUser, newUser]);

  return <CurrentUserContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Users state as dictated by dispatched actions.
 */
function reducer(state, [type, payload]) {
  switch (type) {
    case types.SUCCESSFUL_GET:
      return {
        currentUser: payload[0],
        newUser: null,
      };
    case types.FAILED_GET:
      return {
        ...state,
        newUser: null,
      };
    case types.ADD_USER:
      return {
        ...state,
        newUser: payload,
      };
    case types.REMOVE_CURRENT_USER:
      return {
        ...state,
        currentUser: {},
      };

    default:
      console.warn('unknown action: ', { type, payload });
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Users context state in components.
 */
export default function useCurrentUser() {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error(`useUsers must be used within a UsersProvider`);
  }

  return context;
}
