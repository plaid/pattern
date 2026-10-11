/**
 * @file Defines helpers for updating transactions on an item
 */

const plaid = require('./plaid');
const {
  retrieveItemByPlaidItemId,
  createAccounts,
  createOrUpdateTransactions,
  deleteTransactions,
  updateItemTransactionsCursor,
} = require('./db/queries');

/**
 * Fetches transactions from the Plaid API for a given item.
 *
 * @param {string} plaidItemId the Plaid ID for the item.
 * @returns {Object{}} an object containing transactions and a cursor.
 */
const fetchTransactionUpdates = async plaidItemId => {
  // the transactions endpoint is paginated, so we may need to hit it multiple times to
  // retrieve all available transactions.

  // get the access token based on the plaid item id
  const { plaid_access_token: accessToken, transactions_cursor: lastCursor } =
    await retrieveItemByPlaidItemId(plaidItemId);

  let cursor = lastCursor;

  // New transaction updates since "cursor"
  let added = [];
  let modified = [];
  // Removed transaction ids
  let removed = [];
  let hasMore = true;

  const batchSize = 100;
  // A /transactions/sync response is a diff (added/modified/removed) tied to the
  // cursor we sent. The whole diff plus the cursor advance is one atomic unit: it
  // must be applied all-or-nothing. We therefore accumulate every page here before
  // returning, and if any page fails we let the error propagate instead of
  // swallowing it. That leaves the caller with nothing to persist and the cursor
  // unadvanced, so the next sync (or Plaid's webhook retry) resumes cleanly from
  // lastCursor. If we instead persisted a partial page and advanced the cursor,
  // the un-fetched transactions would be skipped forever, since the cursor would
  // have moved past them.
  /* eslint-disable no-await-in-loop */
  while (hasMore) {
    const request = {
      access_token: accessToken,
      cursor: cursor,
      count: batchSize,
    };
    const response = await plaid.transactionsSync(request);
    const data = response.data;
    // Add this page of results
    added = added.concat(data.added);
    modified = modified.concat(data.modified);
    removed = removed.concat(data.removed);
    hasMore = data.has_more;
    // Update cursor to the next cursor
    cursor = data.next_cursor;
  }
  /* eslint-enable no-await-in-loop */
  return { added, modified, removed, cursor, accessToken };
};

/**
 * Handles the fetching and storing of new, modified, or removed transactions
 *
 * @param {string} plaidItemId the Plaid ID for the item.
 */
const updateTransactions = async plaidItemId => {
  // Fetch new transactions from plaid api.
  const { added, modified, removed, cursor, accessToken } =
    await fetchTransactionUpdates(plaidItemId);

  const request = {
    access_token: accessToken,
  };

  const {
    data: { accounts },
  } = await plaid.accountsGet(request);

  // Apply the full diff and only then advance the cursor. The cursor must move
  // last so it is never advanced past changes we haven't stored: if any write
  // below throws, the cursor stays put and the next sync replays this same diff
  // (the writes are idempotent — upserts keyed on plaid IDs and delete-by-id).
  // In production you'd wrap these four writes plus the cursor update in a single
  // DB transaction so the diff and cursor commit atomically; we keep them as
  // separate statements here for readability in the sample.
  await createAccounts(plaidItemId, accounts);
  await createOrUpdateTransactions(added.concat(modified));
  // Extract transaction IDs from removed objects
  await deleteTransactions(removed.map(r => r.transaction_id));
  await updateItemTransactionsCursor(plaidItemId, cursor);
  return {
    addedCount: added.length,
    modifiedCount: modified.length,
    removedCount: removed.length,
  };
};

module.exports = updateTransactions;
