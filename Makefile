envfile := ./.env

.PHONY: help start stop logs db-create db-reset sql server client ngrok

TARGET_MAX_CHAR_NUM=20

## Show help
help:
	@echo ''
	@echo 'Usage:'
	@echo '  make <target>'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z_0-9-]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  %-$(TARGET_MAX_CHAR_NUM)s %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

## Install dependencies for client and server
install: $(envfile)
	cd client && npm install --registry https://registry.npmjs.org
	cd server && npm install --registry https://registry.npmjs.org

## Initialize the database (create tables)
db-create:
	psql -U postgres -f database/init/create.sql

## Drop and recreate the database
db-reset:
	psql -U postgres -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	$(MAKE) db-create

## Start an interactive psql session
sql:
	psql -U postgres

## Start the server (port 5001)
server: $(envfile)
	cd server && npm start

## Start the client (port 3001)
client: $(envfile)
	cd client && npm start

## Start ngrok tunnel to expose server for webhooks
ngrok:
	ngrok http 5001

## Start client and server (no webhooks)
start: $(envfile)
	@echo "Starting server and client..."
	@cd server && npm start &
	@cd client && npm start

## Stop background processes
stop:
	@-pkill -f "node index.js" 2>/dev/null || true
	@-pkill -f "vite" 2>/dev/null || true
	@echo "Stopped."

$(envfile):
	@echo "Error: .env file does not exist! Copy .env.template to .env and fill in your keys."
	@exit 1
