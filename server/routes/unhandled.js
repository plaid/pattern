/**
 * @file Defines the unhandled route handler.
 */

const express = require('express');
const Boom = require('@hapi/boom');

const router = express.Router();

/**
 * Throws a 404 not found error for all requests.
 */
router.get('/*splat', (req, res) => {
  throw new Boom.Boom('not found', { statusCode: 404 });
});

module.exports = router;
