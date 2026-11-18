/**
 * @file Defines a helper that turns a public token from Link into a stored Item.
 */

const plaid = require('./plaid');
const { createItem } = require('./db/queries');
const updateTransactions = require('./update_transactions');

/**
 * Exchanges a public token for an access token, stores the new Item, and starts
 * the initial transactions sync for it.
 *
 * @param {Object} params
 * @param {string} params.publicToken the public token for the new Item.
 * @param {string} params.institutionId the Plaid institution ID of the new Item.
 * @param {number} params.userId the ID of the user who linked the Item.
 * @param {Object} params.io a socket.io server instance.
 * @returns {Object} the new Item.
 */
const exchangePublicToken = async ({
  publicToken,
  institutionId,
  userId,
  io,
}) => {
  // exchange the public token for a private access token and store with the item.
  const response = await plaid.itemPublicTokenExchange({
    public_token: publicToken,
  });
  const accessToken = response.data.access_token;
  const itemId = response.data.item_id;
  const newItem = await createItem(institutionId, accessToken, itemId, userId);

  // Make an initial call to fetch transactions and enable SYNC_UPDATES_AVAILABLE webhook sending
  // for this item.
  updateTransactions(itemId)
    .then(() => {
      // Notify frontend to reflect any transactions changes.
      io.emit('NEW_TRANSACTIONS_DATA', { itemId: newItem.id });
    })
    .catch(err =>
      console.error(
        `Error updating transactions for new item ${itemId}: ${err.message}`
      )
    );

  return newItem;
};

module.exports = exchangePublicToken;
