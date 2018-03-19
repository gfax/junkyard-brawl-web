<p align="center">
  <img src="https://raw.githubusercontent.com/gfax/junkyard-brawl-web/master/logo.jpg" alt="Junkyard Brawl">
</p>

[![Build Status](https://travis-ci.org/gfax/junkyard-brawl-web.svg?branch=master)](https://travis-ci.org/gfax/junkyard-brawl-web)

# Junkyard Brawl Web App

- [Overview](#overview)
- [Development and testing](#development-and-testing)
- [Building and deploying](#building-and-deploying)

## Overview

**Status: currently in development.**

This is the server-side and client-side applications for playing Junkyard Brawl in your favorite device's browser.
The backend server is written in nodejs and the frontend is written with [Vue.js](https://vuejs.org/) and bundled with [webpack](https://webpack.js.org/).

## Development and testing

To get the local dev servers running, follow the commands:

```sh
cd server # first provision the backend server side
npm install # install application and dev dependencies
npm start # start the websocket server
```

This will start a websocket server on port 4000.
Now do the same to get the client running locally:

```sh
cd client
npm install
npm start
```

Now you can go to `http://localhost:8000` and see a live copy of the app.
Any changes to the javascript, templates, or stylesheets will trigger the browser to automatically refresh.
Any changes made on the server side will require restarting it manually.
Other commands useful for testing your syntax before pushing up live are:

```sh
npm run eslint # run linter on the javascript
npm run eslint:fix # automatically fix any javascript errors found
npm run test # this will run eslint and the build command
```

## Building and deploying

To build the distribution folder (`dist/`), run the command:

```sh
npm run build
```
