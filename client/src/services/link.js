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
  getPublicToken,
  postLinkEvent,
  setItemState,
} from './api';
import { useItems, useWebhooks } from '.';

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
  const createLinkHandler = useCallback(
    async ({ userId, itemId }) => {
      const isUpdate = itemId != null;

      const linkTokenRes = await getLinkToken({ itemId, userId });
      if (isUpdate) {
        hasRequested.current.byItem[itemId] = true;
      } else {
        hasRequested.current.byUser[userId] = true;
      }

      const handler = await window.Plaid.create({
        apiVersion: 'v2',
        clientName: 'Pattern',
        env: PLAID_ENV,
        token: linkTokenRes.data.link_token,
        onEvent: logEvent,
        onLoad: () => {
          logEvent('onLoad', {});
          if (isUpdate) {
            dispatch([types.LINK_UPDATE_MODE_LOADED, {id: itemId}]);
          } else {
            dispatch([types.LINK_LOADED, {id: userId}]);
          }
        },
        onSuccess: async (
          publicToken,
          {institution, accounts, link_session_id}
        ) => {
          logEvent('onSuccess', {institution, accounts, link_session_id});
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
        },
        onExit: async (
          error,
          {institution, link_session_id, request_id}
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
        },
        product: ['transactions'],
      });

      if (isUpdate) {
        dispatch([types.LINK_UPDATE_MODE_CREATED, {id: itemId, handler}]);
      } else {
        dispatch([types.LINK_CREATED, {id: userId, handler}]);
      }

    },
    [getItemsByUser, getItemById]
  );

  /**
   * @desc Requests a Link handler.
   * The handler creation will be bypassed if an instance of Link already exists for
   * that User or Item.
   */
  const getLinkHandler = useCallback(
    ({ userId, itemId } = {}) => {
      console.log('user1', userId, 'item1', itemId);
      if ((itemId && !hasRequested.current.byItem[itemId]) || (userId && !hasRequested.current.byUser[userId])) {
        createLinkHandler({itemId, userId});
      }
    },
    [createLinkHandler]
  );

  const value = useMemo(
    () => ({
      linkHandlers,
      getLinkHandler,
    }),
    [linkHandlers, getLinkHandler]
  );

  return <LinkContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Link state as dictated by dispatched actions.
 */
function reducer(state, [type, { id, handler }]) {
  switch (type) {
    case types.LINK_CREATED:
      return {
        ...state,
        byUser: {
          ...state.byUser,
          [id]: {
            ...state.byUser[id],
            handler,
          },
        },
      };
    case types.LINK_UPDATE_MODE_CREATED:
      return {
        ...state,
        byItem: {
          ...state.byItem,
          [id]: {
            ...state.byItem[id],
            handler,
          },
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
        payload: { id, handler },
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
