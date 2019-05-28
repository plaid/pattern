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
    text: `
      INSERT INTO items_table
        (user_id, plaid_access_token, plaid_item_id, plaid_institution_id, status)
      VALUES
        ($1, $2, $3, $4, $5);
    `,
    values: [userId, plaidAccessToken, plaidItemId, plaidInstitutionId, status],
  };
  await db.query(query);
};

/**
 * Retrieves the Plaid access token for an item.
 *
 * @param {string} plaidItemId the Plaid ID of the item.
 * @returns {string} the Plaid access token.
 */
const retrieveAccessTokenByPlaidItemId = async plaidItemId => {
  const query = {
    text: 'SELECT plaid_access_token FROM items WHERE plaid_item_id = $1;',
    values: [plaidItemId],
  };
  const { rows } = await db.query(query);
  // since Plaid item IDs are unique, this query will never return more than one row.
  const accessToken = rows[0].plaid_access_token;
  return accessToken;
};

/**
 * Retrieves the Plaid access token for an item.
 *
 * @param {string} itemId  of the item.
 * @returns {string} the Plaid access token.
 */
const retrieveAccessTokenByItemId = async itemId => {
  const query = {
    text: 'SELECT plaid_access_token FROM items WHERE id = $1;',
    values: [itemId],
  };
  const { rows } = await db.query(query);
  // since Plaid item IDs are unique, this query will never return more than one row.
  const accessToken = rows[0].plaid_access_token;
  return accessToken;
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
 * Retrieves the item ID for a single item.
 *
 * @param {string} plaidItemId the Plaid ID of the item.
 * @returns {number} the item ID.
 */
const retrieveItemId = async plaidItemId => {
  const query = 'SELECT (id) FROM items WHERE plaid_item_id = $1';
  const { rows } = await db.query(query, [plaidItemId]);
  // since Plaid item IDs are unique, this query will never return more than one row.
  const itemId = rows[0].id;
  return itemId;
};

/**
 * Retrieves all stored items for a given item ID.
 *
 * @param {number} itemId the ID of the item.
 * @returns {Object[]} Array of 1 item.
 */
const retrieveItemsById = async itemId => {
  const query = {
    text: 'SELECT * FROM items WHERE id = $1',
    values: [itemId],
  };
  const { rows: items } = await db.query(query);
  return items;
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
 * Removes item, related accounts and transactions.
 * @param {string[]} itemId the Plaid IDs of the transactions.
 */
const deleteItem = async itemId => {
  const query = {
    text: `DELETE FROM items_table i WHERE i.id = $1`,
    values: [itemId],
  };
  await db.query(query);
};

module.exports = {
  createItem,
  deleteItem,
  retrieveAccessTokenByPlaidItemId,
  retrieveAccessTokenByItemId,
  retrieveItemByPlaidInstitutionId,
  retrieveItemId,
  retrieveItemsById,
  retrieveItemsByUser,
  updateItemStatus,
};
