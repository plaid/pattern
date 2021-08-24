/**
 * @file Defines the queries for the app_funds table/views.
 */

const db = require('../');

/**
 * Creates an app fund account.
 *
 * @param {number} userId the user id of the user.
 * @returns {Object} the new app fund for the user.
 */
const createAppFund = async userId => {
  const query = {
    // RETURNING is a Postgres-specific clause that returns a list of the inserted appfunds.
    text:
      'INSERT INTO app_funds_table (user_id, balance) VALUES ($1, $2) RETURNING *;',
    values: [userId, 0],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

/**
 * Updates balance for a single user.
 *
 * @param {number} userId the ID of the user.
 * @param {number} appFundsBalance the updated balance for a user.
 */

const updateAppFundsBalance = async (userId, appFundsBalance) => {
  const query = {
    text: 'UPDATE app_funds SET balance = $1 WHERE user_id = $2',
    values: [appFundsBalance, userId],
  };
  await db.query(query);
};

/**
 * Retrieves appFunds for a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of app Funds.
 */
const retrieveAppFundsByUser = async userId => {
  const query = {
    text: 'SELECT * FROM app_funds WHERE user_id = $1',
    values: [userId],
  };
  const { rows: appFunds } = await db.query(query);
  return appFunds;
};

module.exports = {
  createAppFund,
  updateAppFundsBalance,
  retrieveAppFundsByUser,
};
