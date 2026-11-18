/**
 * @file Defines the handler for Link webhooks.
 * https://plaid.com/docs/api/link/#webhooks
 */

const addLinkSessionItems = require('../add_link_session_items');

/**
 * Handles Link webhook events. Pattern uses SESSION_FINISHED to store the Items from a
 * Multi-Item Link session, since Link doesn't return their public tokens to onSuccess.
 *
 * @param {Object} requestBody the request body of an incoming webhook event.
 * @param {Object} io a socket.io server instance.
 */
const linkHandler = async (requestBody, io) => {
  const {
    webhook_code: webhookCode,
    link_token: linkToken,
    public_tokens: publicTokens = [],
  } = requestBody;

  if (webhookCode !== 'SESSION_FINISHED' || publicTokens.length === 0) {
    console.log(`WEBHOOK: LINK: ${webhookCode}: no action needed`);
    return;
  }

  const userId = await addLinkSessionItems(linkToken, io);
  if (userId == null) {
    console.log(`WEBHOOK: LINK: SESSION_FINISHED: unknown user; ignoring`);
    return;
  }

  // use websocket to notify the client that the new Items are ready to display.
  io.emit('SESSION_FINISHED', { userId });
};

module.exports = linkHandler;
