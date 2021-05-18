import React, { useEffect, useState } from 'react';

import { LinkButton } from './';
import { useGenerateLinkConfig } from '../hooks';

// Component rendered when user is redirected back to site from Oauth institution site.  It initiates link immediately with
// configs that are generated with the link token, userId and itemId from local storage.
const OAuthLink = () => {
  const [config, setConfig] = useState({});
  let { userId, itemId, token } = JSON.parse(
    localStorage.getItem('oauthConfig')
  );

  const linkConfig = useGenerateLinkConfig(true, userId, itemId, token);

  useEffect(() => {
    setConfig(linkConfig);
  }, [linkConfig, userId, itemId, token]);

  return (
    <>
      {config.onSuccess != null && (
        <LinkButton
          isOauth={true}
          userId={userId}
          itemId={itemId}
          config={config}
        ></LinkButton>
      )}
    </>
  );
};

export default OAuthLink;
