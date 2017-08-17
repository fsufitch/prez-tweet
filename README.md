Modern Presidential Tweeting
============================

> See me live here: https://modernpersidentialtweeting.herokuapp.com

This is a project attempting to define what "modern day presidential" tweets
are, as referred to by the USA's 45th president:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">My use of social media is not Presidential - it’s MODERN DAY PRESIDENTIAL. Make America Great Again!</p>&mdash; Donald J. Trump (@realDonaldTrump) <a href="https://twitter.com/realDonaldTrump/status/881281755017355264">July 1, 2017</a></blockquote>

Prerequisites
-------------

The following 3rd party software is required to build and run the project:

- Backend API
  - Go 1.8
  - Glide 0.12.3
  - PostgreSQL 9.6
- Web UI
  - NodeJS 8.1.3
  - NPM 5.0.3

The use of Go/NodeJS means the development platform is agnostic of operating
system.

Building the Backend
--------------------

First, you must clone this repository in `$GOPATH/src/github.com/fsufitch/prez-tweet`.

Next, run the following command to install and vendor all required software:

    glide install

To build the statically linked Go executable, run:

    go build github.com/fsufitch/prez-tweet

This creates a `prez-tweet` (or `prez-tweet.exe`, depending on platform) file
that contains everything needed to run the API.

Building the Web UI
-------------------

The web UI uses NPM scripts and configuration. To install everything needed for
building it, run:

    npm install

Next, to build the distributable artifacts, run:

    npm run webpack

The output JS and other files will be located under `dist/dev/`.

> This command is affected by the `ENV` environment variable. Current recognized
  values are `dev` and `prod`. This affects several things, including code
  minification, source map generation, Angular debug mode, and destination of
  build artifacts. If `ENV=prod`, then the build artifacts will be placed in
  `dist/prod/`.

Configuration
-------------

The backend is configured via environment variables; the web UI gets any
relevant configuration from the backend. The backend's environment variables are:

| Variable         | Required    | Description  |
| ---------------- |-------------| ------------ |
| PORT             | yes         | the port on which the backend should run |
| UI_RES_URL       | yes         | HTTP address at which the backend should mirror the web UI from |
| API_HOST         | yes         | host and port the web UI should use to contact the backend |
| DATABASE_URL     | yes         | `postgres://` connection string for the application DB |
| PROXY_CACHE_TTL  | yes         | the duration (in seconds) that the backend should cache web UI files; should be 0 when doing web UI development to disable caching |
| TWITTER_AUTH     | yes         | Twitter keys/tokens for OAuth authorization, formatted as: `api_key::api_secret::access_token::access_token_secret` |
| WEBPACK_DEV_SERVER_PORT | no   | the port on which the Webpack dev server should run (default: 8888) |

Development Operation
---------------------

**1. Environment Variables**

For development, the repository contains some sample environment configuration
under `scripts/dev-environment.{bat,sh}`. `TWITTER_AUTH` is **not** included.
Inject them into your environment as appropriate for your platform.

**2. Database Setup**

The database can be set up/torn down for development using these SQL scripts:

- [`dev-db-setup.sql`](scripts/dev-db-setup.sql) - create a user and database, and grant full access
- [`dev-db-drop.sql`](scripts/dev-db-drop.sql) - drop both user and entire database

In Heroku production, user/database creation is handled by the Heroku PostgreSQL App.

**3. Run the Backend**

To start the backend server, simply run:

    ./prez-tweet serve

Or, to both build and run:

    go run main.go serve

Both these modes of execution require a manual re-compile/restart to receive
code changes.

**4. Run the Web UI**

To start the web UI development server, run:

    npm run webpack:server

This compiles all the necessary resources into a temporary location and serves
them on the port specified by `WEBPACK_DEV_SERVER_PORT` (or 8888). The backend
must be configured to recognize this location they are served, just as the
web UI must be configured to know where to contact the backend.

**5. Import Historical Tweet Data (optional)**

The repository includes a repository of old tweets by `@BarackObama`,
`@realDonaldTrump`, `@POTUS44` and `@POTUS`, most of which cannot be normally
accessed using Twitter's API. It is found in [`tweet-archive.json`](tweeet-archive.json).

To import this data into your development server, run:

    ./prez-tweet import-archive tweet-archive.json

> The data is generated by a scraping method contained in the
> [`twitter-scrape`]('twitter-scrape/') directory. To run it, install the go
> package `github.com/fsufitch/prez-tweet/twitter-scrape/cmd/twitter-scrape`, then
> use the `twitter-scrape` command (which is fairly self explanatory).
>
> This scraper is inspired by [GOT](https://github.com/Jefferson-Henrique/GetOldTweets-python).

**6. Visit the Backend's Root URL**

Navigate your browser to `http://localhost:8080`, or whatever port your backend is running on.
The backend will serve you the proxied web UI files from there.

Backend API
-----------

This is a quick summary of the functionality provided by the backend's endpoints:

- `GET /status` - Provide server status in JSON format
- `GET /latest` - Retrieve the tweet IDs of the latest presidential tweets
- `GET /tweet/{id}` - Retrieve details about a specific tweet and the ones bracketing
  it in its timeline
- **Synchronized tweet browsing** - These endpoints enable browsing tweets by keeping
  their dates aligned (with an optional offset)
  - `GET /syncApplyOffset?tweet1=XXX&tweet2=YYY&tweet1_offset_years=ZZZ` - Apply
    the given offset to the pair of tweets in question, and return the new tweet IDs;
    i.e. "replace the first tweet with a tweet by the same author but set
    ZZZ years before the second tweet"
  - *(Deprecated)* `GET /syncOlder?tweet1=XXX&tweet2=YYY&tweet1_offset_years=ZZZ` - Navigate backward
    in time, replacing the newer of the two tweets with the next oldest tweet by the
    same author, and taking into account the offset
  - *(Deprecated)* `GET /syncNewer?tweet1=XXX&tweet2=YYY&tweet1_offset_years=ZZZ` - Navigate forward
    in time, replacing the older of the two tweets with the next newest tweet by the
    same author, and taking into account the offset
- **Tweet pairs** - These endpoints provide unique IDs for pairs of tweets, for permalinking
  - `POST /pair` - Take a pair of tweet IDs and return the pair's ID and shortened ID;
    create the pair if necessary; expected body: `{tweet1_id_str: "string", tweet2_id_str: "string"}`
  - `GET /pair/{shortID}` - Given a shortened ID, return the corresponding pair and
    associated data.
