/**
 * @file Defines all root routes for the application.
 */

const usersRouter = require('./users');
const sessionsRouter = require('./sessions');
const itemsRouter = require('./items');
const accountsRouter = require('./accounts');
const institutionsRouter = require('./institutions');
const serviceRouter = require('./services');
const linkEventsRouter = require('./linkEvents');
const unhandledRouter = require('./unhandled');
const linkTokensRouter = require('./linkTokens');
const assetsRouter = require('./assets');

module.exports = {
  usersRouter,
  itemsRouter,
  accountsRouter,
  institutionsRouter,
  serviceRouter,
  linkEventsRouter,
  linkTokensRouter,
  unhandledRouter,
  sessionsRouter,
  assetsRouter,
};
