import React, { useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const OAuthLink = () => {
  const config = {};
  config.token = localStorage.getItem('token');
  config.onSuccess = localStorage.getItem('onSuccess');

  console.log('onSuccess function:', config.onSuccess);

  config.receivedRedirectUri = window.location.href;

  const { open, ready, error } = usePlaidLink(config);

  // automatically re-initialize Link
  useEffect(() => {
    if (ready) {
      open();
    }
  }, [ready, open]);

  return <></>;
};

export default OAuthLink;
