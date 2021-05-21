"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * @file Defines the queries for the transactions table.
 */
var _require = require('./accounts'),
    retrieveAccountByPlaidAccountId = _require.retrieveAccountByPlaidAccountId;

var db = require('../');
/**
 * Creates multiple transactions.
 *
 * @param {Object[]} transactions an array of transactions.
 */


var createTransactions = function createTransactions(transactions) {
  var pendingQueries;
  return regeneratorRuntime.async(function createTransactions$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          pendingQueries = transactions.map(function _callee(transaction) {
            var plaidAccountId, plaidTransactionId, plaidCategoryId, categories, transactionType, transactionName, amount, isoCurrencyCode, unofficialCurrencyCode, transactionDate, pending, accountOwner, _ref, accountId, _categories, category, subcategory, query;

            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    plaidAccountId = transaction.account_id, plaidTransactionId = transaction.transaction_id, plaidCategoryId = transaction.category_id, categories = transaction.category, transactionType = transaction.transaction_type, transactionName = transaction.name, amount = transaction.amount, isoCurrencyCode = transaction.iso_currency_code, unofficialCurrencyCode = transaction.unofficial_currency_code, transactionDate = transaction.date, pending = transaction.pending, accountOwner = transaction.account_owner;
                    _context.next = 3;
                    return regeneratorRuntime.awrap(retrieveAccountByPlaidAccountId(plaidAccountId));

                  case 3:
                    _ref = _context.sent;
                    accountId = _ref.id;
                    _categories = _slicedToArray(categories, 2), category = _categories[0], subcategory = _categories[1];
                    _context.prev = 6;
                    query = {
                      text: "\n          INSERT INTO transactions_table\n            (\n              account_id,\n              plaid_transaction_id,\n              plaid_category_id,\n              category,\n              subcategory,\n              type,\n              name,\n              amount,\n              iso_currency_code,\n              unofficial_currency_code,\n              date,\n              pending,\n              account_owner\n            )\n          VALUES\n            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);\n        ",
                      values: [accountId, plaidTransactionId, plaidCategoryId, category, subcategory, transactionType, transactionName, amount, isoCurrencyCode, unofficialCurrencyCode, transactionDate, pending, accountOwner]
                    };
                    _context.next = 10;
                    return regeneratorRuntime.awrap(db.query(query));

                  case 10:
                    _context.next = 15;
                    break;

                  case 12:
                    _context.prev = 12;
                    _context.t0 = _context["catch"](6);
                    // this is most likely a duplicate transaction, so we'll ignore it.
                    console.log("Skipping duplicate transaction ".concat(plaidTransactionId));

                  case 15:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[6, 12]]);
          });
          _context2.next = 3;
          return regeneratorRuntime.awrap(Promise.all(pendingQueries));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};
/**
 * Retrieves all transactions for a single account.
 *
 * @param {number} accountId the ID of the account.
 * @returns {Object[]} an array of transactions.
 */


var retrieveTransactionsByAccountId = function retrieveTransactionsByAccountId(accountId) {
  var query, _ref2, transactions;

  return regeneratorRuntime.async(function retrieveTransactionsByAccountId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          query = {
            text: 'SELECT * FROM transactions WHERE account_id = $1 ORDER BY date DESC',
            values: [accountId]
          };
          _context3.next = 3;
          return regeneratorRuntime.awrap(db.query(query));

        case 3:
          _ref2 = _context3.sent;
          transactions = _ref2.rows;
          return _context3.abrupt("return", transactions);

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
};
/**
 * Retrieves all transactions for a single item.
 *
 *
 * @param {number} itemId the ID of the item.
 * @returns {Object[]} an array of transactions.
 */


var retrieveTransactionsByItemId = function retrieveTransactionsByItemId(itemId) {
  var query, _ref3, transactions;

  return regeneratorRuntime.async(function retrieveTransactionsByItemId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          query = {
            text: 'SELECT * FROM transactions WHERE item_id = $1 ORDER BY date DESC',
            values: [itemId]
          };
          _context4.next = 3;
          return regeneratorRuntime.awrap(db.query(query));

        case 3:
          _ref3 = _context4.sent;
          transactions = _ref3.rows;
          return _context4.abrupt("return", transactions);

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
};
/**
 * Retrieves all transactions for a single user.
 *
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of transactions.
 */


var retrieveTransactionsByUserId = function retrieveTransactionsByUserId(userId) {
  var query, _ref4, transactions;

  return regeneratorRuntime.async(function retrieveTransactionsByUserId$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          query = {
            text: 'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
            values: [userId]
          };
          _context5.next = 3;
          return regeneratorRuntime.awrap(db.query(query));

        case 3:
          _ref4 = _context5.sent;
          transactions = _ref4.rows;
          return _context5.abrupt("return", transactions);

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
};
/**
 * Retrieves all transactions for a single item within a specified date range.
 *
 * @TODO combine with `retrieveTransactionsByUserId` by formatting the query to allow startDate and endDate to be nullable.
 * @TODO refactor to use item_id instead of plaid_item_id so it can be removed from the view
 *
 * @param {string} plaidItemId the Plaid ID for the item.
 * @param {string} startDate the earliest date to retrieve ('YYYY-MM-DD').
 * @param {string} endDate the latest date to retrieve ('YYYY-MM-DD').
 * @returns {Object[]} an array of transactions.
 */


var retrieveTransactionsInDateRange = function retrieveTransactionsInDateRange(plaidItemId, startDate, endDate) {
  var query, _ref5, transactions;

  return regeneratorRuntime.async(function retrieveTransactionsInDateRange$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          query = {
            text: "\n      SELECT\n        *\n      FROM\n        transactions\n      WHERE\n        plaid_item_id = $1\n        AND date >= $2\n        AND date <= $3\n      ORDER BY\n        date DESC;\n    ",
            values: [plaidItemId, startDate, endDate]
          };
          _context6.next = 3;
          return regeneratorRuntime.awrap(db.query(query));

        case 3:
          _ref5 = _context6.sent;
          transactions = _ref5.rows;
          return _context6.abrupt("return", transactions);

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
};
/**
 * Removes one or more transactions.
 *
 * @param {string[]} plaidTransactionIds the Plaid IDs of the transactions.
 */


var deleteTransactions = function deleteTransactions(plaidTransactionIds) {
  var pendingQueries;
  return regeneratorRuntime.async(function deleteTransactions$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          pendingQueries = plaidTransactionIds.map(function _callee2(transactionId) {
            var query;
            return regeneratorRuntime.async(function _callee2$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    query = {
                      text: 'DELETE FROM transactions_table WHERE plaid_transaction_id = $1',
                      values: [transactionId]
                    };
                    _context7.next = 3;
                    return regeneratorRuntime.awrap(db.query(query));

                  case 3:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          });
          _context8.next = 3;
          return regeneratorRuntime.awrap(Promise.all(pendingQueries));

        case 3:
        case "end":
          return _context8.stop();
      }
    }
  });
};

module.exports = {
  createTransactions: createTransactions,
  retrieveTransactionsByAccountId: retrieveTransactionsByAccountId,
  retrieveTransactionsByItemId: retrieveTransactionsByItemId,
  retrieveTransactionsByUserId: retrieveTransactionsByUserId,
  retrieveTransactionsInDateRange: retrieveTransactionsInDateRange,
  deleteTransactions: deleteTransactions
};