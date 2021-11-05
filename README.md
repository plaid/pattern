# Plaid Pattern

![Plaid Pattern client][client-img]

This is a sample Personal Finance Manager application demonstrating an end-to-end [Plaid][plaid] integration, focused on linking items and fetching transaction data.

The full Plaid Pattern collection of sample apps includes:

[Plaid Pattern Personal Finance Manager](https://github.com/plaid/pattern/) (you are here) - Demonstrates the Plaid Transactions API

[Plaid Pattern Account Funding App](https://github.com/plaid/pattern-account-funding) - Demonstrates the Plaid Auth, Balance, and Identity APIs


Plaid Pattern apps are provided for illustrative purposes and are not meant to be run as production applications.

## Requirements

-   [Docker][docker] Version 2.0.0.3 (31259) or higher, installed, running, and signed in. If you're on **Windows**, check out [this link][wsl] to get set up in WSL.
-   [Plaid API keys][plaid-keys] - [sign up][plaid-signup] for a free Sandbox account if you don't already have one

## Getting Started

Note: We recommend running these commands in a unix terminal. Windows users can use a [WSL][wsl] terminal to access libraries like `make`.

1. Clone the repo.
    ```shell
    git clone https://github.com/plaid/pattern.git
    cd pattern
    ```
1. Create the `.env` file.
    ```shell
    cp .env.template .env
    ```
1. Update the `.env` file with your [Plaid API keys][plaid-keys] and OAuth redirect uri (in sandbox this is 'http<span>://localhost:3001/oauth-link'</span>).

1. You will also need to configure an allowed redirect URI for your client ID through the [Plaid developer dashboard](https://dashboard.plaid.com/team/api).

1. Start the services. The first run may take a few minutes as Docker images are pulled/built for the first time.
    ```shell
    make start
    ```
1. Open http://localhost:3001 in a web browser.
1. View the logs
    ```shell
    make logs
    ```
1. When you're finished, stop the services.
    ```shell
    make stop
    ```

## Additional Commands

All available commands can be seen by calling `make help`.

## Architecture

As a modern full-stack application, Pattern consists of multiple services handling different segments of the stack:

-   [`client`][client-readme] runs a [React]-based single-page web frontend
-   [`server`][server-readme] runs an application back-end server using [NodeJS] and [Express]
-   [`database`][database-readme] runs a [PostgreSQL][postgres] database
-   [`ngrok`][ngrok-readme] exposes a [ngrok] tunnel from your local machine to the Internet to receive webhooks

We use [Docker Compose][docker-compose] to orchestrate these services. As such, each individual service has its own Dockerfile, which Docker Compose reads when bringing up the services.

More information about the individual services is given below.

# Plaid Pattern - Client

The Pattern web client is written in JavaScript using [React]. It presents a basic [Link][plaid-link] workflow to the user, including an implementation of [OAuth][plaid-oauth] as well as a demonstration of [Link update mode][plaid-link-update-mode]. The sample app presents a user's net worth, categorized spending as well as a simple dashboard displaying linked accounts and transactions. The app runs on port 3001 by default, although you can modify this in [docker-compose.yml](../docker-compose.yml).

## Key concepts

### Communicating with the server

Aside from websocket listeners (see below), all HTTP calls to the Pattern server are defined in `src/services/api.js`.

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

Plaid uses [webhooks][transactions-webhooks] to notify you whenever there are new transactions associated with an item. This allows you to make a call to Plaid's transactions endpoint only when there are new transactions available, rather than polling for them. For an example of this, see the [transactions webhook handler][transactions-handler]. This sample app also demonstrates the use of the sandboxItemResetLogin endpoint to test the webhook used to notify you when a user needs to update their login information at their financial institution.

For webhooks to work, the server must be publicly accessible on the internet. For development purposes, this application uses [ngrok][ngrok-readme] to accomplish that. Therefore, if the server is re-started, any items created in this sample app previous to the current session will have a different webhook address attached to it. As a result, webhooks are only valid during the session in which an item is created; for previously created items, no transactions webhooks will be received, and no webhook will be received from the call to sandboxItemResetLogin.

### Updating transactions to remove pending transactions that have posted or cancelled

Upon receipt of a transactions webhook a call will be made to Plaid's transactions endpoint. Incoming transactions are compared to existing transactions. Any existing transactions that are not included in incoming transactions will be removed and any new transactions are added to the database. For an example, see the [handleTransactionsUpdate][transactions-handler] function.

### Testing OAuth

A redirect_uri parameter is included in the linkTokenCreate call and set in this sample app to the PLAID_SANDBOX_REDIRECT_URI you have set in the .env file (`http://localhost:3001/oauth-link`). This is the page that the user will be redirected to upon completion of the OAuth flow at their OAuth institution. When running in Production or Development, you will need to use an `https://` redirect URI, but a localhost http URI will work for Sandbox.

You will also need to configure `http://localhost:3001/oauth-link` as an allowed redirect URI for your client ID through the [Plaid developer dashboard](https://dashboard.plaid.com/team/api).

To test the OAuth flow, choose 'Playtypus OAuth Bank' from the list of financial instutions in Plaid Link.

## Debugging

The node debugging port (9229) is exposed locally on port 9229.

If you are using Visual Studio Code as your editor, you can use the `Docker: Attach to Server` launch configuration to interactively debug the server while it's running. See the [VS Code docs][vscode-debugging] for more information.

# Plaid Pattern - Database

The database is a [PostgreSQL][postgres] instance running inside a Docker container.

Port 5432 is exposed to the Docker host, so you can connect to the DB using the tool of your choice.
Username and password can be found in [docker-compose.yml][docker-compose].

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

The `*.sql` scripts in the `init` directory are used to initialize the database if the data directory is empty (i.e. on first run, after manually clearing the db by running `make clear-db`, or after modifying the scripts in the `init` directory).

See the [create.sql][create-script] initialization script to see some brief notes for and the schemas of the tables used in this application.
While most of them are fairly self-explanitory, we've added some additional notes for some of the tables below.

### link_events_table

This table stores responses from the Plaid API for client requests to the Plaid Link client.

User flows that this table captures (based on the client implementation, which hooks into the `onExit` and `onSuccess` Link callbacks):

-   User opens Link, closes without trying to connect an account.
    This will have type `exit` but no request_id, error_type, or error_code.
-   User tries to connect an account, fails, and closes link.
    This will have type `exit` and will have a request_id, error_type, and error_code.
-   User successfully connects an account.
    This will have type `success` but no request_id, error_type, or error_code.

### plaid_api_events_table

This table stores responses from the Plaid API for server requests to the Plaid client.
The server stores the responses for all of the requests it makes to the Plaid API.
Where applicable, it also maps the response to an item and user.
If the request returned an error, the error_type and error_code columns will be populated.

## Learn More

-   [PostgreSQL documentation][postgres-docs]

# Plaid Pattern - ngrok

This demo includes [ngrok](https://ngrok.com/), a utility that creates a secure tunnel between your local machine and the outside world. We're using it here to expose the local webhooks endpoint to the internet.

Browse to [localhost:4040](http://localhost:4040/inspect/http) to see the ngrok dashboard. This will show any traffic that gets routed through the ngrok URL.

**Do NOT use ngrok in production!** It's only included here as a convenience for local development and is not meant to be a production-quality solution.

Don’t want to use ngrok? As long as you serve the app with an endpoint that is publicly exposed, all the Plaid webhooks will work.

ngrok's free account has a session limit of 8 hours. To fully test out some of the transaction webhook workflows, you will need to get a more persistent endpoint as noted above when using the development environment.

## Source

This image is a copy of the Docker Hub image [wernight/ngrok](https://hub.docker.com/r/wernight/ngrok/dockerfile). We've copied it here to allow us to more closely version it and to make changes as needed.

## Learn More

-   https://hub.docker.com/r/wernight/ngrok/dockerfile
-   https://github.com/wernight/docker-ngrok/tree/202c4692cbf1bbfd5059b6ac56bece42e90bfb82

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
[docker-compose]: ./docker-compose.yml
[plaid-docs-api-identifiers]: https://plaid.com/docs/#storing-plaid-api-identifiers
[plaid-new-support-ticket]: https://dashboard.plaid.com/support/new
[postgres]: https://www.postgresql.org/
[postgres-docs]: https://www.postgresql.org/docs/
[cra]: https://github.com/facebook/create-react-app
[plaid-link]: https://plaid.com/docs/#integrating-with-link
[plaid-oauth]: https://plaid.com/docs/link/oauth/#introduction-to-oauth
[plaid-link-update-mode]: https://plaid.com/docs/link/update-mode/
[react]: https://reactjs.org/
[database-readme]: #plaid-pattern---database
[expressjs]: http://expressjs.com/
[items-routes]: server/routes/items.js
[ngrok-readme]: #plaid-pattern---ngrok
[node-pg]: https://github.com/brianc/node-postgres
[nodejs]: https://nodejs.org/en/
[plaid-node]: https://github.com/plaid/plaid-node
[transactions-handler]: /server/webhookHandlers/handleTransactionsWebhook.js
[transactions-webhooks]: https://plaid.com/docs/#transactions-webhooks
[users-routes]: server/routes/users.js
[vscode-debugging]: https://code.visualstudio.com/docs/editor/debugging
[client-img]: docs/pattern_screenshot.jpg
[client-readme]: #plaid-pattern---client
[docker]: https://docs.docker.com/
[docker-compose]: https://docs.docker.com/compose/
[express]: https://expressjs.com/
[ngrok]: https://ngrok.com/
[nodejs]: https://nodejs.org/en/
[plaid]: https://plaid.com
[plaid-dashboard]: https://dashboard.plaid.com/team/api
[plaid-docs]: https://plaid.com/docs/
[plaid-help]: https://support.plaid.com/hc/en-us
[plaid-keys]: https://dashboard.plaid.com/account/keys
[plaid-quickstart]: https://plaid.com/docs/quickstart/
[plaid-signup]: https://dashboard.plaid.com/signup
[plaid-support-ticket]: https://dashboard.plaid.com/support/new
[plaid-redirect-uri]: https://plaid.com/docs/link/oauth/#redirect-uri-configuration
[postgres]: https://www.postgresql.org/
[react]: http://reactjs.org/
[server-readme]: #plaid-pattern---server
[troubleshooting]: docs/troubleshooting.md
[wsl]: https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly
