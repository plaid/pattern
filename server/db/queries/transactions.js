/**
 * @file Defines the queries for the transactions table.
 */

const { retrieveAccountByPlaidAccountId } = require('./accounts');
const db = require('../');

/**
 * Creates multiple transactions.
 *
 * @param {Object[]} transactions an array of transactions.
 */
const createTransactions = async transactions => {
  const pendingQueries = transactions.map(async transaction => {
    const {
      account_id: plaidAccountId,
      transaction_id: plaidTransactionId,
      category_id: plaidCategoryId,
      category: categories,
      transaction_type: transactionType,
      name: transactionName,
      amount,
      iso_currency_code: isoCurrencyCode,
      unofficial_currency_code: unofficialCurrencyCode,
      date: transactionDate,
      pending,
      account_owner: accountOwner,
    } = transaction;
    const { id: accountId } = await retrieveAccountByPlaidAccountId(
      plaidAccountId
    );
    const [category, subcategory] = categories;
    try {
      const query = {
        text: `
          INSERT INTO transactions_table
            (
              account_id,
              plaid_transaction_id,
              plaid_category_id,
              category,
              subcategory,
              type,
              name,
              amount,
              iso_currency_code,
              unofficial_currency_code,
              date,
              pending,
              account_owner
            )
          VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
        `,
        values: [
          accountId,
          plaidTransactionId,
          plaidCategoryId,
          category,
          subcategory,
          transactionType,
          transactionName,
          amount,
          isoCurrencyCode,
          unofficialCurrencyCode,
          transactionDate,
          pending,
          accountOwner,
        ],
      };
      await db.query(query);
    } catch (err) {
      // this is most likely a duplicate transaction, so we'll ignore it.
      console.log(`Skipping duplicate transaction ${plaidTransactionId}`);
    }
  });
  await Promise.all(pendingQueries);
};

/**
 * Retrieves all transactions for a single account.
 *
 * @param {number} accountId the ID of the account.
 * @returns {Object[]} an array of transactions.
 */
const retrieveTransactionsByAccountId = async accountId => {
  const query = {
    text: 'SELECT * FROM transactions WHERE account_id = $1 ORDER BY date DESC',
    values: [accountId],
  };
  const { rows: transactions } = await db.query(query);
  return transactions;
};

/**
 * Retrieves all transactions for a single item.
 *
 *
 * @param {number} itemId the ID of the item.
 * @returns {Object[]} an array of transactions.
 */
const retrieveTransactionsByItemId = async itemId => {
  const query = {
    text: 'SELECT * FROM transactions WHERE item_id = $1 ORDER BY date DESC',
    values: [itemId],
  };
  const { rows: transactions } = await db.query(query);
  return transactions;
};

/**
 * Retrieves all transactions for a single user.
 *
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of transactions.
 */
const retrieveTransactionsByUserId = async userId => {
  const query = {
    text: 'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
    values: [userId],
  };
  const { rows: transactions } = await db.query(query);
  return transactions;
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
const retrieveTransactionsInDateRange = async (
  plaidItemId,
  startDate,
  endDate
) => {
  const query = {
    text: `
      SELECT
        *
      FROM
        transactions
      WHERE
        plaid_item_id = $1
        AND date >= $2
        AND date <= $3
      ORDER BY
        date DESC;
    `,
    values: [plaidItemId, startDate, endDate],
  };
  const { rows: transactions } = await db.query(query);
  return transactions;
};

/**
 * Removes one or more transactions.
 *
 * @param {string[]} plaidTransactionIds the Plaid IDs of the transactions.
 */
const deleteTransactions = async plaidTransactionIds => {
  const pendingQueries = plaidTransactionIds.map(async transactionId => {
    const query = {
      text: 'DELETE FROM transactions_table WHERE plaid_transaction_id = $1',
      values: [transactionId],
    };
    await db.query(query);
  });
  await Promise.all(pendingQueries);
};

module.exports = {
  createTransactions,
  retrieveTransactionsByAccountId,
  retrieveTransactionsByItemId,
  retrieveTransactionsByUserId,
  retrieveTransactionsInDateRange,
  deleteTransactions,
};
