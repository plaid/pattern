import React, { useState, useEffect } from 'react';

import { LinkButton } from '.';

// Component rendered when user is redirected back to site from Oauth institution site.
// It initiates link immediately with the original link token that was set in local storage
// from the initial link initialization.
const OAuthLink = () => {
  const [token, setToken] = useState<string>();
  const [userId, setUserId] = useState<number>(-100); // set for typescript
  const [itemId, setItemId] = useState<number>();
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isIdentity, setIsIdentity] = useState<boolean>(false);

  const oauthObject = localStorage.getItem('oauthConfig');

  useEffect(() => {
    if (oauthObject != null) {
      setUserId(JSON.parse(oauthObject).userId);
      setItemId(JSON.parse(oauthObject).itemId);
      setToken(JSON.parse(oauthObject).token);
      setIsAuth(JSON.parse(oauthObject).isAuth);
      setIsIdentity(JSON.parse(oauthObject).isIdentity);
    }
  }, [oauthObject]);

  return (
    <>
      {token != null && (
        <LinkButton
          isOauth // this will initiate link immediately
          userId={userId}
          itemId={itemId}
          token={token}
          isAuth={isAuth}
          isIdentity={isIdentity}
        />
      )}
    </>
  );
};

export default OAuthLink;
