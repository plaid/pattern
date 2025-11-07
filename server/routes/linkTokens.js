/**
 * @file Defines the route for link token creation.
 */

const { asyncWrapper } = require('../middleware');

const express = require('express');
const plaid = require('../plaid');
// Using native fetch (Node 18+)
const { retrieveItemById } = require('../db/queries');
const {
  PLAID_SANDBOX_REDIRECT_URI,
  PLAID_PRODUCTION_REDIRECT_URI,
  PLAID_ENV,
} = process.env;

const redirect_uri =
  PLAID_ENV == 'sandbox'
    ? PLAID_SANDBOX_REDIRECT_URI
    : PLAID_PRODUCTION_REDIRECT_URI;
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

      // Fetch ngrok tunnel URL with better error handling
      let response;
      try {
        response = await fetch('http://ngrok:4040/api/tunnels');
        if (!response.ok) {
          throw new Error(`ngrok API returned status ${response.status}`);
        }
      } catch (fetchError) {
        console.error('Failed to connect to ngrok:', fetchError.message);
        const errorMsg = 'Unable to connect to ngrok. Please ensure you have added your ngrok authtoken to ngrok/ngrok.yml. Get your authtoken at https://dashboard.ngrok.com/get-started/your-authtoken.\n\nFor more details, check ngrok logs using "make logs" or Docker Desktop.';
        return res.status(500).json({
          error: 'ngrok_connection_failed',
          error_message: errorMsg
        });
      }

      const { tunnels } = await response.json();
      const httpsTunnel = tunnels.find(t => t.proto === 'https');

      if (!httpsTunnel) {
        console.error('No HTTPS tunnel found in ngrok');
        return res.status(500).json({
          error: 'ngrok_tunnel_not_found',
          error_message: 'ngrok is running but no HTTPS tunnel was found.\n\nCheck ngrok logs for more details using "make logs" or Docker Desktop.'
        });
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
        webhook: httpsTunnel.public_url + '/services/webhook',
        access_token: accessToken,
      };
      // If user has entered a redirect uri in the .env file
      if (redirect_uri.indexOf('http') === 0) {
        linkTokenParams.redirect_uri = redirect_uri;
      }
      const createResponse = await plaid.linkTokenCreate(linkTokenParams);
      res.json(createResponse.data);
    } catch (err) {
      console.error('Error while creating link token:', err);
      if (err.response && err.response.data) {
        console.log('Plaid API error:', err.response.data);
        return res.status(500).json(err.response.data);
      }
      return res.status(500).json({
        error: 'link_token_creation_failed',
        error_message: err.message || 'An unknown error occurred'
      });
    }
  })
);

module.exports = router;
