import React from 'react';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV;

interface Props {
  initialSubheading?: boolean;
}

const Banner = (props: Props) => {
  const initialText =
    'This is an example app that outlines an end-to-end integration with Plaid.';

  const successText =
    "This page shows a user's net worth, spending by category, and allows them to explore account and transactions details for linked items.";

  const subheadingText = props.initialSubheading ? initialText : successText;

  return (
    <div id="banner" className="bottom-border-content">
      <h4>{PLAID_ENV} user</h4>
      <div className="header">
        <h1 className="everpresent-content__heading">Plaid Pattern</h1>
      </div>
      <p id="intro" className="everpresent-content__subheading">
        {subheadingText}
      </p>
    </div>
  );
};

export default Banner;
