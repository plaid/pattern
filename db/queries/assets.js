/**
 * @file Defines the queries for the assets table/view.
 */

const db = require('../');

/**
 * Creates a single property.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object} the new property.
 */
const createAsset = async (userId, description, value) => {
  const query = {
    // RETURNING is a Postgres-specific clause that returns a list of the inserted assets.
    text: `
        INSERT INTO assets_table
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
 * Retrieves all assets for a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of assets.
 */
const retrieveAssetsByUser = async userId => {
  const query = {
    text: 'SELECT * FROM assets WHERE user_id = $1',
    values: [userId],
  };
  const { rows: assets } = await db.query(query);
  return assets;
};

/**
 * Removes asset by asset id.
 *to
 *
 * @param {number} id the desired asset be deleted.
 */

const deleteAssetByAssetId = async assetId => {
  const query = {
    text: 'DELETE FROM assets_table WHERE id = $1;',
    values: [assetId],
  };
  await db.query(query);
};

module.exports = {
  createAsset,
  retrieveAssetsByUser,
  deleteAssetByAssetId,
};
