/**
 * @file Defines the handler for Transactions webhooks.
 * https://plaid.com/docs/#transactions-webhooks
 */

const moment = require('moment');
const plaid = require('../plaid');
const {
  retrieveItemByPlaidItemId,
  createAccounts,
  createTransactions,
  deleteTransactions,
  retrieveTransactionsInDateRange,
} = require('../db/queries');

/**
 * Fetches transactions from the Plaid API for a given item.
 *
 * @param {string} plaidItemId the Plaid ID for the item.
 * @param {string} startDate date string in the format 'YYYY-MM-DD'.
 * @param {string} endDate date string in the format 'YYYY-MM-DD'.
 * @returns {Object{}} an object containing transactions and accounts.
 */
const fetchTransactions = async (plaidItemId, startDate, endDate) => {
  // the transactions endpoint is paginated, so we may need to hit it multiple times to
  // retrieve all available transactions.

  try {
    // get the access token based on the plaid item id
    const { plaid_access_token: accessToken } = await retrieveItemByPlaidItemId(
      plaidItemId
    );

    let offset = 0;
    let transactionsToFetch = true;
    let resultData = { transactions: [], accounts: [] };
    const batchSize = 100;
    /* eslint-disable no-await-in-loop */
    while (transactionsToFetch) {
      // fetch the transactions
      const configs = {
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        options: {
          count: batchSize,
          offset: offset,
        },
      };
      const response = await plaid.transactionsGet(configs);
      const transactions = response.data.transactions;
      const accounts = response.data.accounts;

      resultData = {
        transactions: [...resultData.transactions, ...transactions],
        accounts,
      };

      if (transactions.length === batchSize) {
        offset += batchSize;
      } else {
        transactionsToFetch = false;
      }
    }
    /* eslint-enable no-await-in-loop */
    return resultData;
  } catch (err) {
    console.error(`Error fetching transactions: ${err.message}`);
    return { transactions: [], accounts: [] };
  }
};

/**
 * Handles the fetching and storing of new transactions in response to an update webhook.
 *
 * @param {string} plaidItemId the Plaid ID for the item.
 * @param {string} startDate the earliest date to retrieve ('YYYY-MM-DD').
 * @param {string} endDate the latest date to retrieve ('YYYY-MM-DD').
 */
const handleTransactionsUpdate = async (plaidItemId, startDate, endDate) => {
  // Fetch new transactions from plaid api.
  const {
    transactions: incomingTransactions,
    accounts,
  } = await fetchTransactions(plaidItemId, startDate, endDate);

  // Retrieve existing transactions from our db.
  const existingTransactions = await retrieveTransactionsInDateRange(
    plaidItemId,
    startDate,
    endDate
  );

  // Compare to find new transactions.
  const existingTransactionIds = existingTransactions.reduce(
    (idMap, { plaid_transaction_id: transactionId }) => ({
      ...idMap,
      [transactionId]: transactionId,
    }),
    {}
  );
  const transactionsToStore = incomingTransactions.filter(
    ({ transaction_id: transactionId }) => {
      const isExisting = existingTransactionIds[transactionId];
      return !isExisting;
    }
  );

  // Compare to find removed transactions (pending transactions that have posted or cancelled).
  const incomingTransactionIds = incomingTransactions.reduce(
    (idMap, { transaction_id: transactionId }) => ({
      ...idMap,
      [transactionId]: transactionId,
    }),
    {}
  );
  const transactionsToRemove = existingTransactions.filter(
    ({ plaid_transaction_id: transactionId }) => {
      const isIncoming = incomingTransactionIds[transactionId];
      return !isIncoming;
    }
  );

  // Update the DB.
  await createAccounts(plaidItemId, accounts);
  await createTransactions(transactionsToStore);
  await deleteTransactions(transactionsToRemove);
};

/**
 * Handles all transaction webhook events. The transaction webhook notifies
 * you that a single item has new transactions available.
 *
 * @param {Object} requestBody the request body of an incoming webhook event
 * @param {Object} io a socket.io server instance.
 */
const handleTransactionsWebhook = async (requestBody, io) => {
  const {
    webhook_code: webhookCode,
    item_id: plaidItemId,
    new_transactions: newTransactions,
    removed_transactions: removedTransactions,
  } = requestBody;

  const serverLogAndEmitSocket = (additionalInfo, itemId) => {
    console.log(
      `WEBHOOK: TRANSACTIONS: ${webhookCode}: Plaid_item_id ${plaidItemId}: ${additionalInfo}`
    );
    // use websocket to notify the client that a webhook has been received and handled
    if (webhookCode) io.emit(webhookCode, { itemId });
  };

  switch (webhookCode) {
    case 'INITIAL_UPDATE': {
      // Fired when an Item's initial transaction pull is completed.
      // Note: The default pull is 30 days.
      const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
      const endDate = moment().format('YYYY-MM-DD');
      await handleTransactionsUpdate(plaidItemId, startDate, endDate);
      const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
      serverLogAndEmitSocket(`${newTransactions} transactions to add.`, itemId);
      break;
    }
    case 'HISTORICAL_UPDATE': {
      // Fired when an Item's historical transaction pull is completed. Plaid fetches as much
      // data as is available from the financial institution.
      const startDate = moment().subtract(2, 'years').format('YYYY-MM-DD');
      const endDate = moment().format('YYYY-MM-DD');
      await handleTransactionsUpdate(plaidItemId, startDate, endDate);
      const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
      serverLogAndEmitSocket(`${newTransactions} transactions to add.`, itemId);
      break;
    }
    case 'DEFAULT_UPDATE': {
      // Fired when new transaction data is available as Plaid performs its regular updates of
      // the Item. Since transactions may take several days to post, we'll fetch 14 days worth of
      // transactions from Plaid and reconcile them with the transactions we already have stored.
      const startDate = moment().subtract(14, 'days').format('YYYY-MM-DD');
      const endDate = moment().format('YYYY-MM-DD');
      await handleTransactionsUpdate(plaidItemId, startDate, endDate);
      const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
      serverLogAndEmitSocket(`${newTransactions} transactions to add.`, itemId);
      break;
    }
    case 'TRANSACTIONS_REMOVED': {
      // Fired when posted transaction(s) for an Item are deleted. The deleted transaction IDs
      // are included in the webhook payload.
      await deleteTransactions(removedTransactions);
      const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
      serverLogAndEmitSocket(
        `${removedTransactions.length} transactions to remove.`,
        itemId
      );
      break;
    }
    default:
      serverLogAndEmitSocket(`unhandled webhook type received.`, plaidItemId);
  }
};

module.exports = handleTransactionsWebhook;
