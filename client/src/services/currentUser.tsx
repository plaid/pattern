import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  Dispatch,
} from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { getLoginUser as apiGetLoginUser } from './api';
import { UserType } from '../components/types';

interface CurrentUserState {
  currentUser: UserType;
  newUser: string | null;
}

const initialState = {
  currentUser: {},
  newUser: null,
};
type CurrentUserAction =
  | {
      type: 'SUCCESSFUL_GET';
      payload: UserType;
    }
  | { type: 'ADD_USER'; payload: string }
  | { type: 'FAILED_GET' };

interface CurrentUserContextShape extends CurrentUserState {
  dispatch: Dispatch<CurrentUserAction>;
  setNewUser: (username: string) => void;
  userState: CurrentUserState;
  setCurrentUser: (username: string) => void;
  login: (username: string) => void;
}
const CurrentUserContext = createContext<CurrentUserContextShape>(
  initialState as CurrentUserContextShape
);

/**
 * @desc Maintains the currentUser context state and provides functions to update that state
 */
export function CurrentUserProvider(props: any) {
  const [userState, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();

  /**
   * @desc Requests details for a single User.
   */
  const login = useCallback(
    async username => {
      try {
        const { data: payload } = await apiGetLoginUser(username);
        if (payload != null) {
          toast.success(`Successful login.  Welcome back ${username}`);
          dispatch({ type: 'SUCCESSFUL_GET', payload: payload[0] });
          history.push(`/user/${payload[0].id}`);
        } else {
          toast.error(`Username ${username} is invalid.  Try again. `);
          dispatch({ type: 'FAILED_GET' });
        }
      } catch (err) {
        console.log(err);
      }
    },
    [history]
  );

  const setCurrentUser = useCallback(
    async username => {
      try {
        const { data: payload } = await apiGetLoginUser(username);
        if (payload != null) {
          dispatch({ type: 'SUCCESSFUL_GET', payload: payload[0] });
          history.push(`/user/${payload[0].id}`);
        } else {
          dispatch({ type: 'FAILED_GET' });
        }
      } catch (err) {
        console.log(err);
      }
    },
    [history]
  );

  const setNewUser = useCallback(async username => {
    dispatch({ type: 'ADD_USER', payload: username });
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
      setNewUser,
    };
  }, [userState, login, setCurrentUser, setNewUser]);

  return <CurrentUserContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Users state as dictated by dispatched actions.
 */
function reducer(state: CurrentUserState, action: CurrentUserAction | any) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      return {
        currentUser: action.payload,
        newUser: null,
      };
    case 'FAILED_GET':
      return {
        ...state,
        newUser: null,
      };
    case 'ADD_USER':
      return {
        ...state,
        newUser: action.payload,
      };
    default:
      console.warn('unknown action: ', action.type, action.payload);
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
