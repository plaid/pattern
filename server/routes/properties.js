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
 * @param {string} description the description of the property.
 * @param {number} value the numerical value of the property.
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
 * Retrieves property for a single user
 *
 * @param {string} userId the ID of the user.
 * @returns {Object[]} an array of properties
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
