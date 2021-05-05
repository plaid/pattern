import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  action: PropTypes.func,
  altClasses: PropTypes.string,
  text: PropTypes.string.isRequired,
  primary: PropTypes.bool,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

const defaultProps = {
  action: null,
  altClasses: null,
  type: 'action',
  disabled: false,
  primary: false,
};

const Action = ({ primary, action, disabled, text, altClasses }) => {
  const isPrimary = primary ? 'button--is-primary' : '';
  const classlist = altClasses !== undefined ? altClasses : '';
  return (
    <div
      className={`action ${isPrimary} ${classlist}`}
      onClick={action}
      disabled={disabled}
      centered
    >
      {text}
    </div>
  );
};

Action.propTypes = propTypes;
Action.defaultProps = defaultProps;

export default Action;
