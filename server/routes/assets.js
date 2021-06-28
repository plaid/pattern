/**
 * @file Defines all routes for the Properties route.
 */

const express = require('express');
const {
  retrieveAssetsByUser,
  createAsset,
  deleteAssetByAssetId,
} = require('../db/queries');
const { asyncWrapper } = require('../middleware');

const router = express.Router();

/**
 *
 * @param {string} userId the user ID of the active user.
 * @param {string} description the description of the property.
 * @param {number} value the numerical value of the property.
 */
router.post(
  '/',
  asyncWrapper(async (req, res) => {
    const { userId, description, value } = req.body;
    const newAsset = await createAsset(userId, description, value);
    res.json(newAsset);
  })
);

/**
 * Retrieves property for a single user
 *
 * @param {string} userId the ID of the user.
 * @returns {Object[]} an array of properties
 */
router.get(
  '/:userId',
  asyncWrapper(async (req, res) => {
    const { userId } = req.params;
    const assets = await retrieveAssetsByUser(userId);

    res.json(assets);
  })
);

/**
 * Deletes an asset by its id
 *
 * @param {string} assetId the ID of the asset.
 */
router.delete(
  '/:assetId',
  asyncWrapper(async (req, res) => {
    const { assetId } = req.params;
    await deleteAssetByAssetId(assetId);

    res.sendStatus(204);
  })
);

module.exports = router;
