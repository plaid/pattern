"use strict";

/**
 * @file Defines the route for link token creation.
 */
var _require = require('../middleware'),
    asyncWrapper = _require.asyncWrapper;

var express = require('express');

var plaid = require('../plaid');

var fetch = require('node-fetch');

var _require2 = require('../db/queries'),
    retrieveItemById = _require2.retrieveItemById;

var PLAID_SANDBOX_REDIRECT_URI = process.env.PLAID_SANDBOX_REDIRECT_URI;
var PLAID_DEVELOPMENT_REDIRECT_URI = process.env.PLAID_DEVELOPMENT_REDIRECT_URI;
var PLAID_ENV = process.env.PLAID_ENV;
var redirect_uri = PLAID_ENV == 'sandbox' ? PLAID_SANDBOX_REDIRECT_URI : PLAID_DEVELOPMENT_REDIRECT_URI;
var router = express.Router();
router.post('/', asyncWrapper(function _callee(req, res) {
  var _req$body, userId, itemId, accessToken, products, itemIdResponse, response, _ref, tunnels, httpTunnel, linkTokenParams, createResponse;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, userId = _req$body.userId, itemId = _req$body.itemId;
          accessToken = null;
          products = ['transactions']; // must include transactions in order to receive transactions webhooks

          if (!(itemId != null)) {
            _context.next = 10;
            break;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(retrieveItemById(itemId));

        case 7:
          itemIdResponse = _context.sent;
          accessToken = itemIdResponse.plaid_access_token;
          products = [];

        case 10:
          console.log('redirect', redirect_uri);
          console.log('environment', PLAID_ENV);
          _context.next = 14;
          return regeneratorRuntime.awrap(fetch('http://ngrok:4040/api/tunnels'));

        case 14:
          response = _context.sent;
          _context.next = 17;
          return regeneratorRuntime.awrap(response.json());

        case 17:
          _ref = _context.sent;
          tunnels = _ref.tunnels;
          httpTunnel = tunnels.find(function (t) {
            return t.proto === 'http';
          });
          linkTokenParams = {
            user: {
              // This should correspond to a unique id for the current user.
              client_user_id: 'uniqueId' + userId
            },
            client_name: 'Pattern',
            products: products,
            country_codes: ['US'],
            language: 'en',
            webhook: httpTunnel.public_url + '/services/webhook',
            access_token: accessToken,
            redirect_uri: redirect_uri
          };
          _context.next = 23;
          return regeneratorRuntime.awrap(plaid.linkTokenCreate(linkTokenParams));

        case 23:
          createResponse = _context.sent;
          res.json(createResponse.data);
          _context.next = 31;
          break;

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](0);
          console.log('error while fetching client token', _context.t0.response.data);
          res.send(_context.t0.response.data);

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27]]);
}));
module.exports = router;