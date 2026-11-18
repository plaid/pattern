/**
 * @file Defines the route for link token creation.
 */

const express = require('express');
const { asyncWrapper } = require('../middleware');

const plaid = require('../plaid');
// Using native fetch (Node 18+)
const {
  retrieveItemById,
  retrieveUserById,
  updateUserPlaidUserId,
} = require('../db/queries');

const { PLAID_SANDBOX_REDIRECT_URI, PLAID_PRODUCTION_REDIRECT_URI, PLAID_ENV } =
  process.env;

const redirectUri =
  PLAID_ENV === 'sandbox'
    ? PLAID_SANDBOX_REDIRECT_URI
    : PLAID_PRODUCTION_REDIRECT_URI;
const router = express.Router();

/**
 * Returns the user's Plaid user_id, creating it with /user/create the first time.
 *
 * @param {number} userId the ID of the user.
 * @param {string} clientUserId the client_user_id for the user.
 * @returns {string} the Plaid user_id.
 */
const getPlaidUserId = async (userId, clientUserId) => {
  const { plaid_user_id: plaidUserId } = await retrieveUserById(userId);
  if (plaidUserId != null) return plaidUserId;
  const { data } = await plaid.userCreate({ client_user_id: clientUserId });
  await updateUserPlaidUserId(userId, data.user_id);
  return data.user_id;
};

router.post(
  '/',
  asyncWrapper(async (req, res) => {
    try {
      const { userId, itemId, multiItem } = req.body;
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
        response = await fetch('http://localhost:4040/api/tunnels');
        if (!response.ok) {
          throw new Error(`ngrok API returned status ${response.status}`);
        }
      } catch (fetchError) {
        console.error('Failed to connect to ngrok:', fetchError.message);
        const errorMsg =
          'Unable to connect to ngrok. Make sure ngrok is running (make ngrok or ngrok http 5001). Get your authtoken at https://dashboard.ngrok.com/get-started/your-authtoken.';
        return res.status(500).json({
          error: 'ngrok_connection_failed',
          error_message: errorMsg,
        });
      }

      const { tunnels } = await response.json();
      const tunnel = tunnels.find(t => t.proto === 'https') || tunnels[0];

      if (!tunnel) {
        console.error('No ngrok tunnel found');
        return res.status(500).json({
          error: 'ngrok_tunnel_not_found',
          error_message:
            'ngrok is running but no tunnel was found. Check the ngrok dashboard at http://localhost:4040 for details.',
        });
      }

      // This should correspond to a unique id for the current user.
      const clientUserId = `uniqueId${userId}`;
      const linkTokenParams = {
        // Identify the user with a Plaid user_id from /user/create, so all of the user's
        // Items belong to the same Plaid user. Multi-Item Link requires it.
        user_id: await getPlaidUserId(userId, clientUserId),
        client_name: 'Pattern',
        products,
        country_codes: ['US'],
        language: 'en',
        webhook: `${tunnel.public_url}/services/webhook`,
        access_token: accessToken,
      };
      if (multiItem) {
        // Multi-Item Link lets the user link several banks in one session.
        // https://plaid.com/docs/link/multi-item-link/
        linkTokenParams.enable_multi_item_link = true;
      }
      // If user has entered a redirect uri in the .env file
      if (redirectUri.indexOf('http') === 0) {
        linkTokenParams.redirect_uri = redirectUri;
      }
      const createResponse = await plaid.linkTokenCreate(linkTokenParams);
      return res.json(createResponse.data);
    } catch (err) {
      console.error('Error while creating link token:', err);
      if (err.response && err.response.data) {
        console.log('Plaid API error:', err.response.data);
        return res.status(500).json(err.response.data);
      }
      return res.status(500).json({
        error: 'link_token_creation_failed',
        error_message: err.message || 'An unknown error occurred',
      });
    }
  })
);

module.exports = router;
