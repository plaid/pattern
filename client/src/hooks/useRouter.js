import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import propTypes from 'prop-types';

useRouter.propTypes = {
  path: propTypes.string,
};

useRouter.defaultProps = {
  path: null,
};
// Custom hook created in order to use useRouter hook in
// onSuccess function in Link.
export default function useRouter() {
  const history = useHistory();

  const pushRoute = path => {
    history.push(path);
  };
  return pushRoute;
}
