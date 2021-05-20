import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from 'react';
import keyBy from 'lodash/keyBy';

import { login as apiLogin } from './api';

const CurrentUserContext = createContext();

/**
 * @desc Enumerated action types
 */
const types = {
  SUCCESSFUL_GET: 0,
  FAILED_GET: 1,
  // DELETE_BY_ID: 2,
  // SUCCESSFUL_DELETE: 3,
  // FAILED_DELETE: 4,
  BANNER_DISMISS: 5,
};

/**
 * @desc Maintains the currentUser context state
 */
export function CurrentUserProvider(props) {
  const [userState, dispatch] = useReducer(reducer, {
    currentUser: {},
    banner: {
      text: '',
      title: '',
      show: false,
    },
  });

  /**
   * @desc Requests details for a single User.
   */
  const login = useCallback(async (username, refresh) => {
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

  const dismissBanner = useCallback(async () => {
    dispatch([types.BANNER_DISMISS]);
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Users data. useMemo will prevent
   * these from being rebuilt on every render unless usersById is updated in the reducer.
   */
  const value = useMemo(() => {
    return {
      userState,
      login,
      dismissBanner,
      setCurrentUser,
    };
  }, [userState, login, dismissBanner, setCurrentUser]);

  return <CurrentUserContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Users state as dictated by dispatched actions.
 */
function reducer(state, [type, payload]) {
  switch (type) {
    case types.SUCCESSFUL_GET:
      return {
        banner: {
          text: 'You have logged in successfully',
          title: 'Success!',
          show: true,
        },
        currentUser: payload[0],
      };
    case types.FAILED_GET:
      return {
        banner: {
          text: 'Try logging in again',
          title: 'Invalid Username',
          show: true,
          error: true,
        },
        currentUser: {},
      };
    case types.BANNER_DISMISS:
      return {
        ...state,
        banner: {
          text: 'Try logging in again',
          title: 'Invalid Username',
          show: false,
          error: true,
        },
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
