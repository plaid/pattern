/**
 * @file Defines the handler for Transactions webhooks.
 * https://plaid.com/docs/#transactions-webhooks
 */

const {
  retrieveItemByPlaidItemId,
} = require('../db/queries');

const { updateTransactions }= require('../update_transactions');

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
  } = requestBody;

  const serverLogAndEmitSocket = (additionalInfo, itemId) => {
    console.log(
      `WEBHOOK: TRANSACTIONS: ${webhookCode}: Plaid_item_id ${plaidItemId}: ${additionalInfo}`
    );
    // use websocket to notify the client that a webhook has been received and handled
    if (webhookCode) io.emit(webhookCode, { itemId });
  };

  switch (webhookCode) {
    case 'SYNC_UPDATES_AVAILABLE': {
      // Fired when new transactions data becomes available.
      const {
        addedCount,
        modifiedCount,
        removedCount,
      } = await updateTransactions(plaidItemId);
      const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
      serverLogAndEmitSocket(`Transactions: ${addedCount} added, ${modifiedCount} modified, ${removedCount} removed`, itemId);
      break;
    }
    case 'DEFAULT_UPDATE':
    case 'INITIAL_UPDATE':
    case 'HISTORICAL_UPDATE':
      /* ignore - not needed if using sync endpoint + webhook */
      break;
    default:
      serverLogAndEmitSocket(`unhandled webhook type received.`, plaidItemId);
  }
};

module.exports = handleTransactionsWebhook;
