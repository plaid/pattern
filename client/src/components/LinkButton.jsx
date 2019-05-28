import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';

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
  const [linkInstance, setLinkInstance] = useState({});
  const { linkHandlers, getLinkHandler } = useLink();

  const isPrimary = primary ? 'button--is-primary' : '';
  const classlist = altClasses !== undefined ? altClasses : '';

  useEffect(() => {
    getLinkHandler({ userId, itemId });
  }, [userId, itemId, getLinkHandler]);

  useEffect(() => {
    if (itemId) {
      setLinkInstance(linkHandlers.byItem[itemId] || {});
    } else {
      setLinkInstance(linkHandlers.byUser[userId] || {});
    }
  }, [linkHandlers, itemId, userId]);

  return (
    <button
      className={`button ${isPrimary} ${classlist}`}
      disabled={!linkInstance.isReady}
      onClick={() => {
        linkInstance.handler.open();
      }}
    >
      {children}
    </button>
  );
}
