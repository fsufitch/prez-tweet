#!/bin/sh

# Port to run the API server on
export PORT=8080

# Port to run webpack-dev-server on (for local dev)
export WEBPACK_DEV_SERVER_PORT=8888

# Location to find static resources at (the webpack-dev-server)
export UI_RES_URL=http://localhost:8888

# Location for the API server to find itself
export API_HOST=localhost:8080

# Postgres database URL
export DATABASE_URL=postgres://preztweet:preztweet-dev@localhost:5432/preztweet?sslmode=disable

# Proxy cache TTL, in seconds; 0 for UI development, 600 otherwise
export PROXY_CACHE_TTL=0
#export PROXY_CACHE_TTL=600
