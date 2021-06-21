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
        dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
      } else {
        dispatch({ type: 'FAILED_GET' });
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const addAsset = useCallback(
    async (userId, description, value, refresh) => {
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
    },
    [getAssetsByUser]
  );

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
function reducer(state, action) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      return {
        assets: action.payload,
      };
    case 'FAILED_GET':
      return {
        ...state,
      };

    default:
      console.warn('unknown action: ', action.type, action.payload);
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
