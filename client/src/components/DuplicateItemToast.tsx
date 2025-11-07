import React from 'react';

interface Props {
  institutionName: string | undefined;
}

const DuplicateItemToastMessage = (props: Props) => (
  <>
    <div>
      <strong>{props.institutionName} is already linked to this account.</strong>
    </div>
    <div style={{ marginTop: '8px' }}>
      You cannot link the same institution twice.{' '}
      <a
        className="toast__link"
        href="https://github.com/plaid/pattern/tree/master/server#preventing-item-duplication"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more
      </a>
    </div>
  </>
);

export default DuplicateItemToastMessage;
