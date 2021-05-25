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

module.exports = router;
