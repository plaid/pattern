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

const LinkContext = React.createContext();

/**
 * @desc Enumerated action types
 */
const types = {
  LINK_CONFIGS_CREATED: 0,
  LINK_CONFIGS_UPDATE_MODE_CREATED: 1,
};

/**
 * @desc Maintains the Link handler context state and provides configs and linkToken to create
 * and fetch instances of Link.
 */
export function LinkProvider(props) {
  const [linkConfigs, dispatch] = useReducer(reducer, {
    byUser: {}, // normal case
    byItem: {}, // update mode
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

  const generateLinkConfigs = useCallback(
    async (isOauth, userId, itemId, oauthToken) => {
      // The config creation will be bypassed if configs already exist for
      // that User or Item.

      if (
        !(itemId != null && !hasRequested.current.byItem[itemId]) &&
        !(userId != null && !hasRequested.current.byUser[userId])
      ) {
        return;
      }
      const isUpdate = itemId != null;

      if (isUpdate) {
        hasRequested.current.byItem[itemId] = true;
      } else {
        hasRequested.current.byUser[userId] = true;
      }
      let token;
      if (!isOauth) {
        const linkTokenResponse = await getLinkToken({ itemId, userId });
        token = await linkTokenResponse.data.link_token;
      } else {
        token = oauthToken;
      }

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

        window.location.href = `/user/${userId}/items`;
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
          await generateLinkConfigs(userId, itemId);
        }
      };

      const callbacks = {
        onSuccess: onSuccess,
        onExit: onExit,
        onEvent: logEvent,
      };

      if (isUpdate) {
        dispatch([
          types.LINK_CONFIGS_UPDATE_MODE_CREATED,
          { id: itemId, token, callbacks },
        ]);
      } else {
        dispatch([
          types.LINK_CONFIGS_CREATED,
          { id: userId, token, callbacks },
        ]);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      generateLinkConfigs,
      linkConfigs,
    }),
    [linkConfigs, generateLinkConfigs]
  );

  return <LinkContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Link configs as dictated by dispatched actions.
 */
function reducer(state, [type, { id, token, callbacks }]) {
  switch (type) {
    case types.LINK_CONFIGS_CREATED:
      return {
        ...state,
        byUser: {
          ...state.byUser,
          [id]: {
            ...state.byUser[id],
            token,
            ...callbacks,
          },
        },
      };
    case types.LINK_CONFIGS_UPDATE_MODE_CREATED:
      return {
        ...state,
        byItem: {
          ...state.byItem,
          [id]: {
            ...state.byItem[id],
            token,
            ...callbacks,
          },
        },
      };
    default:
      console.warn('unknown action: ', {
        type,
        payload: { id, token, callbacks },
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
