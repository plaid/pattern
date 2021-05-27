import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from 'react';
import { toast } from 'react-toastify';
import { addAsset as apiAddAsset } from './api';
import { getAssetsByUser as apiGetAssetsByUser } from './api';

const AssetsContext = createContext();

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
export function AssetsProvider(props) {
  const [assetsByUser, dispatch] = useReducer(reducer, {
    assets: [],
  });

  const getAssetsByUser = useCallback(async userId => {
    try {
      const { data: payload } = await apiGetAssetsByUser(userId);
      if (payload != null) {
        dispatch([types.SUCCESSFUL_GET, payload]);
      } else {
        dispatch([types.FAILED_GET]);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const addAsset = useCallback(async (userId, description, value, refresh) => {
    try {
      const { data: payload } = await apiAddAsset(userId, description, value);
      if (payload != null) {
        toast.success(`Successful addition of ${description}`);
        await getAssetsByUser(userId);
      } else {
        toast.error(`Could not add ${description}`);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const value = useMemo(() => {
    return {
      assetsByUser,
      addAsset,
      getAssetsByUser,
    };
  }, [assetsByUser, addAsset, getAssetsByUser]);

  return <AssetsContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the propertiesByUser as dictated by dispatched actions.
 */
function reducer(state, [type, payload]) {
  switch (type) {
    case types.SUCCESSFUL_GET:
      return {
        assets: payload,
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
 * @desc A convenience hook to provide access to the Properties context state in components.
 */
export default function useAssets() {
  const context = useContext(AssetsContext);

  if (!context) {
    throw new Error(`useAssets must be used within a AssetsProvider`);
  }

  return context;
}
