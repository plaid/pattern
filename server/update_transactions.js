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
  retrieveItemsByUser,
} = require('./db/queries');

/**
 * Fetches transactions from the Plaid API for a given item.
 *
 * @param {string} plaidItemId the Plaid ID for the item.
 * @returns {Object{}} an object containing transactions and a cursor.
 */
const fetchTransactionUpdates = async (plaidItemId) => {
  // the transactions endpoint is paginated, so we may need to hit it multiple times to
  // retrieve all available transactions.

  // get the access token based on the plaid item id
  const {
    plaid_access_token: accessToken,
    transactions_cursor: lastCursor,
  } = await retrieveItemByPlaidItemId(
    plaidItemId
  );

  let cursor = lastCursor;

  // New transaction updates since "cursor"
  let added = [];
  let modified = [];
  // Removed transaction ids
  let removed = [];
  let hasMore = true;

  const batchSize = 100;
  try {
    // Iterate through each page of new transaction updates for item
    /* eslint-disable no-await-in-loop */
    while (hasMore) {
      const request = {
        access_token: accessToken,
        cursor: cursor,
        count: batchSize,
      };
      const response = await plaid.transactionsSync(request)
      const data = response.data;
      // Add this page of results
      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);
      hasMore = data.has_more;
      // Update cursor to the next cursor
      cursor = data.next_cursor;
    }
  } catch (err) {
    console.error(`Error fetching transactions: ${err.message}`);
    cursor = lastCursor;
  }
  return { added, modified, removed, cursor, accessToken };
};

/**
 * Handles the fetching and storing of new, modified, or removed transactions
 *
 * @param {string} plaidItemId the Plaid ID for the item.
 */
const updateTransactions = async (plaidItemId) => {
  // Fetch new transactions from plaid api.
  const {
    added,
    modified,
    removed,
    cursor,
    accessToken
  } = await fetchTransactionUpdates(plaidItemId);

  
  const request = {
    access_token: accessToken,
  };

  const {data: {accounts}} = await plaid.accountsGet(request);
  
  // Update the DB.
  await createAccounts(plaidItemId, accounts);
  await createOrUpdateTransactions(added.concat(modified));
  await deleteTransactions(removed);
  await updateItemTransactionsCursor(plaidItemId, cursor);
  return {
    addedCount: added.length,
    modifiedCount: modified.length,
    removedCount: removed.length,
  };
};

const queryAllItems = async (userID) => {
    const items = await retrieveItemsByUser(userID);
    for (const item of items) {
        try {
            await updateTransactions(item.plaid_item_id);
        } catch (error) {
            console.error(`Failed to update transactions for item ${item.plaid_item_id}:`, error);
            // Continue with the next item
        }
    }
}

module.exports = {
  updateTransactions, 
  queryAllItems,
};
