/**
 * @file Defines the queries for the transactions table.
 */

const { retrieveAccountByPlaidAccountId } = require('./accounts');
const db = require('../');

/**
 * Creates or updates multiple transactions.
 *
 * @param {Object[]} transactions an array of transactions.
 */
const createOrUpdateTransactions = async transactions => {
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
      label,
	    personal_finance_category: { primary: primaryCategory, detailed: detailedCategory, confidence_level: confidenceLevel },
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
			        primary_category,
			        detailed_category,
			        confidence_level,
              account_owner
            )
          VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (plaid_transaction_id) DO UPDATE 
            SET 
              plaid_category_id = EXCLUDED.plaid_category_id,
              category = EXCLUDED.category,
              subcategory = EXCLUDED.subcategory,
              type = EXCLUDED.type,
              name = EXCLUDED.name,
              amount = EXCLUDED.amount,
              iso_currency_code = EXCLUDED.iso_currency_code,
              unofficial_currency_code = EXCLUDED.unofficial_currency_code,
              date = EXCLUDED.date,
              pending = EXCLUDED.pending,
			        primary_category = EXCLUDED.primary_category,
			        detailed_category = EXCLUDED.detailed_category,
			        confidence_level = EXCLUDED.confidence_level,
              account_owner = EXCLUDED.account_owner;
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
          primaryCategory,
          detailedCategory,
		      confidenceLevel,
          accountOwner,
        ],
      };
      await db.query(query);
    } catch (err) {
      console.error(err);
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
    text: 'SELECT * FROM transactions WHERE account_id = $1 and pending = False ORDER BY date DESC',
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
    text: 'SELECT * FROM transactions WHERE item_id = $1 and pending = False ORDER BY date DESC',
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
    text: 'SELECT * FROM transactions WHERE user_id = $1 and pending = False ORDER BY date DESC',
    values: [userId],
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

/**
 * Update label of a single transaction.
 *
 * @param {number} id - The ID of the transaction.
 * @param {string | null} newLabel - The new label for the transaction.
 */
const updateLabel = async (id, newLabel) => {
  const query = {
    text: 'UPDATE transactions_table SET label = $1 WHERE id = $2',
    values: [newLabel, id],
  };
  await db.query(query);
};

module.exports = {
  createOrUpdateTransactions,
  retrieveTransactionsByAccountId,
  retrieveTransactionsByItemId,
  retrieveTransactionsByUserId,
  deleteTransactions,
  updateLabel,
};
