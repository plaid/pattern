# Troubleshooting

If you're experiencing oddities in the app, here are some common problems and their possible solutions.

## Common Issues

### Link returns a 400 error.

e.g.:

```
POST https://sandbox.plaid.com/link/client/get 400 (Bad Request)
Error: Error retrieving info for public key.
```

**Possible solution:** Make sure that your public key is correctly passed in the CLI or included in your `.env` file. Find your public key in your [Dashboard account](https://dashboard.plaid.com/account/keys).

---

## I get a 409 error when linking a duplicate institution for the same user

Plaid Pattern has implemented server logic such that duplicate account linkages are prohibited. See [preventing item duplication](https://github.com/plaid/pattern/tree/master/server#preventing-item-duplication) section for more information.

## I can't access the Plaid Development environment API.\*\*

Before you can access the Development environment, you will need to request access via the [Plaid Dashboard](https://dashboard.plaid.com/overview/development).

## Still need help?

Please head to the [Help Center](https://support.plaid.com/hc/en-us) or [get in touch](https://dashboard.plaid.com/support/new) with Support.
