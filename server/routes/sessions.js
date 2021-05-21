/**
 * @file Defines all routes for the Users route.
 */

const express = require('express');
const { retrieveUserByUsername } = require('../db/queries');
const { asyncWrapper } = require('../middleware');
const { sanitizeUsers } = require('../util');

const router = express.Router();

/**
 * Retrieves user information for a single user.
 *
 * @param {string} username the name of the user.
 * @returns {Object[]} an array containing a single user.
 */
router.post(
  '/',
  asyncWrapper(async (req, res) => {
    const { username } = req.body;
    const user = await retrieveUserByUsername(username);
    if (user != null) {
      res.json(sanitizeUsers(user));
    } else {
      res.json(null);
    }
  })
);

module.exports = router;
