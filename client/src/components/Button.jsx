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
  type: 'button',
  disabled: false,
  primary: false,
};

const Button = ({ primary, action, disabled, text, altClasses }) => {
  const isPrimary = primary ? 'button--is-primary' : '';
  const classlist = altClasses !== undefined ? altClasses : '';
  return (
    <button
      className={`button ${isPrimary} ${classlist}`}
      onClick={action}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
