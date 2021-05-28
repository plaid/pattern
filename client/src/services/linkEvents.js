import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from 'react';
import { getLinkEvents as apiGetLinkEvents } from './api';
import { useRouter } from '../hooks';

const LinkEventsContext = createContext();

/**
 * @desc Enumerated action types
 */
const types = {
  SUCCESSFUL_GET: 0,
  FAILED_GET: 1,
  ADD_USER: 2,
};

/**
 * @desc Maintains the linkevents context stae
 */
export function LinkEventsProvider(props) {
  const [linkEvents, dispatch] = useReducer(reducer, {});

  /**
   * @desc Requests details for a single User.
   */
  const getLinkEvents = useCallback(async refresh => {
    try {
      const { data: payload } = await apiGetLinkEvents();
      if (payload != null) {
        dispatch([types.SUCCESSFUL_GET, payload]);
      } else {
        dispatch([types.FAILED_GET]);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Users data. useMemo will prevent
   * these from being rebuilt on every render unless usersById is updated in the reducer.
   */
  const value = useMemo(() => {
    return {
      linkEvents,
      getLinkEvents,
    };
  }, [linkEvents, getLinkEvents]);

  return <LinkEventsContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Users state as dictated by dispatched actions.
 */
function reducer(state, [type, payload]) {
  switch (type) {
    case types.SUCCESSFUL_GET:
      return {
        events: payload,
      };
    case types.FAILED_GET:
      return {
        ...state,
      };
    default:
      console.warn('unknown action: ', { type, payload });
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Users context state in components.
 */
export default function useLinkEvents() {
  const context = useContext(LinkEventsContext);

  if (!context) {
    throw new Error(`useUsers must be used within a UsersProvider`);
  }

  return context;
}
