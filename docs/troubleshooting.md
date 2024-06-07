# Troubleshooting

View the logs with the following Docker command:

```shell
make logs
```

If you're experiencing oddities in the app, here are some common problems and their possible solutions.

## Common Issues

## I get a 409 error when linking a duplicate institution for the same user

Plaid Pattern has implemented server logic such that duplicate account linkages are prohibited. See [preventing item duplication](https://github.com/plaid/pattern/tree/master/server#preventing-item-duplication) section for more information.

## I am not receiving transactions webhooks and my 'reset login' button does not work

For webhooks to work, the server must be publicly accessible on the internet. For development purposes, this application uses [ngrok][ngrok-readme] to accomplish that. Therefore, if the server is re-started, any items created in this sample app previous to the current session will have a different webhook address attached to it. As a result, webhooks are only valid during the session in which an item is created; for previously created items, no transactions webhooks will be received, and no webhook will be received from the call to sandboxItemResetLogin. In addition, ngrok webhook addresses are only valid for 2 hours. If you are not receiving webhooks in this sample application, restart your server to reset the ngrok webhook address.

## Still need help?

Please head to the [Help Center](https://support.plaid.com/hc/en-us) or [get in touch](https://dashboard.plaid.com/support/new) with Support.
