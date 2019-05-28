/**
 * @file Defines the connection to the Plaid client.
 */

const plaid = require('plaid');

// Your Plaid API keys and secrets are loaded as environment variables.
// They are set in your `.env` file. See the repo README for more info.
const {
  PLAID_CLIENT_ID,
  PLAID_ENV,
  PLAID_PUBLIC_KEY,
  PLAID_SECRET_DEVELOPMENT,
  PLAID_SECRET_SANDBOX,
} = process.env;

// The Plaid secret is unique per environment.
const PLAID_SECRET =
  PLAID_ENV === 'development' ? PLAID_SECRET_DEVELOPMENT : PLAID_SECRET_SANDBOX;

const OPTIONS = { clientApp: 'Plaid-Pattern' };

/**
 * Initializes a new Plaid Client using your Plaid keys.
 *
 * @returns initialized plaid client.
 */
const initPlaidClient = () => {
  const plaidClient = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments[PLAID_ENV],
    OPTIONS
  );
  return plaidClient;
};

module.exports = initPlaidClient();
