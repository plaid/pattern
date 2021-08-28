/**
 * @file Defines all routes for the Accounts route.
 */

const express = require('express');
const {
  retrieveTransactionsByAccountId,
  retrieveAccountByPlaidAccountId,
  updateTransfers,
} = require('../db/queries');
const { asyncWrapper } = require('../middleware');
const { sanitizeTransactions } = require('../util');

const router = express.Router();

/**
 * Fetches all transactions for a single account.
 *
 * @param {number} accountId the ID of the account.
 * @return {Object{[]}} an array of transactions
 */
router.get(
  '/:accountId/transactions',
  asyncWrapper(async (req, res) => {
    const { accountId } = req.params;
    const transactions = await retrieveTransactionsByAccountId(accountId);
    res.json(sanitizeTransactions(transactions));
  })
);

/**
 * Adds 1 to number of transfers
 *
 * @param {number} accountId the ID of the account.
 * @return {Object{[]}} an array of transactions
 */
router.put(
  '/:accountId/increment_transfers',
  asyncWrapper(async (req, res) => {
    const { accountId } = req.params;
    const account = await retrieveAccountByPlaidAccountId(accountId);
    const oldNumber = account.number_of_transfers;
    const newNumber = oldNumber + 1;
    await updateTransfers(accountId, newNumber);
    const updatedAccount = await retrieveAccountByPlaidAccountId(accountId);
    res.json(updatedAccount);
  })
);

module.exports = router;
