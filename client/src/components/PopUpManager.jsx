import React, { useEffect, useState } from 'react';
import Banner from 'plaid-threads/Banner';

import { useCurrentUser } from '../services';

// Component rendered when user is redirected back to site from Oauth institution site.  It initiates link immediately with
// configs that are generated with the link token, userId and itemId from local storage.
const PopUpManager = () => {
  const { userState, dismissBanner } = useCurrentUser();
  let banner = userState.banner;

  const handleClick = () => {
    dismissBanner();
  };
  return (
    <>
      {banner.show && (
        <Banner
          className="popUp"
          title={banner.title}
          onClick={handleClick}
          buttonText="Dismiss"
          error={banner.error}
        >
          {banner.text}
        </Banner>
      )}
    </>
  );
};

export default PopUpManager;
