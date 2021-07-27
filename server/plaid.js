/**
 * @file Defines the connection to the Plaid client.
 */

const forEach = require('lodash/forEach');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const {
  createPlaidApiEvent,
  retrieveItemByPlaidAccessToken,
} = require('./db/queries');

// Your Plaid API keys and secrets are loaded as environment variables.
// They are set in your `.env` file. See the repo README for more info.
const {
  PLAID_CLIENT_ID,
  PLAID_ENV,
  PLAID_SECRET_DEVELOPMENT,
  PLAID_SECRET_SANDBOX,
} = process.env;

// The Plaid secret is unique per environment. Note that there is also a separate production key,
// though we do not account for that here.
const PLAID_SECRET =
  PLAID_ENV === 'development' ? PLAID_SECRET_DEVELOPMENT : PLAID_SECRET_SANDBOX;

const OPTIONS = { clientApp: 'Plaid-Pattern' };

// We want to log requests to / responses from the Plaid API (via the Plaid client), as this data
// can be useful for troubleshooting.

/**
 * Logging function for Plaid client methods that use an access_token as an argument. Associates
 * the Plaid API event log entry with the item and user the request is for.
 *
 * @param {string} clientMethod the name of the Plaid client method called.
 * @param {Array} clientMethodArgs the arguments passed to the Plaid client method.
 * @param {Object} response the response from the Plaid client.
 */
const defaultLogger = async (clientMethod, clientMethodArgs, response) => {
  const accessToken = clientMethodArgs[0].access_token;
  const { id: itemId, user_id: userId } = await retrieveItemByPlaidAccessToken(
    accessToken
  );
  await createPlaidApiEvent(
    itemId,
    userId,
    clientMethod,
    clientMethodArgs,
    response
  );
};

/**
 * Logging function for Plaid client methods that do not use access_token as an argument. These
 * Plaid API event log entries will not be associated with an item or user.
 *
 * @param {string} clientMethod the name of the Plaid client method called.
 * @param {Array} clientMethodArgs the arguments passed to the Plaid client method.
 * @param {Object} response the response from the Plaid client.
 */
const noAccessTokenLogger = async (
  clientMethod,
  clientMethodArgs,
  response
) => {
  await createPlaidApiEvent(
    undefined,
    undefined,
    clientMethod,
    clientMethodArgs,
    response
  );
};

// Plaid client methods used in this app, mapped to their appropriate logging functions.

const clientMethodLoggingFns = {
  institutionsGet: noAccessTokenLogger,
  institutionsGetById: noAccessTokenLogger,
  itemPublicTokenExchange: noAccessTokenLogger,
  itemRemove: defaultLogger,
  linkTokenCreate: noAccessTokenLogger,
  transactionsGet: defaultLogger,
  sandboxItemResetLogin: defaultLogger,
};
// Wrapper for the Plaid client. This allows us to easily log data for all Plaid client requests.
class PlaidClientWrapper {
  constructor() {
    // Initialize the Plaid client.

    const configuration = new Configuration({
      basePath: PlaidEnvironments[PLAID_ENV],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
          'PLAID-SECRET': PLAID_SECRET,
          'Plaid-Version': '2020-09-14',
        },
      },
    });

    this.client = new PlaidApi(configuration);

    // Wrap the Plaid client methods to add a logging function.
    forEach(clientMethodLoggingFns, (logFn, method) => {
      this[method] = this.createWrappedClientMethod(method, logFn);
    });
  }

  // Allows us to log API request data for troubleshooting purposes.
  createWrappedClientMethod(clientMethod, log) {
    return async (...args) => {
      try {
        const res = await this.client[clientMethod](...args);
        await log(clientMethod, args, res);
        return res;
      } catch (err) {
        await log(clientMethod, args, err.response.data);
        throw err;
      }
    };
  }
}

module.exports = new PlaidClientWrapper();
