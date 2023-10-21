/**
 * @file Defines the queries for the accounts table/view.
 */

const { retrieveItemByPlaidItemId } = require('./items');
const db = require('../');

/**
 * Creates multiple accounts related to a single item.
 *
 * @param {string} plaidItemId the Plaid ID of the item.
 * @param {Object[]} accounts an array of accounts.
 * @returns {Object[]} an array of new accounts.
 */
const createAccounts = async (plaidItemId, accounts) => {
  const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
  const pendingQueries = accounts.map(async account => {
    const {
      account_id: aid,
      name,
      mask,
      official_name: officialName,
      balances: {
        available: availableBalance,
        current: currentBalance,
        iso_currency_code: isoCurrencyCode,
        unofficial_currency_code: unofficialCurrencyCode,
      },
      subtype,
      type,
    } = account;
    const query = {
      // RETURNING is a Postgres-specific clause that returns a list of the inserted items.
      text: `
        INSERT INTO accounts_table
          (
            item_id,
            plaid_account_id,
            name,
            mask,
            official_name,
            current_balance,
            available_balance,
            iso_currency_code,
            unofficial_currency_code,
            type,
            subtype
          )
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT
          (plaid_account_id)
        DO UPDATE SET
          current_balance = $6,
          available_balance = $7
        RETURNING
          *
      `,
      values: [
        itemId,
        aid,
        name,
        mask,
        officialName,
        currentBalance,
        availableBalance,
        isoCurrencyCode,
        unofficialCurrencyCode,
        type,
        subtype,
      ],
    };
    const { rows } = await db.query(query);
    return rows[0];
  });
  return await Promise.all(pendingQueries);
};

/**
 * Retrieves the account associated with a Plaid account ID.
 *
 * @param {string} plaidAccountId the Plaid ID of the account.
 * @returns {Object} a single account.
 */
const retrieveAccountByPlaidAccountId = async plaidAccountId => {
  const query = {
    text: 'SELECT * FROM accounts WHERE plaid_account_id = $1',
    values: [plaidAccountId],
  };
  const { rows } = await db.query(query);
  // since Plaid account IDs are unique, this query will never return more than one row.
  return rows[0];
};

/**
 * Retrieves the accounts for a single item.
 *
 * @param {number} itemId the ID of the item.
 * @returns {Object[]} an array of accounts.
 */
const retrieveAccountsByItemId = async itemId => {
  const query = {
    text: 'SELECT * FROM accounts WHERE item_id = $1 ORDER BY id',
    values: [itemId],
  };
  const { rows: accounts } = await db.query(query);
  return accounts;
};

/**
 * Retrieves all accounts for a single user.
 *
 * @param {number} userId the ID of the user.
 *
 * @returns {Object[]} an array of accounts.
 */
const retrieveAccountsByUserId = async userId => {
  const query = {
    text: 'SELECT * FROM accounts WHERE user_id = $1 ORDER BY id',
    values: [userId],
  };
  const { rows: accounts } = await db.query(query);
  return accounts;
};

module.exports = {
  createAccounts,
  retrieveAccountByPlaidAccountId,
  retrieveAccountsByItemId,
  retrieveAccountsByUserId,
};
