"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @file Defines the connection to the Plaid client.
 */
var forEach = require('lodash/forEach');

var _require = require('plaid'),
    Configuration = _require.Configuration,
    PlaidApi = _require.PlaidApi,
    PlaidEnvironments = _require.PlaidEnvironments;

var _require2 = require('./db/queries'),
    createPlaidApiEvent = _require2.createPlaidApiEvent,
    retrieveItemByPlaidAccessToken = _require2.retrieveItemByPlaidAccessToken; // Your Plaid API keys and secrets are loaded as environment variables.
// They are set in your `.env` file. See the repo README for more info.


var _process$env = process.env,
    PLAID_CLIENT_ID = _process$env.PLAID_CLIENT_ID,
    PLAID_ENV = _process$env.PLAID_ENV,
    PLAID_SECRET_DEVELOPMENT = _process$env.PLAID_SECRET_DEVELOPMENT,
    PLAID_SECRET_SANDBOX = _process$env.PLAID_SECRET_SANDBOX; // The Plaid secret is unique per environment. Note that there is also a separate production key,
// though we do not account for that here.

var PLAID_SECRET = PLAID_ENV === 'development' ? PLAID_SECRET_DEVELOPMENT : PLAID_SECRET_SANDBOX;
var OPTIONS = {
  clientApp: 'Plaid-Pattern'
}; // We want to log requests to / responses from the Plaid API (via the Plaid client), as this data
// can be useful for troubleshooting.

/**
 * Logging function for Plaid client methods that use an access_token as an argument. Associates
 * the Plaid API event log entry with the item and user the request is for.
 *
 * @param {string} clientMethod the name of the Plaid client method called.
 * @param {Array} clientMethodArgs the arguments passed to the Plaid client method.
 * @param {Object} response the response from the Plaid client.
 */

var defaultLogger = function defaultLogger(clientMethod, clientMethodArgs, response) {
  var accessToken, _ref, itemId, userId;

  return regeneratorRuntime.async(function defaultLogger$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          accessToken = clientMethodArgs[0].access_token;
          _context.next = 3;
          return regeneratorRuntime.awrap(retrieveItemByPlaidAccessToken(accessToken));

        case 3:
          _ref = _context.sent;
          itemId = _ref.id;
          userId = _ref.user_id;
          _context.next = 8;
          return regeneratorRuntime.awrap(createPlaidApiEvent(itemId, userId, clientMethod, clientMethodArgs, response));

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};
/**
 * Logging function for Plaid client methods that do not use access_token as an argument. These
 * Plaid API event log entries will not be associated with an item or user.
 *
 * @param {string} clientMethod the name of the Plaid client method called.
 * @param {Array} clientMethodArgs the arguments passed to the Plaid client method.
 * @param {Object} response the response from the Plaid client.
 */


var noAccessTokenLogger = function noAccessTokenLogger(clientMethod, clientMethodArgs, response) {
  return regeneratorRuntime.async(function noAccessTokenLogger$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(createPlaidApiEvent(undefined, undefined, clientMethod, clientMethodArgs, response));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // Plaid client methods used in this app, mapped to their appropriate logging functions.


var clientMethodLoggingFns = {
  institutionsGet: noAccessTokenLogger,
  institutionsGetById: noAccessTokenLogger,
  itemPublicTokenExchange: noAccessTokenLogger,
  itemRemove: defaultLogger,
  linkTokenCreate: noAccessTokenLogger,
  transactionsGet: defaultLogger,
  sandboxItemResetLogin: defaultLogger
}; // Wrapper for the Plaid client. This allows us to easily log data for all Plaid client requests.

var PlaidClientWrapper =
/*#__PURE__*/
function () {
  function PlaidClientWrapper() {
    var _this = this;

    _classCallCheck(this, PlaidClientWrapper);

    // Initialize the Plaid client.
    var configuration = new Configuration({
      basePath: PlaidEnvironments[PLAID_ENV],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
          'PLAID-SECRET': PLAID_SECRET,
          'Plaid-Version': '2020-09-14'
        }
      }
    });
    this.client = new PlaidApi(configuration); // Wrap the Plaid client methods to add a logging function.

    forEach(clientMethodLoggingFns, function (logFn, method) {
      _this[method] = _this.createWrappedClientMethod(method, logFn);
    });
  } // Allows us to log API request data for troubleshooting purposes.


  _createClass(PlaidClientWrapper, [{
    key: "createWrappedClientMethod",
    value: function createWrappedClientMethod(clientMethod, log) {
      var _this2 = this;

      return function _callee() {
        var _len,
            args,
            _key,
            _this2$client,
            res,
            _args3 = arguments;

        return regeneratorRuntime.async(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                for (_len = _args3.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = _args3[_key];
                }

                _context3.prev = 1;
                _context3.next = 4;
                return regeneratorRuntime.awrap((_this2$client = _this2.client)[clientMethod].apply(_this2$client, args));

              case 4:
                res = _context3.sent;
                _context3.next = 7;
                return regeneratorRuntime.awrap(log(clientMethod, args, res));

              case 7:
                return _context3.abrupt("return", res);

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](1);
                _context3.next = 14;
                return regeneratorRuntime.awrap(log(clientMethod, args, _context3.t0));

              case 14:
                throw _context3.t0;

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, null, null, [[1, 10]]);
      };
    }
  }]);

  return PlaidClientWrapper;
}();

module.exports = new PlaidClientWrapper();