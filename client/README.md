# Plaid Pattern - Client

The Pattern web client is written in JavaScript using [React]. It presents a basic [Link][plaid-link] workflow to the user, as well as a simple dashboard displaying linked accounts and transactions. The app runs on port 3000 by default, although you can modify this in [docker-compose.yml](../docker-compose.yml).

## Key concepts

### Communicating with the server
Aside from websocket listeners (see below), all HTTP calls to the Pattern server are defined in `src/services/api.js`.

### Instantiating Link
You'll notice that we don't create a Link instance until the user clicks the Link button. This is because we need information about which user or item to set up Link for before we can create the instance, both for the purposes of setting the necessary callbacks and for letting Plaid know whether we're adding a new item or updating an existing one. Note also that we maintain each individual Link instance indefinitely after creation, so we don't need to repeatedly recreate the same instances for the same users and items. This has a minimal memory footprint relative to the initial load of the Link SDK.

### Webhooks and Websockets
The Pattern server is configured to send a message over a websocket whenever it receives a webhook from Plaid. On the client side have websocket listeners defined in `src/components/Sockets.jsx` that wait for these messages and update data in real time accordingly.

[cra]: https://github.com/facebook/create-react-app
[plaid-link]: https://plaid.com/docs/#integrating-with-link
[react]: https://reactjs.org/
