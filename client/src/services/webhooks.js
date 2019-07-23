import React, {
  useContext,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';

import { getWebhookUrl as apiGetWebhooksUrl } from './api';

const WebhooksContext = React.createContext();

export function WebhooksProvider(props) {
  const [webhooksUrl, setWebhooksUrl] = useState();
  const [fetchedAsState, setFetchedAsState] = useState();
  const hasBeenFetched = useRef(false);
  const pendingRequest = useRef(false);

  const getWebhooksUrl = useCallback(async refresh => {
    if (!pendingRequest.current && (refresh || !hasBeenFetched.current)) {
      pendingRequest.current = true;
      const { data } = await apiGetWebhooksUrl();
      setWebhooksUrl(data);
      setFetchedAsState(true);
      pendingRequest.current = false;
      hasBeenFetched.current = true;
    }
  }, []);

  const value = useMemo(
    () => ({
      webhooksUrl,
      getWebhooksUrl,
      hasBeenFetched: fetchedAsState,
    }),
    [webhooksUrl, getWebhooksUrl, fetchedAsState]
  );

  return <WebhooksContext.Provider value={value} {...props} />;
}

export default function useWebhooks() {
  const context = useContext(WebhooksContext);
  if (!context) {
    throw new Error(`useWebhooks must be used within a WebhooksProvider`);
  }

  return context;
}
