/**
 * @file Exports the queries for interacting with the database.
 */

const {
  createAccounts,
  retrieveAccountByPlaidAccountId,
  retrieveAccountsByItemId,
  retrieveAccountsByUserId,
} = require('./accounts');
const {
  createItem,
  deleteItem,
  retrieveItemById,
  retrieveItemByPlaidAccessToken,
  retrieveItemByPlaidInstitutionId,
  retrieveItemByPlaidItemId,
  retrieveItemsByUser,
  updateItemStatus,
} = require('./items');
const { createPlaidApiEvent } = require('./plaidApiEvents');

const {
  createUser,
  deleteUsers,
  retrieveUsers,
  retrieveUserById,
  retrieveUserByUsername,
} = require('./users');
const { createLinkEvent } = require('./linkEvents');

module.exports = {
  // accounts
  createAccounts,
  retrieveAccountByPlaidAccountId,
  retrieveAccountsByItemId,
  retrieveAccountsByUserId,
  // items
  createItem,
  deleteItem,
  retrieveItemById,
  retrieveItemByPlaidAccessToken,
  retrieveItemByPlaidInstitutionId,
  retrieveItemByPlaidItemId,
  retrieveItemsByUser,
  updateItemStatus,
  // plaid api events
  createPlaidApiEvent,
  // users
  createUser,
  deleteUsers,
  retrieveUserById,
  retrieveUserByUsername,
  retrieveUsers,
  // link events
  createLinkEvent,
};
