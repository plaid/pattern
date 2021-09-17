import React from 'react';
import Button from 'plaid-threads/Button';

interface Props {
  initialSubheading?: boolean;
  username?: string | null;
}

const Banner: React.FC<Props> = (props: Props) => {
  const initialText =
    'This is an example account funding app that outlines an end-to-end integration with Plaid.';

  const successText =
    "This page shows a user's Plaid Pattern account funding balance and allows them to transfer funds from their financial institution to their Plaid Pattern account.";
  const subheadingText = props.initialSubheading ? initialText : successText;

  return (
    <div id="banner" className="bottom-border-content">
      {!props.initialSubheading && <h4>username: {props.username} </h4>}
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

Banner.displayName = 'Banner';
export default Banner;
