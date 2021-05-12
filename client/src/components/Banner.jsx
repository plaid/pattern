import React from 'react';
import Button from 'plaid-threads/Button';
import PropTypes from 'prop-types';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV;

const propTypes = {
  initialSubheading: PropTypes.bool,
};

const defaultProps = {
  initialSubheading: false,
};

const Banner = ({ initialSubheading }) => {
  const initialText =
    'This is an example app that outlines an end-to-end integration with Plaid.';

  const successText =
    'Success! You can explore account and transaction details for the linked item';

  const subheadingText = initialSubheading ? initialText : successText;

  return (
    <div id="banner" className="bottom-border-content">
      <h4>{PLAID_ENV} user</h4>
      <div className="header">
        <h1 className="everpresent-content__heading">Plaid Pattern</h1>
        <Button
          href="https://docs.google.com/forms/d/e/1FAIpQLSfF4Xev5w9RPGr7fNkSHjmtE_dj0ELuHRbDexQ7Tg2xoo6tQg/viewform"
          target="_blank"
          rel="noopener noreferrer"
          inline
          centered
          secondary
        >
          Send Feedback
        </Button>
      </div>
      <p id="intro" className="everpresent-content__subheading">
        {subheadingText}
      </p>
    </div>
  );
};

Banner.propTypes = propTypes;
Banner.defaultProps = defaultProps;

export default Banner;
