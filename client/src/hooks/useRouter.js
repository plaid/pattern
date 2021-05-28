import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import propTypes from 'prop-types';

useRouter.propTypes = {
  path: propTypes.string,
};

useRouter.defaultProps = {
  path: null,
};

export default function useRouter() {
  const history = useHistory();

  const pushRoute = path => {
    history.push(path);
  };
  return pushRoute;
}
