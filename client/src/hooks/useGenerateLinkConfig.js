import { useEffect, useState } from 'react';
import propTypes from 'prop-types';

import { useLink } from '../services';

useGenerateLinkConfig.propTypes = {
  userId: propTypes.string,
  itemId: propTypes.string,
};

useGenerateLinkConfig.defaultProps = {
  userId: null,
  itemId: null,
};

export default function useGenerateLinkConfig(userId, itemId) {
  const [config, setConfig] = useState({ token: null, onSucces: null });
  const { generateLinkConfigs, linkConfigs } = useLink();

  // get link configs from link context
  useEffect(() => {
    generateLinkConfigs(userId, itemId);
  }, [generateLinkConfigs, userId, itemId]);

  // set linkToken and callbacks from configs from link context
  useEffect(() => {
    if (linkConfigs.byUser[userId]) {
      setConfig(linkConfigs.byUser[userId]);
    }
    if (linkConfigs.byItem[itemId]) {
      setConfig(linkConfigs.byItem[itemId]);
    }
  }, [linkConfigs.byUser[userId], linkConfigs.byItem[itemId]]);

  return config;
}
