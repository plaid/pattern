# Plaid Pattern - Client

The Pattern web client is written in JavaScript using [React]. It presents a basic [Link][plaid-link] workflow to the user, including an implementation of [OAuth][plaid-oauth] as well as a demonstration of [Link update mode][plaid-link-update-mode]. The sample app presents a user's net worth, categorized spending as well as a simple dashboard displaying linked accounts and transactions. The app runs on port 3000 by default, although you can modify this in [docker-compose.yml](../docker-compose.yml).

## Key concepts

### Communicating with the server

Aside from websocket listeners (see below), all HTTP calls to the Pattern server are defined in `src/services/api.js`.

### Webhooks and Websockets

The Pattern server is configured to send a message over a websocket whenever it receives a webhook from Plaid. On the client side have websocket listeners defined in `src/components/Sockets.jsx` that wait for these messages and update data in real time accordingly.

[cra]: https://github.com/facebook/create-react-app
[plaid-link]: https://plaid.com/docs/#integrating-with-link
[plaid-oauth]: https://plaid.com/docs/link/oauth/#introduction-to-oauth
[plaid-link-update-mode]: https://plaid.com/docs/link/update-mode/
[react]: https://reactjs.org/
