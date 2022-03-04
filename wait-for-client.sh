#!/bin/bash
# wait-for-client.sh

# wait for a response from the client
echo -n "Waiting for the client to finish initializing..."
while [ "$(curl -s -o /dev/null -w "%{http_code}" -m 1 localhost:3001)" != "200" ]
do
  sleep 1
  echo -n "."
done

# print message
cat <<EOF

The client is ready!
Open localhost:3001 in your browser to view the client.
Run 'make logs' to view the service logs.
Run 'make stop' to stop the docker containers.
Run 'make help' to view other available commands.
EOF
