import React from 'react';

const DuplicateItemToastMessage = ({ institutionName }) => (
  <>
    <div>{`${institutionName} already linked.`}</div>
    <a
      className="toast__link"
      href="https://github.com/plaid/pattern/tree/master/server#preventing-item-duplication"
      target="_blank"
      rel="noopener noreferrer"
    >
      Click here
    </a>{' '}
    for more info.
  </>
);

export default DuplicateItemToastMessage;
