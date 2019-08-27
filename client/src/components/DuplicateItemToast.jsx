import React from 'react';

const DuplicateItemToastMessage = ({ institutionName }) => (
  <>
    <div>{`${institutionName} already linked.`}</div>
    <a
      className="toast__link"
      href="https://github.com/plaid/pattern/blob/master/server/routes/items.js#L41"
      target="_blank"
      rel="noopener noreferrer"
    >
      Click here
    </a>{' '}
    for more info.
  </>
);

export default DuplicateItemToastMessage;
