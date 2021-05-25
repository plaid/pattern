/**
 * @file Defines the queries for the properties table/view.
 */

const db = require('../');

/**
 * Creates a single property.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object} the new property.
 */
const createProperty = async (userId, description, value) => {
  const query = {
    // RETURNING is a Postgres-specific clause that returns a list of the inserted properties.
    text: `
       INSERT INTO properties_table
         (user_id, description, value)
       VALUES
         ($1, $2, $3)
       RETURNING
         *;
     `,
    values: [userId, description, value],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

/**
 * Retrieves all properties for a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of properties.
 */
const retrievePropertiesByUser = async userId => {
  const query = {
    text: 'SELECT * FROM properties WHERE user_id = $1',
    values: [userId],
  };
  const { rows: properties } = await db.query(query);
  return properties;
};

module.exports = {
  createProperty,
  retrievePropertiesByUser,
};
