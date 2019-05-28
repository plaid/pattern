/**
 * @file Defines all routes for the Institutions route.
 */

const express = require('express');
const { asyncWrapper } = require('../middleware');
const plaid = require('../plaid');
const { toArray } = require('../util');

const router = express.Router();

/**
 * Fetches institutions from the Plaid API.
 *
 * @param {number} [count=200] The number of Institutions to return, 0 < count <= 500.
 * @param {number} [offset=0] The number of Institutions to skip before returning results, offset >= 0.
 * @returns {Object[]} an array of institutions.
 */
router.get(
  '/',
  asyncWrapper(async (req, res) => {
    let { count = 200, offset = 0 } = req.query;
    const radix = 10;
    count = parseInt(count, radix);
    offset = parseInt(offset, radix);
    const { institutions } = await plaid.getInstitutions(count, offset, {
      include_optional_metadata: true,
    });
    res.json(toArray(institutions));
  })
);

/**
 * Fetches a single institution from the Plaid API.
 *
 * @param {string} instId The ins_id of the institution to be returned.
 * @returns {Object[]} an array containing a single institution.
 */
router.get(
  '/:instId',
  asyncWrapper(async (req, res) => {
    const { instId } = req.params;
    const { institution } = await plaid.getInstitutionById(instId, {
      include_optional_metadata: true,
    });
    res.json(toArray(institution));
  })
);

module.exports = router;
