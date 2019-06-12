# Plaid Pattern (Beta)

![Plaid Pattern client][client-img]

This is a reference application demonstrating an end-to-end [Plaid][plaid] integration, focused on linking items and fetching transaction data.

**This is not meant to be run as a production application.**

## Requirements

-   [Docker][docker] Version 2.0.0.3 (31259) or higher, installed and running
-   [Plaid API keys][plaid-keys] - [sign up][plaid-signup] for a free Sandbox account if you don't already have one

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
1. Update the `.env` file with your [Plaid API keys][plaid-keys].
1. Start the services. The first run may take a few minutes as Docker images are pulled/built for the first time.
    ```shell
    make start
    ```
1. Open http://localhost:3000 in a web browser.
1. When you're finished, stop the services.
    ```shell
    make stop
    ```

## Additional Commands

All available commands can be seen by calling `make help`.

## Architecture

For more information about the individual services, see the readmes for the [client][client-readme], [database][database-readme], and [server][server-readme].

## Troubleshooting

See [`docs/troubleshooting.md`][troubleshooting].

## Additional Resources

-   For an overview of the Plaid platform and products, refer to this [Quickstart guide][plaid-quickstart].
-   Check out this high-level [introduction to Plaid Link](https://blog.plaid.com/plaid-link/).
-   Find comprehensive information on Plaid API endpoints in the [API documentation][plaid-docs].
-   Questions? Please head to the [Help Center][plaid-help] or [open a Support ticket][plaid-support-ticket].

## License

[MIT](LICENSE)

[client-img]: docs/pattern_screenshot.png
[client-readme]: client/README.md
[database-readme]: database/README.md
[docker]: https://www.docker.com/products/docker-desktop
[plaid]: https://plaid.com
[plaid-docs]: https://plaid.com/docs/
[plaid-help]: https://support.plaid.com/hc/en-us
[plaid-keys]: https://dashboard.plaid.com/account/keys
[plaid-quickstart]: https://plaid.com/docs/quickstart/
[plaid-signup]: https://dashboard.plaid.com/signup
[plaid-support-ticket]: https://dashboard.plaid.com/support/new
[server-readme]: server/README.md
[troubleshooting]: docs/troubleshooting.md
