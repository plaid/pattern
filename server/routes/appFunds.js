/**
 * @file Defines all routes for the App Funds route.
 */

const express = require('express');
const {
  retrieveAppFundsByUser,
  updateAppFundsBalance,
  retrieveAccountByPlaidAccountId,
  updateTransfers,
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
 * Updates the appFund balance and increases the number of transfers count by 1
 *
 * @param {string} accountId the ID of the account.
 *  @param {number} userId the ID of the user.
 *  @param {number} transferAmount the amount being transferred.
 * @return {Object{}} the new appFund and new account objects.
 */
router.put(
  '/:userId/bank_transfer',
  asyncWrapper(async (req, res) => {
    const { userId } = req.params;
    const { transferAmount, accountId } = req.body;
    const appFunds = await retrieveAppFundsByUser(userId);
    const oldBalance = appFunds.balance;
    const newBalance = oldBalance + transferAmount;
    await updateAppFundsBalance(userId, newBalance);
    // increment the number of transfers by 1
    const newAppFunds = await retrieveAppFundsByUser(userId);
    const account = await retrieveAccountByPlaidAccountId(accountId);
    const oldNumber = account.number_of_transfers;
    const newNumber = oldNumber + 1;
    await updateTransfers(accountId, newNumber);
    const newAccount = await retrieveAccountByPlaidAccountId(accountId);
    const response = {
      newAccount,
      newAppFunds: newAppFunds,
    };
    res.json(response);
  })
);

module.exports = router;
