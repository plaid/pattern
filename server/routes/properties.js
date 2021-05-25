/**
 * @file Defines all routes for the Properties route.
 */

const express = require('express');
const Boom = require('@hapi/boom');
const { retrievePropertiesByUser, createProperty } = require('../db/queries');

const { asyncWrapper } = require('../middleware');
const plaid = require('../plaid');

const router = express.Router();

/**
 *
 * @param {string} userId the user ID of the active user.
 */
router.post(
  '/',
  asyncWrapper(async (req, res) => {
    const { userId, description, value } = req.body;
    const newProperty = await createProperty(userId, description, value);
    // const newProperty = await createUser(description);
    res.json(newProperty);
  })
);

/**
 * Retrieves a single item.
 *
 * @param {string} itemId the ID of the item.
 * @returns {Object[]} an array containing a single item.
 */
router.get(
  '/:userId',
  asyncWrapper(async (req, res) => {
    const { userId } = req.params;
    const properties = await retrievePropertiesByUser(userId);

    res.json(properties);
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
// router.delete(
//   '/:itemId',
//   asyncWrapper(async (req, res) => {
//     const { itemId } = req.params;
//     const { plaid_access_token: accessToken } = await retrieveItemById(itemId);
//     /* eslint-disable camelcase */
//     try {
//       const response = await plaid.itemRemove({
//         access_token: accessToken,
//       });
//       const removed = response.data.removed;
//       const status_code = response.data.status_code;
//     } catch (error) {
//       if (!removed)
//         throw new Boom('Item could not be removed in the Plaid API.', {
//           statusCode: status_code,
//         });
//     }
//     await deleteItem(itemId);

//     res.sendStatus(204);
//   })
// );

module.exports = router;
