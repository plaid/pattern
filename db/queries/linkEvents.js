/**
 * @file Defines the queries for link events.
 */

const db = require('..');

/**
 * Creates a link event.
 *
 * @param {Object} event the link event.
 * @param {string} event.userId the ID of the user.
 * @param {string} event.type displayed as 'success' or 'exit' based on the callback.
 * @param {string} event.link_session_id the session ID created when connecting with link.
 * @param {string} event.request_id the request ID created only on error when connecting with link.
 * @param {string} event.error_type a broad categorization of the error.
 * @param {string} event.error_code a specific code that is a subset of the error_type.
 */

const createLinkEvent = async ({
  type,
  userId,
  link_session_id: linkSessionId,
  request_id: requestId,
  error_type: errorType,
  error_code: errorCode,
  status: status,
}) => {
  const query = {
    text: `
      INSERT INTO link_events_table
        (
          type,
          user_id,
          link_session_id,
          request_id,
          error_type,
          error_code,
          status
        )
      VALUES ($1, $2, $3, $4, $5, $6,$7);
    `,
    values: [
      type,
      userId,
      linkSessionId,
      requestId,
      errorType,
      errorCode,
      status,
    ],
  };
  await db.query(query);
};

module.exports = {
  createLinkEvent,
};
