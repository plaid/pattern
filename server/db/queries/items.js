/**
 * @file Defines the queries for the items table/view.
 */

const db = require('../');

/**
 * Creates a single item.
 *
 * @param {string} plaidInstitutionId the Plaid institution ID of the item.
 * @param {string} plaidAccessToken the Plaid access token of the item.
 * @param {string} plaidItemId the Plaid ID of the item.
 * @param {number} userId the ID of the user.
 * @returns {Object} the new item.
 */
const createItem = async (
  plaidInstitutionId,
  plaidAccessToken,
  plaidItemId,
  userId
) => {
  // this method only gets called on successfully linking an item.
  // We know the status is good.
  const status = 'good';
  const query = {
    // RETURNING is a Postgres-specific clause that returns a list of the inserted items.
    text: `
      INSERT INTO items_table
        (user_id, plaid_access_token, plaid_item_id, plaid_institution_id, status)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        *;
    `,
    values: [userId, plaidAccessToken, plaidItemId, plaidInstitutionId, status],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

/**
 * Retrieves a single item.
 *
 * @param {number} itemId the ID of the item.
 * @returns {Object} an item.
 */
const retrieveItemById = async itemId => {
  const query = {
    text: 'SELECT * FROM items WHERE id = $1',
    values: [itemId],
  };
  const { rows } = await db.query(query);
  // since item IDs are unique, this query will never return more than one row.
  return rows[0];
};

/**
 * Retrieves a single item.
 *
 * @param {string} accessToken the Plaid access token of the item.
 * @returns {Object} the item.
 */
const retrieveItemByPlaidAccessToken = async accessToken => {
  const query = {
    text: 'SELECT * FROM items WHERE plaid_access_token = $1',
    values: [accessToken],
  };
  const { rows: existingItems } = await db.query(query);
  // Access tokens are unique, so this will return at most one item.
  return existingItems[0];
};

/**
 * Retrieves a single item.
 *
 * @param {string} plaidInstitutionId the Plaid institution ID of the item.
 * @param {number} userId the ID of the user.
 * @returns {Object} an item.
 */
const retrieveItemByPlaidInstitutionId = async (plaidInstitutionId, userId) => {
  const query = {
    text:
      'SELECT * FROM items WHERE plaid_institution_id = $1 AND user_id = $2',
    values: [plaidInstitutionId, userId],
  };
  const { rows: existingItems } = await db.query(query);
  return existingItems[0];
};

/**
 * Retrieves a single item.
 *
 * @param {string} plaidItemId the Plaid ID of the item.
 * @returns {Object} an item.
 */
const retrieveItemByPlaidItemId = async plaidItemId => {
  const query = {
    text: 'SELECT * FROM items WHERE plaid_item_id = $1',
    values: [plaidItemId],
  };
  const { rows } = await db.query(query);
  // since Plaid item IDs are unique, this query will never return more than one row.
  return rows[0];
};

/**
 * Retrieves all items for a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of items.
 */
const retrieveItemsByUser = async userId => {
  const query = {
    text: 'SELECT * FROM items WHERE user_id = $1',
    values: [userId],
  };
  const { rows: items } = await db.query(query);
  return items;
};

/**
 * Updates the status for a single item.
 *
 * @param {string} itemId the Plaid item ID of the item.
 * @param {string} status the status of the item.
 */
const updateItemStatus = async (itemId, status) => {
  const query = {
    text: 'UPDATE items SET status = $1 WHERE id = $2',
    values: [status, itemId],
  };
  await db.query(query);
};

/**
 * Updates the transaction cursor for a single item.
 *
 * @param {string} plaidItemId the Plaid item ID of the item.
 * @param {string} transactionsCursor latest observed transactions cursor on this item.
 */
 const updateItemTransactionsCursor = async (plaidItemId, transactionsCursor) => {
  const query = {
    text: 'UPDATE items SET transactions_cursor = $1 WHERE plaid_item_id = $2',
    values: [transactionsCursor, plaidItemId],
  };
  await db.query(query);
};

/**
 * Removes a single item. The database will also remove related accounts and transactions.
 *
 * @param {string} itemId the id of the item.
 */
const deleteItem = async itemId => {
  const query = {
    text: `DELETE FROM items_table WHERE id = $1`,
    values: [itemId],
  };
  await db.query(query);
};

module.exports = {
  createItem,
  deleteItem,
  retrieveItemById,
  retrieveItemByPlaidAccessToken,
  retrieveItemByPlaidInstitutionId,
  retrieveItemByPlaidItemId,
  retrieveItemsByUser,
  updateItemStatus,
  updateItemTransactionsCursor,
};