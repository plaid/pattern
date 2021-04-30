import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import Button from 'plaid-threads/Button';
import { usePlaidLink } from 'react-plaid-link';

import { useLink } from '../services';

LinkButton.propTypes = {
  userId: propTypes.number,
  itemId: propTypes.number,
  altClasses: propTypes.string,
  primary: propTypes.bool,
};

LinkButton.defaultProps = {
  userId: null,
  itemId: null,
  altClasses: null,
  primary: false,
};

export default function LinkButton({
  children,
  userId,
  itemId,
  altClasses,
  primary,
}) {
  const [configs, setConfigs] = useState({});
  const { linkConfigs, getLinkConfigs } = useLink();
  console.log('link instance', linkInstance);

  const isPrimary = primary ? 'button--is-primary' : '';
  const classlist = altClasses !== null ? altClasses : '';

  const { open, ready } = usePlaidLink(configs);

  useEffect(() => {
    getLinkConfigs({ userId, itemId });
  }, [userId, itemId, getLinkConfigs]);

  useEffect(() => {
    if (itemId) {
      setConfigs(linkConfigs.byItem || {});
    } else {
      setConfigs(linkConfigs.byUser || {});
    }
  }, [linkConfigs, itemId, userId]);

  useEffect(() => {
    if (ready) {
      open();
    }
  }, [ready, open, isOauth]);

  return (
    <Button
      centered
      className={`button ${isPrimary} ${classlist}`}
      disabled={!linkInstance.isReady}
      onClick={() => open()}
    >
      {children}
    </Button>
  );
}
