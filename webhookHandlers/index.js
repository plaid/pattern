/**
 * @file Defines the handlers for various types of webhooks.
 */

const handleItemWebhook = require('./handleItemWebhook');
const handleTransactionsWebhook = require('./handleTransactionsWebhook');
const unhandledWebhook = require('./unhandledWebhook');

module.exports = {
  handleItemWebhook,
  handleTransactionsWebhook,
  unhandledWebhook,
};
