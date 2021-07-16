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
  createTransactions,
  retrieveTransactionsByAccountId,
  retrieveTransactionsByItemId,
  retrieveTransactionsByUserId,
  retrieveTransactionsInDateRange,
  deleteTransactions,
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
  createTransactions,
  retrieveTransactionsByAccountId,
  retrieveTransactionsByItemId,
  retrieveTransactionsByUserId,
  retrieveTransactionsInDateRange,
  deleteTransactions,
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
