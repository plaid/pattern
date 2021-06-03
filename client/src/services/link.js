import React, {
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { getLinkToken } from './api';

const LinkContext = React.createContext();

/**
 * @desc Enumerated action types
 */
const types = {
  LINK_CONFIGS_CREATED: 0,
  LINK_CONFIGS_UPDATE_MODE_CREATED: 1,
};

/**
 * @desc Maintains the Link context state and provides a linkToken to create
 * and fetch instances of Link.
 */
export function LinkProvider(props) {
  const [linkToken, dispatch] = useReducer(reducer, {
    byUser: {},
    byItem: {},
  });

  /**
   * @desc Creates a new instance of Link for a given User or Item. For more details on
   * the configuration object see https://plaid.com/docs/#parameter-reference
   */

  const generateLinkToken = useCallback(
    async (isOauth, userId, itemId, oauthToken) => {
      const isUpdate = itemId != null;

      // generate link token only if not OAuth redirect.  Else use the oauthToken from local storage.
      let token;
      if (!isOauth) {
        const linkTokenResponse = await getLinkToken({ userId, itemId });
        token = await linkTokenResponse.data.link_token;
      } else {
        token = oauthToken;
      }

      if (isUpdate) {
        dispatch([types.LINK_CONFIGS_UPDATE_MODE_CREATED, itemId, token]);
      } else {
        dispatch([types.LINK_CONFIGS_CREATED, userId, token]);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      generateLinkToken,
      linkToken,
    }),
    [linkToken, generateLinkToken]
  );

  return <LinkContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Link configs as dictated by dispatched actions.
 */
function reducer(state, [type, id, token]) {
  switch (type) {
    case types.LINK_CONFIGS_CREATED:
      return {
        ...state,
        byUser: {
          [id]: token,
        },
      };

    case types.LINK_CONFIGS_UPDATE_MODE_CREATED:
      return {
        ...state,
        byItem: {
          ...state.byItem,
          [id]: token,
        },
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
