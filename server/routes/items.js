/**
 * @file Defines all routes for the Items route.
 */

const express = require('express');
const Boom = require('@hapi/boom');
const {
  retrieveItemById,
  retrieveItemByPlaidInstitutionId,
  retrieveAccountsByItemId,
  retrieveTransactionsByItemId,
  createItem,
  deleteItem,
  updateItemStatus,
} = require('../db/queries');
const { asyncWrapper } = require('../middleware');
const plaid = require('../plaid');
const {
  sanitizeAccounts,
  sanitizeItems,
  sanitizeTransactions,
  isValidItemStatus,
  validItemStatuses,
} = require('../util');
const { updateTransactions } = require('../update_transactions');

const router = express.Router();

/**
 * First exchanges a public token for a private token via the Plaid API
 * and then stores the newly created item in the DB.
 *
 * @param {string} publicToken public token returned from the onSuccess call back in Link.
 * @param {string} institutionId the Plaid institution ID of the new item.
 * @param {string} userId the Plaid user ID of the active user.
 */
router.post(
  '/',
  asyncWrapper(async (req, res) => {
    const { publicToken, institutionId, userId } = req.body;
    // prevent duplicate items for the same institution per user.
    const existingItem = await retrieveItemByPlaidInstitutionId(
      institutionId,
      userId
    );
    if (existingItem)
      throw new Boom('You have already linked an item at this institution.', {
        statusCode: 409,
      });

    // exchange the public token for a private access token and store with the item.
    const response = await plaid.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    const newItem = await createItem(
      institutionId,
      accessToken,
      itemId,
      userId
    );

    // Make an initial call to fetch transactions and enable SYNC_UPDATES_AVAILABLE webhook sending
    // for this item.
    updateTransactions(itemId).then(() => {
      // Notify frontend to reflect any transactions changes.
      req.io.emit('NEW_TRANSACTIONS_DATA', { itemId: newItem.id });
    });

    res.json(sanitizeItems(newItem));
  })
);

/**
 * Retrieves a single item.
 *
 * @param {string} itemId the ID of the item.
 * @returns {Object[]} an array containing a single item.
 */
router.get(
  '/:itemId',
  asyncWrapper(async (req, res) => {
    const { itemId } = req.params;
    const item = await retrieveItemById(itemId);
    res.json(sanitizeItems(item));
  })
);

/**
 * Updates a single item.
 *
 * @param {string} itemId the ID of the item.
 * @returns {Object[]} an array containing a single item.
 */
router.put(
  '/:itemId',
  asyncWrapper(async (req, res) => {
    const { itemId } = req.params;
    const { status } = req.body;

    if (status) {
      if (!isValidItemStatus(status)) {
        throw new Boom(
          'Cannot set item status. Please use an accepted value.',
          {
            statusCode: 400,
            acceptedValues: [validItemStatuses.values()],
          }
        );
      }
      await updateItemStatus(itemId, status);
      const item = await retrieveItemById(itemId);
      res.json(sanitizeItems(item));
    } else {
      throw new Boom('You must provide updated item information.', {
        statusCode: 400,
        acceptedKeys: ['status'],
      });
    }
  })
);

/**
 * Deletes a single item and related accounts and transactions.
 * Also removes the item from the Plaid API
 * access_token associated with the Item is no longer valid
 * https://plaid.com/docs/#remove-item-request
 * @param {string} itemId the ID of the item.
 * @returns status of 204 if successful
 */
router.delete(
  '/:itemId',
  asyncWrapper(async (req, res) => {
    const { itemId } = req.params;
    const { plaid_access_token: accessToken } = await retrieveItemById(itemId);
    /* eslint-disable camelcase */
    try {
      const response = await plaid.itemRemove({
        access_token: accessToken,
      });
      const removed = response.data.removed;
      const status_code = response.data.status_code;
    } catch (error) {
      if (!removed)
        throw new Boom('Item could not be removed in the Plaid API.', {
          statusCode: status_code,
        });
    }
    await deleteItem(itemId);

    res.sendStatus(204);
  })
);

/**
 * Retrieves all accounts associated with a single item.
 *
 * @param {string} itemId the ID of the item.
 * @returns {Object[]} an array of accounts.
 */
router.get(
  '/:itemId/accounts',
  asyncWrapper(async (req, res) => {
    const { itemId } = req.params;
    const accounts = await retrieveAccountsByItemId(itemId);
    res.json(sanitizeAccounts(accounts));
  })
);

/**
 * Retrieves all transactions associated with a single item.
 *
 * @param {string} itemId the ID of the item.
 * @returns {Object[]} an array of transactions.
 */
router.get(
  '/:itemId/transactions',
  asyncWrapper(async (req, res) => {
    const { itemId } = req.params;
    const transactions = await retrieveTransactionsByItemId(itemId);
    res.json(sanitizeTransactions(transactions));
  })
);

/**
 * -- This endpoint will only work in the sandbox enviornment --
 * Forces an Item into an ITEM_LOGIN_REQUIRED (bad) error state.
 * An ITEM_LOGIN_REQUIRED webhook will be fired after a call to this endpoint.
 * https://plaid.com/docs/#managing-item-states
 *
 * @param {string} itemId the Plaid ID of the item.
 * @return {Object} the response from the Plaid API.
 */
router.post(
  '/sandbox/item/reset_login',
  asyncWrapper(async (req, res) => {
    const { itemId } = req.body;
    const { plaid_access_token: accessToken } = await retrieveItemById(itemId);
    const resetResponse = await plaid.sandboxItemResetLogin({
      access_token: accessToken,
    });
    res.json(resetResponse.data);
  })
);

module.exports = router;
