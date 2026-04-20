# Plaid Pattern

![Plaid Pattern client][client-img]

This is a sample Personal Finance Manager application demonstrating an end-to-end [Plaid][plaid] integration, focused on linking items and fetching transaction data. You can view a simplified version of this demonstration app at [pattern.plaid.com](https://pattern.plaid.com).

You may also be interested in the [Plaid Transactions tutorial sample app](https://github.com/plaid/tutorial-resources/tree/main/transactions) which has an accompanying [YouTube video tutorial](https://www.youtube.com/watch?v=hBiKJ6vTa4g).

The full Plaid collection of sample apps includes:

[Plaid Pattern Personal Finance Manager](https://github.com/plaid/pattern/) (you are here) - Demonstrates the Plaid Transactions API

[Plaid Pattern Account Funding App](https://github.com/plaid/pattern-account-funding) - Demonstrates the Plaid Auth, Balance, and Identity APIs

[Plaid Transfer Quickstart App](https://github.com/plaid/transfer-quickstart) - Demonstrates the Transfer API (up to date)

[Plaid Pattern Transfer App (deprecated)](https://github.com/plaid/pattern-transfers) - Demonstrates the Transfer API (this sample app is deprecated, use the Quickstart app instead)

Plaid Pattern apps are provided for illustrative purposes and are not meant to be run as production applications.

## Requirements

-   [Node.js](https://nodejs.org/) v20 or higher
-   [PostgreSQL](https://www.postgresql.org/) v16 or higher
-   [Plaid API keys][plaid-keys] - [sign up][plaid-signup] for a free Sandbox account if you don't already have one
-   [ngrok](https://ngrok.com/) to expose the server for Plaid webhooks — [sign up](https://dashboard.ngrok.com/signup) for a free account to get an authtoken

### Installing prerequisites

**macOS** (with [Homebrew](https://brew.sh/)):
```shell
brew install node postgresql@16
brew services start postgresql@16
brew install ngrok/ngrok/ngrok
```

**Windows** (with [Chocolatey](https://chocolatey.org/)):
```shell
choco install nodejs postgresql16
choco install ngrok
```
Or download the installers directly from the links above.

**Linux (Debian/Ubuntu)**:
```shell
sudo apt update && sudo apt install -y nodejs npm postgresql
sudo systemctl start postgresql
snap install ngrok  # or download from https://ngrok.com/download
```

## Getting Started

1. Clone the repo.
    ```shell
    git clone https://github.com/plaid/pattern.git
    cd pattern
    ```
1. Create the `.env` file.
    ```shell
    cp .env.template .env
    ```
    On Windows Command Prompt, use `copy .env.template .env` instead.

1. Update the `.env` file with your [Plaid API keys][plaid-keys].

1. Install dependencies.
    ```shell
    npm run install:all
    ```
1. Set up the database. Create a `postgres` superuser if one doesn't exist, then initialize the tables.
    ```shell
    createuser -s postgres  # skip if the postgres role already exists
    npm run db:create
    ```
    On Windows/Linux, if your PostgreSQL requires a password, set one for the `postgres` role and update `POSTGRES_PASSWORD` in `.env` to match:
    ```shell
    psql -U postgres -c "ALTER USER postgres PASSWORD 'password';"
    ```
1. Configure ngrok with your authtoken (one-time setup):
    ```shell
    ngrok config add-authtoken <your-authtoken>
    ```
1. Start the app. Run each command in a separate terminal:
    ```shell
    ngrok http 5001   # exposes the server for Plaid webhooks
    npm run server    # starts the backend on port 5001
    npm run client    # starts the frontend on port 3001
    ```
1. Open http://localhost:3001 in a web browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install client and server dependencies |
| `npm run server` | Start the backend server |
| `npm run client` | Start the frontend dev server |
| `npm run db:create` | Initialize the database tables |
| `npm run db:reset` | Drop and recreate all tables |

## Architecture

Pattern consists of multiple components:

-   [`client`][client-readme] runs a [React]-based single-page web frontend on [Vite](https://vite.dev/)
-   [`server`][server-readme] runs an application back-end server using [NodeJS] and [Express]
-   [`database`][database-readme] uses a [PostgreSQL][postgres] database

# Plaid Pattern - Client

The Pattern web client is written in JavaScript using [React]. It presents a basic [Link][plaid-link] workflow to the user, including an implementation of [OAuth][plaid-oauth] as well as a demonstration of [Link update mode][plaid-link-update-mode]. The sample app presents a user's net worth, categorized spending as well as a simple dashboard displaying linked accounts and transactions. The app runs on port 3001 by default.

## Key concepts

### Communicating with the server

Aside from websocket listeners (see below), all HTTP calls to the Pattern server are defined in `src/services/api.tsx`.

### Webhooks and Websockets

The Pattern server is configured to send a message over a websocket whenever it receives a webhook from Plaid. On the client side have websocket listeners defined in `src/components/Sockets.jsx` that wait for these messages and update data in real time accordingly.

### Admin

A view of all users is provided to developers on `http://localhost:3001/admin`. Developers have the ability to remove a user here.

# Plaid Pattern - Server

The application server is written in JavaScript using [Node.js][nodejs] and [Express][expressjs]. It interacts with the Plaid API via the [Plaid Node SDK][plaid-node], and with the [database][database-readme] using [`node-postgres`][node-pg]. While we've used Node for the reference implementation, the concepts shown here will apply no matter what language your backend is written in.

## Key Concepts

### Associating users with Plaid items and access tokens

Plaid does not have a user data object for tying multiple items together, so it is up to application developers to define that relationship. For an example of this, see the [root items route][items-routes] (used to store new items) and the [users routes][users-routes].

### Preventing item duplication

By default, Plaid Link will let a user link to the same institution multiple times. Some developers prefer disallowing duplicate account linkages because duplicate connections still come at an additional cost. It is entirely possible for a user to create multiple items linked to the same financial institution. In practice, you probably want to prevent this. The easiest way to do this is to check the institution id of a newly created item before performing the token exchange and storing the item. For an example of this, see the [root items route][items-routes].

### Using webhooks to update transaction data and test update mode in Link.

Plaid uses [webhooks][transactions-webhooks] to notify you whenever there are changes in the transactions associated with an item. This allows you to make a call to Plaid's transactions sync endpoint only when changes have occurred, rather than polling for them. For an example of this, see the [transactions webhook handler][transactions-handler]. This sample app also demonstrates the use of the sandboxItemResetLogin endpoint to test the webhook used to notify you when a user needs to update their login information at their financial institution.

For webhooks to work, the server must be publicly accessible on the internet. For development purposes, this application uses [ngrok](https://ngrok.com/) to accomplish that.

### Creating and updating transactions to reflect new, modified and removed transactions.

Upon the creation of a new item or receipt of the SYNC_UPDATES_AVAILABLE transactions webhook a call will be made to Plaid's transactions sync endpoint. This will return any changes to transactions that have occurred since you last called the endpoint (or all transactions upon creation of a new item). These changes are then reflected in the database. For an example, see the [update_transactions][update-transactions] file.

### Dynamic Transaction Testing with `user_transactions_dynamic`

The special test credentials **`user_transactions_dynamic`** can be used together with the "Refresh Transactions" button to trigger simulated transaction updates in Sandbox.

**To test with `user_transactions_dynamic`:**

1. Create an account in the Pattern app (with any username)
2. Link a bank account using a **non-OAuth test institution** such as **First Platypus Bank** (`ins_109508`)
   - Note: OAuth institutions like most major banks and Playtypus OAuth Bank will not work with these test credentials - you will be able to complete Link, but you will see the same data as the regular `user_good` test user and not the special `user_transactions_dynamic` data.
3. When prompted for credentials in the Plaid Link flow, enter:
   - **Username:** `user_transactions_dynamic`
   - **Password:** any non-blank password
4. An Item will be created with approximately 50 transactions
5. Click the **"Refresh Transactions"** button next to the linked bank to simulate new transaction activity

**What happens when you click refresh:**
- New pending transactions are generated
- All previously pending transactions are moved to posted
- All appropriate transaction webhooks are fired

### Persona-Based Transaction Testing

For more realistic testing, Plaid also provides persona-based test users: **`user_ewa_user`**, **`user_yuppie`**, and **`user_small_business`**. These accounts simulate real life personas, so new transactions will appear at a more realistic rate and will **not** appear every time `/transactions/refresh` is called. These users have three months of transactions, including some recurring transactions.

**To test with persona-based users:**

1. Link a bank account using a **non-OAuth test institution** such as **First Platypus Bank** (`ins_109508`)
2. When prompted for credentials in the Plaid Link flow, enter one of:
   - **Username:** `user_ewa_user` (any non-blank password)
   - **Username:** `user_yuppie` (any non-blank password)
   - **Username:** `user_small_business` (any non-blank password)
3. Transactions will update at a more realistic rate when you click "Refresh Transactions"

## Debugging

You can debug the server using Node's built-in inspector:

```shell
cd server && node --inspect index.js
```

Then open `chrome://inspect` in Chrome, or use the VS Code debugger to attach to the process.

# Plaid Pattern - Database

The database is a [PostgreSQL][postgres] instance running locally.

Connect using `psql -U postgres` or any PostgreSQL client. Default credentials are in `.env` (user: `postgres`, password: `password`).

## Key Concepts

### Plaid API & Link Identifiers

API and Link Identifiers are crucial for maintaining a scalable and stable integration.
Occasionally, an Institution error may occur due to a bank issue, or a live product pull may fail on request.
To resolve these types of issues, Plaid Identifiers are required to [open a Support ticket in the Dashboard][plaid-new-support-ticket].

`access_tokens` and `item_ids` are the core identifiers that map end-users to their financial institutions.
As such, we are storing them in the database associated with our application users.
**These identifiers should never be exposed client-side.**

Plaid returns a unique `request_id` in all server-side responses and Link callbacks.
A `link_session_id` is also returned in Link callbacks.
These values can be used for identifying the specific network request or Link session for a user, and associating that request or session with other events in your application.
We store these identifiers in database tables used for logging Plaid API requests, as they can be useful for troubleshooting.

For more information, see the docs page on [storing Plaid API identifiers][plaid-docs-api-identifiers].

## Tables

The `*.sql` scripts in the `database/init` directory define the schema. Run `npm run db:create` to initialize, or `npm run db:reset` to drop and recreate.

See the [create.sql][create-script] initialization script to see some brief notes for and the schemas of the tables used in this application.

### Testing with OAuth redirect URIs (optional)

> The sections below are optional: on desktop, OAuth will work without a redirect URI configured. However, using redirect URIs is recommended for best conversion on mobile web, and mandatory when using a Plaid mobile SDK. For more details, see the documentation on [redirect URIs on desktop and mobile web](https://plaid.com/docs/link/oauth/#desktop-web-mobile-web-react-or-webview).

#### In Sandbox
To test with an OAuth redirect URI, in the .env file, set your `PLAID_SANDBOX_REDIRECT_URI` to 'http://localhost:3001/oauth-link' and then register this URI in your Plaid Dashboard at https://dashboard.plaid.com/team/api.

#### In Production

If you want to test OAuth redirect URIs in Production, you need to use https and set `PLAID_PRODUCTION_REDIRECT_URI=https://localhost:3001/oauth-link` in `.env`. In order to run your localhost on https, you will need to create a self-signed certificate and add it to the client root folder. MacOS users can use the following instructions to do this. Note that self-signed certificates should be used for testing purposes only, never for actual deployments.

#### MacOS instructions for using https with localhost

In your terminal, change to the client folder:

```bash
cd client
```

Use homebrew to install mkcert:

```bash
brew install mkcert
```

Then create your certificate for localhost:

```bash
mkcert -install
mkcert localhost
```

This will create a certificate file localhost.pem and a key file localhost-key.pem inside your client folder.

Then in `vite.config.ts` in the client folder, add the `https` option to the `server` config:

```ts
import fs from 'fs';

export default defineConfig({
  // ...
  server: {
    port: 3001,
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
    // ...
  },
});
```

After starting the client, you can view it at https://localhost:3001.

## Troubleshooting

See [`docs/troubleshooting.md`][troubleshooting].

## Additional Resources

-   For an overview of the Plaid platform and products, refer to this [Quickstart guide][plaid-quickstart].
-   Check out this high-level [introduction to Plaid Link](https://blog.plaid.com/plaid-link/).
-   Find comprehensive information on Plaid API endpoints in the [API documentation][plaid-docs].
-   Questions? Please head to the [Help Center][plaid-help] or [open a Support ticket][plaid-support-ticket].

## License

Plaid Pattern is a demo app that is intended to be used only for the purpose of demonstrating how you can integrate with Plaid. You are solely responsible for ensuring the correctness, legality, security, privacy, and compliance of your own app and Plaid integration. The Pattern code is licensed under the [MIT License](LICENSE) and is provided as-is and without warranty of any kind. Plaid Pattern is provided for demonstration purposes only and is not intended for use in production environments.

[create-script]: database/init/create.sql
[plaid-docs-api-identifiers]: https://plaid.com/docs/#storing-plaid-api-identifiers
[plaid-new-support-ticket]: https://dashboard.plaid.com/support/new
[postgres]: https://www.postgresql.org/
[postgres-docs]: https://www.postgresql.org/docs/
[plaid-link]: https://plaid.com/docs/#integrating-with-link
[plaid-oauth]: https://plaid.com/docs/link/oauth/#introduction-to-oauth
[plaid-link-update-mode]: https://plaid.com/docs/link/update-mode/
[react]: https://reactjs.org/
[database-readme]: #plaid-pattern---database
[expressjs]: http://expressjs.com/
[items-routes]: server/routes/items.js
[node-pg]: https://github.com/brianc/node-postgres
[nodejs]: https://nodejs.org/en/
[plaid-node]: https://github.com/plaid/plaid-node
[transactions-handler]: /server/webhookHandlers/handleTransactionsWebhook.js
[update-transactions]: /server/update_transactions.js
[transactions-webhooks]: https://plaid.com/docs/#transactions-webhooks
[users-routes]: server/routes/users.js
[vscode-debugging]: https://code.visualstudio.com/docs/editor/debugging
[client-img]: docs/pattern_screenshot.jpg
[client-readme]: #plaid-pattern---client
[express]: https://expressjs.com/
[nodejs]: https://nodejs.org/en/
[plaid]: https://plaid.com
[plaid-dashboard]: https://dashboard.plaid.com/team/api
[plaid-docs]: https://plaid.com/docs/
[plaid-help]: https://support.plaid.com/hc/en-us
[plaid-keys]: https://dashboard.plaid.com/developers/keys
[plaid-quickstart]: https://plaid.com/docs/quickstart/
[plaid-signup]: https://dashboard.plaid.com/signup
[plaid-support-ticket]: https://dashboard.plaid.com/support/new
[plaid-redirect-uri]: https://plaid.com/docs/link/oauth/#redirect-uri-configuration
[postgres]: https://www.postgresql.org/
[react]: http://reactjs.org/
[server-readme]: #plaid-pattern---server
[troubleshooting]: docs/troubleshooting.md
