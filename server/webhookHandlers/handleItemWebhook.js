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
 * @param {string} plaidItemId the Plaid ID of an item.
 * @param {Object} error the error received from the webhook.
 */
const itemErrorHandler = async (plaidItemId, error) => {
  const { error_code: errorCode } = error;
  switch (errorCode) {
    case 'ITEM_LOGIN_REQUIRED': {
      const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
      await updateItemStatus(itemId, 'bad');
      break;
    }
    case 'INVALID_CREDENTIALS':
    case 'INVALID_MFA':
    case 'INVALID_UPDATED_USERNAME':
    case 'ITEM_LOCKED':
    case 'ITEM_NO_ERROR':
    case 'ITEM_NOT_SUPPORTED':
    case 'ITEM_NO_VERIFICATION':
    case 'INCORRECT_DEPOSIT_AMOUNTS':
    case 'TOO_MANY_VERIFICATION_ATTEMPTS':
    case 'USER_SETUP_REQUIRED':
    case 'MFA_NOT_SUPPORTED':
    case 'NO_ACCOUNTS':
    case 'NO_AUTH_ACCOUNTS':
    case 'PRODUCT_NOT_READY':
    case 'PRODUCTS_NOT_SUPPORTED':
    default:
      console.log(
        `WEBHOOK: ITEMS: Plaid item id ${plaidItemId}: unhandled ITEM error`
      );
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

  switch (webhookCode) {
    case 'WEBHOOK_UPDATE_ACKNOWLEDGED':
      serverLogAndEmitSocket('is updated');
      break;
    case 'ERROR': {
      itemErrorHandler(plaidItemId, error);
      const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
      serverLogAndEmitSocket(
        `ERROR: ${error.error_code}: ${error.error_message}`,
        itemId,
        error.error_code
      );
      break;
    }
    default:
      serverLogAndEmitSocket('unhandled webhook type received.');
  }
};

module.exports = itemsHandler;
