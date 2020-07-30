/**
 * @file Defines the unhandled route handler.
 */

const { asyncWrapper } = require('../middleware');

const express = require('express');
const plaid = require('../plaid');
const fetch = require('node-fetch');
const {
  retrieveItemById,
} = require('../db/queries');

const router = express.Router();

router.post('/', asyncWrapper(async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    console.log('hm', JSON.stringify(req.body), itemId);
    let accessToken = null;
    let products = ['transactions'];
    if (itemId != null) {
      const itemIdResponse = await retrieveItemById(itemId);
      console.log('response', JSON.stringify(itemIdResponse));
      accessToken = itemIdResponse.plaid_access_token;
      products = [];
    }
    const response = await fetch('http://ngrok:4040/api/tunnels');
    const { tunnels } = await response.json();
    const httpTunnel = tunnels.find(t => t.proto === 'http');
    console.log('tunenls', JSON.stringify(httpTunnel));
    const linkTokenParams = {
      user: {
        client_user_id: "" + userId,
      },
      client_name: 'Pattern',
      country_codes: ['US'],
      language: 'en',
      products,
      webhook: httpTunnel.public_url + '/services/webhook',
      access_token: accessToken,
    };
    console.log('params', linkTokenParams);
    res.json(await plaid.createLinkToken(linkTokenParams));
  } catch (err) {
    console.log('err', err);
    throw err;
  }
}));

module.exports = router;
