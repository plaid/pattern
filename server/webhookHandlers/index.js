/**
 * @file Defines the handlers for various types of webhooks.
 */

const handleItemWebhook = require('./handleItemWebhook');
const unhandledWebhook = require('./unhandledWebhook');

module.exports = {
  handleItemWebhook,
  unhandledWebhook,
};
