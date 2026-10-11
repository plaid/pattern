/**
 * @file Defines the handler for Item webhooks.
 * https://plaid.com/docs/#item-webhooks
 */

const {
  updateItemStatus,
  retrieveItemByPlaidItemId,
} = require('../db/queries');

/**
 * Handles Item errors received from item webhooks. When an error is received
 * different operations are needed to update an item based on the the error_code
 * that is encountered.
 *
 * @param {number} itemId the (local) ID of an item.
 * @param {Object} error the error received from the webhook.
 */
const itemErrorHandler = async (itemId, error) => {
  const { error_code: errorCode } = error;
  switch (errorCode) {
    case 'ITEM_LOGIN_REQUIRED':
      await updateItemStatus(itemId, 'bad');
      break;
    default:
      console.log(`WEBHOOK: ITEMS: item id ${itemId}: unhandled ITEM error`);
  }
};

/**
 * Handles all Item webhook events.
 *
 * @param {Object} requestBody the request body of an incoming webhook event.
 * @param {Object} io a socket.io server instance.
 */
const itemsHandler = async (requestBody, io) => {
  const {
    webhook_code: webhookCode,
    item_id: plaidItemId,
    error,
  } = requestBody;

  const serverLogAndEmitSocket = (additionalInfo, itemId, errorCode) => {
    console.log(
      `WEBHOOK: ITEMS: ${webhookCode}: Plaid item id ${plaidItemId}: ${additionalInfo}`
    );
    // use websocket to notify the client that a webhook has been received and handled
    if (webhookCode) io.emit(webhookCode, { itemId, errorCode });
  };

  // The item may have been deleted locally while Plaid still delivers webhooks
  // for it (see the same guard in plaid.js). If it's gone, there's nothing to
  // update, so ignore the webhook rather than crashing on a missing row.
  const item = await retrieveItemByPlaidItemId(plaidItemId);
  if (item == null) {
    console.log(
      `WEBHOOK: ITEMS: ${webhookCode}: no local item for Plaid item id ${plaidItemId}; ignoring`
    );
    return;
  }
  const { id: itemId } = item;

  switch (webhookCode) {
    case 'WEBHOOK_UPDATE_ACKNOWLEDGED':
      serverLogAndEmitSocket('is updated', itemId);
      break;
    case 'ERROR':
      await itemErrorHandler(itemId, error);
      serverLogAndEmitSocket(
        `ERROR: ${error.error_code}: ${error.error_message}`,
        itemId,
        error.error_code
      );
      break;
    case 'PENDING_EXPIRATION':
    case 'PENDING_DISCONNECT':
      await updateItemStatus(itemId, 'bad');
      serverLogAndEmitSocket(
        `user needs to re-enter login credentials`,
        itemId
      );
      break;
    default:
      serverLogAndEmitSocket('unhandled webhook type received.', itemId);
  }
};

module.exports = itemsHandler;
