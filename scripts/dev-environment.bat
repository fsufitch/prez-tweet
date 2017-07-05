@echo off
:: Port to run the API server on
set PORT=8080

:: Port to run webpack-dev-server on (for local dev)
set WEBPACK_DEV_SERVER_PORT=8888

:: Location to find static resources at (the webpack-dev-server)
set UI_RES_URL=http://localhost:8888

:: Location for the API server to find itself
set API_HOST=localhost:8080

:: Postgres database URL
set DATABASE_URL=postgres://preztweet:preztweet-dev@localhost:5432/preztweet?sslmode=disable
