import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from 'react';
import { toast } from 'react-toastify';
import keyBy from 'lodash/keyBy';
import { addProperty as apiAddProperty } from './api';
import { getPropertiesByUser as apiGetPropertiesByUser } from './api';

const PropertiesContext = createContext();

/**
 * @desc Enumerated action types
 */
const types = {
  SUCCESSFUL_GET: 0,
  FAILED_GET: 1,
};

/**
 * @desc Maintains the Properties context state
 */
export function PropertiesProvider(props) {
  const [propertiesByUser, dispatch] = useReducer(reducer, {
    properties: [],
  });

  /**
   * @desc Requests details for a single User.
   */
  const addProperty = useCallback(
    async (userId, description, value, refresh) => {
      try {
        const { data: payload } = await apiAddProperty(
          userId,
          description,
          value
        );
        if (payload != null) {
          toast.success(`Successful addition of ${description}`);
        } else {
          toast.error(`could not add ${description}`);
        }
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const getPropertiesByUser = useCallback(async userId => {
    try {
      const { data: payload } = await apiGetPropertiesByUser(userId);
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
      propertiesByUser,
      addProperty,
      getPropertiesByUser,
    };
  }, [propertiesByUser, addProperty, getPropertiesByUser]);

  return <PropertiesContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Users state as dictated by dispatched actions.
 */
function reducer(state, [type, payload]) {
  switch (type) {
    case types.SUCCESSFUL_GET:
      return {
        properties: payload,
      };
    case types.FAILED_GET:
      return {
        ...state,
        newUser: null,
      };

    default:
      console.warn('unknown action: ', { type, payload });
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Users context state in components.
 */
export default function useProperties() {
  const context = useContext(PropertiesContext);

  if (!context) {
    throw new Error(`useProperties must be used within a PropertiesProvider`);
  }

  return context;
}
