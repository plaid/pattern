#!/bin/bash
# wait-for-client.sh

# wait for a response from the client
echo -n "Waiting for the client to finish initializing..."
while [ "$(curl -s -o /dev/null -w "%{http_code}" -m 1 localhost:3000)" != "200" ]
do
  sleep 1
  echo -n "."
done

# print message
echo
echo "The client is ready!"
echo "Open localhost:3000 in your browser to view the client."
echo "Run 'make logs' to view the service logs."
echo "Run 'make stop' to stop the docker containers."
echo "Run 'make help' to view other available commands."
