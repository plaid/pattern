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
 * the Plaid API event log entry with the item the request is for.
 *
 * @param {string} clientMethod the name of the Plaid client method called.
 * @param {Array} clientMethodArgs the arguments passed to the Plaid client method.
 * @param {Object} response the response from the Plaid client.
 */
const defaultLogger = async (clientMethod, clientMethodArgs, response) => {
  const accessToken = clientMethodArgs[0].access_token;
  const { id: itemId } = await retrieveItemByPlaidAccessToken(accessToken);
  await createPlaidApiEvent(itemId, clientMethod, clientMethodArgs, response);
};

/**
 * Logging function for Plaid client methods that do not use access_token as an argument. These
 * Plaid API event log entries will not be associated with an item.
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
    clientMethod,
    clientMethodArgs,
    response
  );
};

// All available Plaid client methods as of v9.0.0-beta-release mapped to their appropriate logging functions.

const clientMethodLoggingFns = {
  accountsBalanceGet: defaultLogger,
  accountsGet: defaultLogger,
  assetReportAuditCopyCreate: defaultLogger,
  assetReportAuditCopyGet: noAccessTokenLogger,
  assetReportAuditCopyRemove: noAccessTokenLogger,
  assetReportCreate: noAccessTokenLogger,
  assetReportFilter: noAccessTokenLogger,
  assetReportGet: noAccessTokenLogger,
  assetReportPdfGet: noAccessTokenLogger,
  assetReportRefresh: noAccessTokenLogger,
  assetReportRemove: noAccessTokenLogger,
  authGet: defaultLogger,
  bankTransferBalanceGet: noAccessTokenLogger,
  bankTransferCancel: noAccessTokenLogger,
  bankTransferCreate: defaultLogger,
  bankTransferEventList: noAccessTokenLogger,
  bankTransferEventSync: noAccessTokenLogger,
  bankTransferGet: noAccessTokenLogger,
  bankTransferList: noAccessTokenLogger,
  bankTransferMigrateAccount: noAccessTokenLogger,
  categoriesGet: noAccessTokenLogger,
  depositSwitchAltCreate: noAccessTokenLogger,
  depositSwitchCreate: noAccessTokenLogger,
  depositSwitchGet: noAccessTokenLogger,
  depositSwitchTokenCreate: noAccessTokenLogger,
  employersSearch: noAccessTokenLogger,
  transactionsGet: defaultLogger,
  identityGet: defaultLogger,
  institutionsGet: noAccessTokenLogger,
  institutionsGetById: noAccessTokenLogger,
  institutionsSearch: noAccessTokenLogger,
  investmentsHoldingsGet: defaultLogger,
  investmentsTransactionsGet: defaultLogger,
  itemAccessTokenInvalidate: defaultLogger,
  itemCreatePublicToken: defaultLogger,
  itemGet: defaultLogger,
  itemPublicTokenExchange: noAccessTokenLogger,
  itemRemove: defaultLogger,
  itemWebhookUpdate: defaultLogger,
  liabilitiesGet: defaultLogger,
  linkTokenCreate: noAccessTokenLogger,
  linkTokenGet: noAccessTokenLogger,
  paymentInitiationPaymentCreate: noAccessTokenLogger,
  paymentInitiationPaymentGet: noAccessTokenLogger,
  paymentInitiationPaymentList: noAccessTokenLogger,
  paymentInitiationRecipientCreate: noAccessTokenLogger,
  paymentInitiationRecipientGet: noAccessTokenLogger,
  paymentInitiationRecipientList: noAccessTokenLogger,
  processorAuthGet: noAccessTokenLogger,
  processorBalanceGet: noAccessTokenLogger,
  processorIdentityGet: noAccessTokenLogger,
  processorStripeBankAccountTokenCreate: defaultLogger,
  processorTokenCreate: defaultLogger,
  sandboxBankTransferFireWebhook: noAccessTokenLogger,
  transactionsGet: defaultLogger,
  sandboxBankTransferSimulate: noAccessTokenLogger,
  transactionsGet: defaultLogger,
  transactionsGet: defaultLogger,
  sandboxPublicTokenCreate: noAccessTokenLogger,
  transactionsGet: defaultLogger,
  transactionsRefresh: defaultLogger,
  webhookVerificationKeyGet: noAccessTokenLogger,
  transactionsGet: defaultLogger,
  // remaining methods are only available in the sandbox environment
  sandboxItemFireWebhook: defaultLogger,
  sandboxItemResetLogin: defaultLogger,
  sandboxItemSetVerificationStatus: defaultLogger,
  sandboxProcessorTokenCreate: noAccessTokenLogger,
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
        await log(clientMethod, args, err);
        throw err;
      }
    };
  }
}

module.exports = new PlaidClientWrapper();
