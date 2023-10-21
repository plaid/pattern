/**
 * @file Defines the handler for unhandled webhook types.
 */

/**
 * Handles all unhandled/not yet implemented webhook events.
 *
 * @param {Object} requestBody the request body of an incoming webhook event
 */
const unhandledWebhook = async requestBody => {
  const {
    webhook_type: webhookType,
    webhook_code: webhookCode,
    item_id: plaidItemId,
  } = requestBody;
  console.log(
    `UNHANDLED ${webhookType} WEBHOOK: ${webhookCode}: Plaid item id ${plaidItemId}: unhandled webhook type received.`
  );
};

module.exports = unhandledWebhook;
