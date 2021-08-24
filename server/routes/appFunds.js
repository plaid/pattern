/**
 * @file Defines all routes for the App Funds route.
 */

const express = require('express');
const {
  retrieveAppFundsByUser,
  updateAppFundsBalance,
} = require('../db/queries');
const { asyncWrapper } = require('../middleware');

const router = express.Router();

/**
 * Retrieves app funds for a single user
 *
 * @param {string} userId the ID of the user.
 * @returns {Object[]} an array of app funds
 */
router.get(
  '/:userId',
  asyncWrapper(async (req, res) => {
    const { userId } = req.params;
    const appFunds = await retrieveAppFundsByUser(userId);
    res.json(appFunds);
  })
);

/**
 * Deletes an asset by its id
 *
 * @param {string} assetId the ID of the asset.
 */
router.put(
  '/:userId/bank_transfer',
  asyncWrapper(async (req, res) => {
    const { userId } = req.params;
    const { transferAmount } = req.body;
    const appFunds = await retrieveAppFundsByUser(userId);
    const oldBalance = appFunds[0].balance;
    const newBalance = oldBalance + transferAmount;
    await updateAppFundsBalance(userId, newBalance);
    const newAppFunds = await retrieveAppFundsByUser(userId);
    res.json(newAppFunds);
  })
);

module.exports = router;
