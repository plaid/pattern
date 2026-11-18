/**
 * @file Defines a helper that stores the Items linked in a Multi-Item Link session.
 */

const plaid = require('./plaid');
const {
  retrieveItemByPlaidInstitutionId,
  retrieveUserByPlaidUserId,
} = require('./db/queries');
const exchangePublicToken = require('./exchange_public_token');

/**
 * Stores the Items linked with a Multi-Item Link token. The SESSION_FINISHED webhook
 * calls this, and so does the client when Link finishes, as a fallback in case the
 * webhook is missed. Both can run for the same session, so Items that were already
 * stored are skipped.
 * https://plaid.com/docs/link/multi-item-link/
 *
 * @param {string} linkToken the link token the session used.
 * @param {Object} io a socket.io server instance.
 * @returns {number|undefined} the ID of the user who linked the Items, if known.
 */
const addLinkSessionItems = async (linkToken, io) => {
  // /link/token/get returns the Plaid user the link token was created for, and the
  // public token and institution of each Item linked with it.
  const { data } = await plaid.linkTokenGet({ link_token: linkToken });
  const user = await retrieveUserByPlaidUserId(data.user_id);
  if (user == null) return undefined;
  const results = (data.link_sessions ?? []).flatMap(
    session => session.results?.item_add_results ?? []
  );

  // Add Items one at a time so the duplicate check also catches the same institution
  // being linked twice in one session. Errors are handled per Item, so one failure
  // doesn't stop the rest from being stored.
  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < results.length; i += 1) {
    const { public_token: publicToken, institution } = results[i];
    try {
      const existingItem = await retrieveItemByPlaidInstitutionId(
        institution.institution_id,
        user.id
      );
      if (existingItem) {
        console.log(`LINK SESSION: ${institution.name} is already linked`);
      } else {
        await exchangePublicToken({
          publicToken,
          institutionId: institution.institution_id,
          userId: user.id,
          io,
        });
      }
    } catch (err) {
      // If the webhook and the fallback run at the same time, Plaid may reject the
      // public token that the other one already exchanged.
      const alreadyStored =
        err.response?.data?.error_code === 'INVALID_PUBLIC_TOKEN';
      if (alreadyStored) {
        console.log(`LINK SESSION: ${institution.name} was already stored`);
      } else {
        console.error(
          `LINK SESSION: could not store ${institution?.name ?? 'an Item'}: ${err.response?.data?.error_message ?? err.message}`
        );
      }
    }
  }
  /* eslint-enable no-await-in-loop */

  return user.id;
};

module.exports = addLinkSessionItems;
