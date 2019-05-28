/**
 * @file Defines the queries for the users table/views.
 */

const db = require('../');

/**
 * Creates a single user.
 *
 * @param {string} username the username of the user.
 */
const createUser = async username => {
  const query = {
    text: 'INSERT INTO users_table (username) VALUES ($1);',
    values: [username],
  };
  await db.query(query);
};

/**
 * Removes users and related items, accounts and transactions.
 *
 *
 * @param {string[]} userId the desired user to be deleted.
 */

const deleteUsers = async userId => {
  const query = {
    text: 'DELETE FROM users_table WHERE id = $1;',
    values: [userId],
  };
  await db.query(query);
};

/**
 * Retrieves users with a given user ID.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of users.
 */
const retrieveUserByUserId = async userId => {
  const query = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [userId],
  };
  const { rows: user } = await db.query(query);
  return user;
};

/**
 * Retrieves a single user by username.
 *
 *
 * @param {string} username the username to search for.
 * @returns {Object} a single user.
 */
const retrieveUserByUsername = async username => {
  const query = {
    text: 'SELECT * FROM users WHERE username = $1',
    values: [username],
  };
  const { rows: users } = await db.query(query);
  // the username column has a UNIQUE constraint, so this will never return more than one row.
  return users[0];
};

/**
 * Retrieves all users.
 *
 * @returns {Object[]} an array of users.
 */
const retrieveUsers = async () => {
  const query = {
    text: 'SELECT * FROM users',
  };
  const { rows: users } = await db.query(query);
  return users;
};

/**
 * Retrieves the Plaid access tokens for an item.
 *
 * @param {number} userId the userId to get plaid access tokens for.
 * @returns {string[]} an array of Plaid access tokens.
 */
const retrieveAccessTokensByUserId = async userId => {
  const query = {
    text: 'SELECT plaid_access_token FROM items WHERE user_id = $1;',
    values: [userId],
  };
  const { rows } = await db.query(query);
  return rows.map(r => r.plaid_access_token);
};

module.exports = {
  createUser,
  deleteUsers,
  retrieveUserByUserId,
  retrieveUserByUsername,
  retrieveUsers,
  retrieveAccessTokensByUserId,
};
