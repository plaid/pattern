# Plaid Pattern - Server

The application server is written in javascript using [Node.js][nodejs] and [Express][expressjs]. It interacts with the Plaid API via the [Plaid Node SDK][plaid-node], and with the [database][database-readme] using [`node-postgres`][node-pg]. While we've used Node for the reference implementation, the concepts shown here will apply no matter what language your backend is written in.

## Key Concepts

### Associating users with Plaid items and access tokens.

Plaid does not have a user data object for tying multiple items together, so it is up to application developers to define that relationship. For an example of this, see the [root items route][items-routes] (used to store new items) and the [users routes][users-routes].

### Preventing item duplication.

Plaid does not prevent item duplication. It is entirely possible for a user to create multiple items linked to the same financial institution. In practice, you probably want to prevent this. The easiest way to do this is to check the institution id of a newly created item before performing the token exchange and storing the item. For an example of this, see the [root items route][items-routes].

### Using webhooks to update transaction data.

Plaid uses [webhooks][transactions-webhooks] to notify you whenever there are new transactions associated with an Item. This allows you to make a call to Plaid's transactions endpoint only when there are new transactions available, rather than polling for them. For an example of this, see the [transactions webhook handler][transactions-handler].

For webhooks to work, the server must be publicly accessible on the internet. For development purposes, this application uses [ngrok][ngrok-readme] to accomplish that.

## Debugging

The node debugging port (9229) is exposed locally on port 9229.

If you are using Visual Studio Code as your editor, you can use the `Docker: Attach to Server` launch configuration to interactively debug the server while it's running. See the [VS Code docs][vscode-debugging] for more information.

[database-readme]: ../database/README.md
[expressjs]: http://expressjs.com/
[items-routes]: routes/items.js
[ngrok-readme]: ../ngrok/README.md
[node-pg]: https://github.com/brianc/node-postgres
[nodejs]: https://nodejs.org/en/
[plaid-node]: https://github.com/plaid/plaid-node
[transactions-handler]: webhookHandlers/handleTransactionsWebhook.js
[transactions-webhooks]: https://plaid.com/docs/#transactions-webhooks
[users-routes]: routes/users.js
[vscode-debugging]: https://code.visualstudio.com/docs/editor/debugging
