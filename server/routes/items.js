/**
 * @file Defines all routes for the Items route.
 */

const express = require('express');
const Boom = require('@hapi/boom');
const {
  retrieveItemById,
  retrieveItemByPlaidInstitutionId,
  retrieveAccountsByItemId,
  createItem,
  deleteItem,
  updateItemStatus,
  createAccount,
  updateBalances,
} = require('../db/queries');
const { asyncWrapper } = require('../middleware');
const plaid = require('../plaid');
const {
  sanitizeAccounts,
  sanitizeItems,
  isValidItemStatus,
  validItemStatuses,
} = require('../util');

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
    const { publicToken, institutionId, userId, accounts } = req.body;
    // in case developer did not customize their Account Select in the dashboard to enable only one account,
    // choose the checking or savings account.
    const checkingAccount = accounts.filter(
      account => account.subtype === 'checking'
    );
    const savingsAccount = accounts.filter(
      account => account.subtype === 'savings'
    );

    const account =
      accounts.length === 1
        ? accounts[0]
        : checkingAccount.length > 0
        ? checkingAccount[0]
        : savingsAccount[0];

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
    const authAndIdRequest = {
      access_token: accessToken,
      options: {
        account_ids: [account.id],
      },
    };
    const identityResponse = await plaid.identityGet(authAndIdRequest);
    const emails = identityResponse.data.accounts[0].owners[0].emails.map(
      email => {
        return email.data;
      }
    );
    const names = identityResponse.data.accounts[0].owners[0].names;
    const account_info_from_identity_get = identityResponse.data.accounts[0];

    let authNumbers = {
      account: null,
      routing: null,
      wire_routing: null,
    };
    let processorToken = null;
    const IS_PROCESSOR = process.env.IS_PROCESSOR;

    if (IS_PROCESSOR === 'false') {
      authResponse = await plaid.authGet(authAndIdRequest);
      authNumbers = authResponse.data.numbers.ach[0];
    } else {
      const processorRequest = {
        access_token: accessToken,
        account_id: account.id,
        processor: 'dwolla',
      };
      const processorTokenResponse = await plaid.processorTokenCreate(
        processorRequest
      );
      processorToken = processorTokenResponse.data.processor_token;
    }

    const newAccount = await createAccount(
      itemId,
      userId,
      account_info_from_identity_get,
      authNumbers,
      names,
      emails,
      processorToken
    );

    res.json({
      items: sanitizeItems(newItem),
      accounts: sanitizeAccounts(newAccount),
    });
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
 * Updates balances on account
 *
 * @param {number} itemId the ID of the item.
 * @param {string} accountId the account id.
 * @returns {Object[]} an array containing a single account.
 */
router.put(
  '/:itemId/balance',
  asyncWrapper(async (req, res) => {
    const { itemId } = req.params;
    const { accountId } = req.body;
    const { plaid_access_token: accessToken } = await retrieveItemById(itemId);
    const balanceRequest = {
      access_token: accessToken,
      options: {
        account_ids: [accountId],
      },
    };

    const balanceResponse = await plaid.accountsBalanceGet(balanceRequest);

    const account = balanceResponse.data.accounts[0];
    const latestAccount = await updateBalances(
      accountId,
      account.balances.current,
      account.balances.available
    );
    res.json(latestAccount);
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
