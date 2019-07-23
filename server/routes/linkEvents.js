/**
 * @file Defines all routes for Link Events.
 */

const express = require('express');

const { createLinkEvent } = require('../db/queries');
const { asyncWrapper } = require('../middleware');

const router = express.Router();

/**
 * Creates a new link event .
 *
 * @param {string} userId the ID of the user.
 * @param {string} type displayed as 'success' or 'exit' based on the callback.
 * @param {string} link_session_id the session ID created when connecting with link.
 * @param {string} request_id the request ID created only on error when connecting with link.
 * @param {string} error_type a broad categorization of the error.
 * @param {string} error_code a specific code that is a subset of the error_type.
 */
router.post(
  '/',
  asyncWrapper(async (req, res) => {
    await createLinkEvent(req.body);
    res.sendStatus(200);
  })
);

module.exports = router;
