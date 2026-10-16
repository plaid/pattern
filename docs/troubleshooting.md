# Troubleshooting

Check the server and client terminal output for errors. If you're experiencing oddities in the app, here are some common problems and their possible solutions.

## Common Issues

## I get a 409 error when linking a duplicate institution for the same user

Plaid Pattern has implemented server logic such that duplicate account linkages are prohibited. See [preventing item duplication](https://github.com/plaid/pattern#preventing-item-duplication) section for more information.

## I am not receiving transactions webhooks and my 'reset login' button does not work

For webhooks to work, the server must be publicly accessible on the internet. For development purposes, this application uses [ngrok](https://ngrok.com/) to accomplish that. Each item is registered with the ngrok URL that was active when it was created. ngrok's free plan assigns your account one stable dev domain, so restarting ngrok keeps the same URL. If the URL changes (for example, you switch ngrok accounts), items created before the change will receive no transactions webhooks, and no webhook from the call to sandboxItemResetLogin.

## Still need help?

Please head to the [Help Center](https://support.plaid.com/hc/en-us) or [get in touch](https://dashboard.plaid.com/support/new) with Support.
