import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  action: PropTypes.func,
  text: PropTypes.string.isRequired,
};

const defaultProps = {
  action: null,
  text: '',
};

const Action = ({ action, text }) => {
  return <div onClick={action}>{text}</div>;
};

Action.propTypes = propTypes;
Action.defaultProps = defaultProps;

export default Action;
