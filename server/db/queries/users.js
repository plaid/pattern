/**
 * @file Defines the queries for the users table/views.
 */

const db = require('../');

/**
 * Creates a single user.
 *
 * @param {string} username the username of the user.
 * @param {string} email the email of the user.
 * @returns {Object} the new user.
 */
const createUser = async (username, fullname, email) => {
  const query = {
    // RETURNING is a Postgres-specific clause that returns a list of the inserted items.
    text:
      'INSERT INTO users_table (username, fullname, email, identity_check) VALUES ($1, $2, $3, $4) RETURNING *;',
    values: [username, fullname, email, false],
  };
  const { rows } = await db.query(query);
  return rows[0];
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
 * Updates the identityCheck for a user.
 *
 * @param {number} userId the userID.
 * @param {boolean} identityCheck true or false for a user.
 */
const updateIdentityCheck = async (userId, identityCheck) => {
  const query = {
    text: 'UPDATE users SET identity_check = $1 WHERE id = $2',
    values: [identityCheck, userId],
  };
  await db.query(query);
};

/**
 * Updates user information when user confirms identity.
 *
 * @param {number} userId the user id of th user.
 * @param {string} username the username of the user.
 * @param {string} email the email of the user.
 */
const updateUserInfo = async (userId, fullname, email) => {
  const query = {
    text: 'UPDATE users SET fullname = $2, email = $3 WHERE id = $1',
    values: [userId, fullname, email],
  };
  await db.query(query);
};

/**
 * Retrieves a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object} a user.
 */
const retrieveUserById = async userId => {
  const query = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [userId],
  };
  const { rows } = await db.query(query);
  // since the user IDs are unique, this query will return at most one result.
  return rows[0];
};

/**
 * Retrieves a single user.
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

module.exports = {
  createUser,
  deleteUsers,
  retrieveUserById,
  retrieveUserByUsername,
  retrieveUsers,
  updateIdentityCheck,
  updateUserInfo,
};
