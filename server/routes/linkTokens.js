/**
 * @file Defines the route for link token creation.
 */

const { asyncWrapper } = require('../middleware');

const express = require('express');
const plaid = require('../plaid');
const fetch = require('node-fetch');
const { retrieveItemById } = require('../db/queries');
const {
  PLAID_SANDBOX_REDIRECT_URI,
  PLAID_DEVELOPMENT_REDIRECT_URI,
  PLAID_ENV,
  PLAID_WEBHOOK_URL
} = process.env;

const redirect_uri =
  PLAID_ENV == 'sandbox'
    ? PLAID_SANDBOX_REDIRECT_URI
    : PLAID_DEVELOPMENT_REDIRECT_URI;
const router = express.Router();

router.post(
  '/',
  asyncWrapper(async (req, res) => {
    try {
      const { userId, itemId } = req.body;
      let accessToken = null;
      let products = ['transactions']; // must include transactions in order to receive transactions webhooks
      if (itemId != null) {
        // for the link update mode, include access token and an empty products array
        const itemIdResponse = await retrieveItemById(itemId);
        accessToken = itemIdResponse.plaid_access_token;
        products = [];
      }
      const linkTokenParams = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: 'uniqueId' + userId,
        },
        client_name: 'Pattern',
        products,
        country_codes: ['US'],
        language: 'en',
        access_token: accessToken,
      };
      // If user has entered a redirect uri in the .env file
      if (redirect_uri.indexOf('http') === 0) {
        linkTokenParams.redirect_uri = redirect_uri;
      }
      // If user has entered a webhook in the .env file
      if (PLAID_WEBHOOK_URL.indexOf('http') === 0) {
        linkTokenParams.webhook = PLAID_WEBHOOK_URL;
      }
      const createResponse = await plaid.linkTokenCreate(linkTokenParams);
      res.json(createResponse.data);
    } catch (err) {
        console.error('Error while fetching client token:', err);

        // Send a structured error response
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            details: err.message  // Or any other relevant detail from the error object
        });
    }
}));

module.exports = router;
