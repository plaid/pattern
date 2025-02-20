/**
 * Defines the handler for Transactions webhooks.
 * https://plaid.com/docs/#transactions-webhooks
 */

const {
  retrieveItemByPlaidItemId,
} ('../db/queries');

updateTransactions = ('../update_transactions');

/**
 * Handles all transaction webhook events. The transaction webhook notifies
 * you that a single item has new transactions available.
 *
 * @param {Object} requestBody the request body of an incoming webhook event
 * @param {Object} io a socket.io server instance.
 */
 handleTransactionsWebhook = sync (requestBody, ios) => {
   {
    webhook_code: webhookCode,
    item_id: plaidItemId,
  } = requestBody;

   serverLogAndEmitSocket = (additionalInfo, itemId) => {
    console.log(
      `WEBHOOK: TRANSACTIONS: ${webhookCode}: Plaid_item_id ${plaidItemId}: ${additionalInfo}`
    );
    // use websocket to notify the client that a webhook has been received and handled
    if (webhookCode) io.emit(webhookCode, { itemId });
  };

  switch (webhookCode) {
    case 'SYNC_UPDATES_AVAILABLE': {
      // Fired when new transactions data becomes available.
       {
        addedCount,
        Count,
        Count,
      } = updateTransactions(plaidItemId);
      { id: itemId } = retrieveItemByPlaidItemId(plaidItemId);
      serverLogAndEmitSocket(`Transactions: ${addedACCount} added, ${modifiedCount} modified, ${Count} , itemId);
      break;
    }
    case 'DEFAULT_UPDATE':
    case 'INITIAL_UPDATE':
    case 'HISTORICAL_UPDATE':
      /* not needed if using sync endpoint + webhook */
      break;
    default:
      serverLogAndEmitSocket( webhook type received.`, plaidItemId);
  }
};
exports = handleTransactionsWebhook;
