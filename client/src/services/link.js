import React, { useCallback, useContext, useMemo, useReducer } from 'react';

import { getLinkToken } from './api';

const LinkContext = React.createContext();

/**
 * @desc Enumerated action types
 */
const types = {
  LINK_TOKEN_CREATED: 0,
  LINK_TOKEN_UPDATE_MODE_CREATED: 1,
  LINK_TOKEN_ERROR: 2,
};

/**
 * @desc Maintains the Link context state and fetches link tokens to update that state.
 */
export function LinkProvider(props) {
  const [linkTokens, dispatch] = useReducer(reducer, {
    byUser: {}, // normal case
    byItem: {}, // update mode
    error: {},
  });

  /**
   * @desc Creates a new link token for a given User or Item.
   */

  const generateLinkToken = useCallback(async (userId, itemId) => {
    // if itemId is not null, update mode is triggered
    const linkTokenResponse = await getLinkToken({ userId, itemId });
    if (linkTokenResponse.data.link_token) {
      const token = await linkTokenResponse.data.link_token;

      if (itemId != null) {
        dispatch([types.LINK_TOKEN_UPDATE_MODE_CREATED, itemId, token]);
      } else {
        dispatch([types.LINK_TOKEN_CREATED, userId, token]);
      }
    } else {
      dispatch([types.LINK_TOKEN_ERROR, '', '', linkTokenResponse.data]);
    }
  }, []);

  const value = useMemo(
    () => ({
      generateLinkToken,
      linkTokens,
    }),
    [linkTokens, generateLinkToken]
  );

  return <LinkContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the LinkTokens state as dictated by dispatched actions.
 */
function reducer(state, [type, id, token, error]) {
  switch (type) {
    case types.LINK_TOKEN_CREATED:
      return {
        ...state,
        byUser: {
          [id]: token,
        },
        error: {},
      };

    case types.LINK_TOKEN_UPDATE_MODE_CREATED:
      return {
        ...state,
        error: {},
        byItem: {
          ...state.byItem,
          [id]: token,
        },
      };
    case types.LINK_TOKEN_ERROR:
      return {
        ...state,
        error,
      };
    default:
      console.warn('unknown action: ', {
        type,
        payload: { id, token },
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
