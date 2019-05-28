/**
 * @file Exports the queries for interacting with the database.
 */

const {
  createAccounts,
  retrieveAccountId,
  retrieveAccountsByItemId,
  retrieveAccountsByUserId,
} = require('./accounts');
const {
  createItem,
  deleteItem,
  retrieveAccessTokenByPlaidItemId,
  retrieveAccessTokenByItemId,
  retrieveItemByPlaidInstitutionId,
  retrieveItemId,
  retrieveItemsById,
  retrieveItemsByUser,
  updateItemStatus,
} = require('./items');
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
  retrieveAccessTokensByUserId,
  retrieveUserByUserId,
  retrieveUserByUsername,
} = require('./users');

module.exports = {
  // accounts
  createAccounts,
  retrieveAccountId,
  retrieveAccountsByItemId,
  retrieveAccountsByUserId,
  // items
  createItem,
  deleteItem,
  retrieveAccessTokenByPlaidItemId,
  retrieveAccessTokenByItemId,
  retrieveItemByPlaidInstitutionId,
  retrieveItemId,
  retrieveItemsById,
  retrieveItemsByUser,
  updateItemStatus,
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
  retrieveUserByUserId,
  retrieveUserByUsername,
  retrieveAccessTokensByUserId,
  retrieveUsers,
};
