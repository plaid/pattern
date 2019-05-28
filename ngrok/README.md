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
