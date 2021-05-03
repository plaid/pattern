import React, {
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import {
  exchangeToken,
  getLinkToken,
  postLinkEvent,
  setItemState,
} from './api';
import { useItems } from '.';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV;
const LinkContext = React.createContext();

/**
 * @desc Enumerated action types
 */
const types = {
  LINK_CREATED: 0,
  LINK_UPDATE_MODE_CREATED: 1,
  // LINK_CREATION_FAILED: 2,
  LINK_LOADED: 3,
  LINK_UPDATE_MODE_LOADED: 4,
  SET_LINK_TOKEN: 5,
  SET_CONFIG: 6,
};

/**
 * @desc Maintains the Link handler context state and provides functions to create
 * and fetch instances of Link.
 */
export function LinkProvider(props) {
  const [linkHandlers, dispatch] = useReducer(reducer, {
    byUser: {},
    byItem: {},
  });
  const hasRequested = useRef({
    byUser: {},
    byItem: {},
  });

  const { getItemsByUser, getItemById } = useItems();

  /**
   * @desc Creates a new instance of Link for a given User or Item. For more details on
   * the configuration object see https://plaid.com/docs/#parameter-reference
   */
  const createConfig = useCallback(
    async ({ userId, itemId }) => {
      const isUpdate = itemId != null;

      if (isUpdate) {
        hasRequested.current.byItem[itemId] = true;
      } else {
        hasRequested.current.byUser[userId] = true;
      }
      let config;
      const base = {
        apiVersion: 'v2',
        clientName: 'Pattern',
        env: PLAID_ENV,
        product: ['transactions'],
      };
      const onLoad = () => {
        logEvent('onLoad', {});
        if (isUpdate) {
          dispatch([types.LINK_UPDATE_MODE_LOADED, { id: itemId }]);
        } else {
          dispatch([types.LINK_LOADED, { id: userId }]);
        }
      };
      const onSuccess = async (
        publicToken,
        { institution, accounts, link_session_id }
      ) => {
        logEvent('onSuccess', { institution, accounts, link_session_id });
        await postLinkEvent({
          userId,
          link_session_id,
          type: 'success',
        });
        if (isUpdate) {
          await setItemState(itemId, 'good');
          getItemById(itemId, true);
        } else {
          await exchangeToken(publicToken, institution, accounts, userId);
          getItemsByUser(userId, true);
        }

        if (window.location.pathname === '/') {
          window.location.href = `/user/${userId}/items`;
        }
      };

      const onExit = async (
        error,
        { institution, link_session_id, request_id }
      ) => {
        logEvent('onExit', {
          error,
          institution,
          link_session_id,
          request_id,
        });
        const eventError = error || {};
        await postLinkEvent({
          userId,
          link_session_id,
          request_id,
          type: 'exit',
          ...eventError,
        });
        if (error != null && error.error_code === 'INVALID_LINK_TOKEN') {
          // gets rid of the old iframe
          // handler.destroy();
          // await initializeLink();
        }
      };
      const baseConfig = {
        onSuccess: onSuccess,
        onLoad: onLoad,
        onExit: onExit,
        onEvent: logEvent,
      };

      if (isUpdate) {
        dispatch([types.LINK_UPDATE_MODE_CREATED, { id: itemId, config }]);
      } else {
        dispatch([types.LINK_CREATED, { id: userId, config }]);
      }
    },
    [getItemsByUser, getItemById]
  );

  const generateLinkToken = useCallback(async ({ itemId, userId }) => {
    const isUpdate = itemId != null;
    const linkTokenResponse = await getLinkToken({ itemId, userId });
    const linkToken = await linkTokenResponse.data.link_token;
    console.log('here it is: ', linkTokenResponse.data.link_token);
    if (isUpdate) {
      dispatch([types.LINK_UPDATE_MODE_CREATED, { itemId, linkToken }]);
    } else {
      dispatch([types.LINK_CREATED, { userId, linkToken }]);
    }
    console.log('and afterwards too: ', linkTokenResponse.data.link_token);
    console.log(linkHandlers);
  }, []);

  /**
   * @desc Requests a Link handler.
   * The handler creation will be bypassed if an instance of Link already exists for
   * that User or Item.
   */
  const getConfig = useCallback(
    ({ userId, itemId } = {}) => {
      if (
        (itemId && !hasRequested.current.byItem[itemId]) ||
        (userId && !hasRequested.current.byUser[userId])
      ) {
        createConfig({ itemId, userId });
      }
    },
    [createConfig]
  );

  const value = useMemo(
    () => ({
      getConfig,
      generateLinkToken,
      linkHandlers,
    }),
    [getConfig, linkHandlers, generateLinkToken]
  );

  return <LinkContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Link state as dictated by dispatched actions.
 */
function reducer(state, [type, { id, linkToken }]) {
  switch (type) {
    case types.LINK_CREATED:
      return {
        ...state,
        byUser: {
          ...state.byUser,
          [id]: {
            ...state.byUser[id],
          },
          linkToken: linkToken,
        },
      };
    case types.LINK_UPDATE_MODE_CREATED:
      return {
        ...state,
        byItem: {
          ...state.byItem,
          [id]: {
            ...state.byItem[id],
          },
          linkToken: linkToken,
        },
      };
    case types.LINK_LOADED:
      return {
        ...state,
        byUser: {
          ...state.byUser,
          [id]: {
            ...state.byUser[id],
            isReady: true,
          },
        },
      };
    case types.LINK_UPDATE_MODE_LOADED:
      return {
        ...state,
        byItem: {
          ...state.byItem,
          [id]: {
            ...state.byItem[id],
            isReady: true,
          },
        },
      };
    default:
      console.warn('unknown action: ', {
        type,
        payload: { id, linkToken },
      });
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Link context state in components.
 */
export default function useLink() {
  const context = useContext(LinkContext);
  if (!context) {
    throw new Error(`useLink must be used within a LinkProvider`);
  }

  return context;
}

/**
 * @desc Prepends 'Link Event: ' to console logs.
 */
function logEvent(eventName, extra) {
  console.log(`Link Event: ${eventName}`, extra);
}
