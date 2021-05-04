import React from 'react';
import propTypes from 'prop-types';
import Button from 'plaid-threads/Button';
import { usePlaidLink } from 'react-plaid-link';

import { useItems } from '../services';

LinkButton.propTypes = {
  altClasses: propTypes.string,
  primary: propTypes.bool,
  linkToken: propTypes.string,
  callbacks: propTypes.object,
  seconodary: propTypes.bool,
};

LinkButton.defaultProps = {
  altClasses: null,
  primary: false,
  linkToken: null,
  callbacks: null,
  secondary: false,
};

export default function LinkButton({
  children,
  altClasses,
  primary,
  linkToken,
  callbacks,
  secondary,
}) {
  const isPrimary = primary ? 'button--is-primary' : '';
  const classlist = altClasses !== null ? altClasses : '';

  const linkConfig = {
    ...callbacks,
    token: linkToken,
  };

  const { open, ready } = usePlaidLink(linkConfig);

  return (
    <Button
      secondary={secondary}
      // centered
      className={`button ${isPrimary} ${classlist}`}
      disabled={!ready}
      onClick={() => {
        open();
      }}
    >
      {children}
    </Button>
  );
}
