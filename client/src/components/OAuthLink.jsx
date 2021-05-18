import React, { useEffect, useState } from 'react';

import { useLink } from '../services';
import { LinkButton } from './';

// Component rendered when user is redirected back to site from Oauth institution site.  It initiates link immediately with
// configs that are generated with the link token, userId and itemId from local storage.
const OAuthLink = () => {
  const [config, setConfig] = useState({});
  const { generateLinkConfigs, linkConfigs } = useLink();
  const { userId, itemId, token } = JSON.parse(
    localStorage.getItem('oauthConfig')
  );

  useEffect(() => {
    generateLinkConfigs(true, userId, itemId, token);
  }, [generateLinkConfigs]);

  // set linkToken and callbacks from configs from link context
  useEffect(() => {
    if (linkConfigs.byUser[userId]) {
      setConfig(linkConfigs.byUser[userId]);
    }
    if (linkConfigs.byItem[itemId]) {
      setConfig(linkConfigs.byItem[itemId]);
    }
  }, [
    generateLinkConfigs,
    linkConfigs.byUser[userId],
    linkConfigs.byItem[itemId],
  ]);

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
