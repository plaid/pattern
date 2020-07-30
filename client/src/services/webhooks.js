import React, {
  useContext,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';

const WebhooksContext = React.createContext();

export function WebhooksProvider(props) {
  const [fetchedAsState, setFetchedAsState] = useState();
  const hasBeenFetched = useRef(false);
  const pendingRequest = useRef(false);
  useCallback(async refresh => {
    if (!pendingRequest.current && (refresh || !hasBeenFetched.current)) {
      pendingRequest.current = true;
      setFetchedAsState(true);
      pendingRequest.current = false;
      hasBeenFetched.current = true;
    }
  }, []);
  const value = useMemo(
    () => ({
      hasBeenFetched: fetchedAsState,
    }),
    [fetchedAsState]
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
