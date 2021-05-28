/**
 * @file Defines the queries for the plaid_api_events table.
 */

const db = require('../');

/**
 * Creates a single Plaid api event log entry.
 *
 * @param {string} itemId the item id in the request.
 * @param {string} plaidMethod the Plaid client method called.
 * @param {Array} clientMethodArgs the arguments passed to the Plaid client method.
 * @param {Object} response the Plaid api response object.
 */
const createPlaidApiEvent = async (
  itemId,
  plaidMethod,
  clientMethodArgs,
  response
) => {
  const {
    error_code: errorCode,
    error_type: errorType,
    request_id: requestId,
  } = response;
  const query = {
    text: `
      INSERT INTO plaid_api_events_table
        (
          item_id,
          plaid_method,
          arguments,
          request_id,
          error_type,
          error_code
        )
      VALUES
        ($1, $2, $3, $4, $5, $6);
    `,
    values: [
      itemId,
      plaidMethod,
      JSON.stringify(clientMethodArgs),
      requestId,
      errorType,
      errorCode,
    ],
  };
  await db.query(query);
};

/**
 * Retrieves all events.
 *
 * @returns {Object[]} an array of events.
 */
const retrieveAllApiEvents = async () => {
  const query = {
    text: 'SELECT * FROM api_events_table',
  };
  const { rows: events } = await db.query(query);
  return events;
};

module.exports = {
  createPlaidApiEvent,
  retrieveAllApiEvents,
};
