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
  updateItemTransactionsCursor,
} = require('./items');
const { createPlaidApiEvent } = require('./plaidApiEvents');
const {
  createOrUpdateTransactions,
  retrieveTransactionsByAccountId,
  retrieveTransactionsByItemId,
  retrieveTransactionsByUserId,
  deleteTransactions,
  updateLabel,
} = require('./transactions');
const {
  createUser,
  deleteUsers,
  retrieveUsers,
  retrieveUserById,
  retrieveUserByUsername,
} = require('./users');
const { createLinkEvent } = require('./linkEvents');

const {
  createAsset,
  retrieveAssetsByUser,
  deleteAssetByAssetId,
} = require('./assets');

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
  // transactions
  retrieveTransactionsByAccountId,
  retrieveTransactionsByItemId,
  retrieveTransactionsByUserId,
  deleteTransactions,
  createOrUpdateTransactions,
  updateItemTransactionsCursor,
  updateLabel,
  // users
  createUser,
  deleteUsers,
  retrieveUserById,
  retrieveUserByUsername,
  retrieveUsers,
  // assets
  createAsset,
  retrieveAssetsByUser,
  deleteAssetByAssetId,
  // link events
  createLinkEvent,
};
