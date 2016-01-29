'use strict';
require('dotenv').config(); // pull in environment variables from .env

const express = require('express'),
  errorHandler = require('errorhandler'),
  routes = require('./routes'),
  bodyParser = require('body-parser'),
  UserMethods = require('./dbMethods/userMethods'),
  UnitMethods = require('./dbMethods/unitMethods'),
  RecommendationMethods = require('./dbMethods/recommendationMethods'),
  db = require('./db'),

  jobs = require('./jobs'),
  sentiment = require('speakeasy-nlp').sentiment.analyze;

const app = express(),
  port = process.env.EXPRESS_PORT;

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}

app.use(bodyParser.json()) // parse application/json

const methods = {
  users: new UserMethods(db),
  units: new UnitMethods(db),
  recommendations: new RecommendationMethods(db)
}

function start () {
  routes.setup(app, methods);
  app.listen(port);
  console.log(`Express server listening on port ${port} in ${app.settings.env} mode.`);
}

exports.start = start;
exports.app = app;

start();

// sentiment analysis

console.log(sentiment('cool dog man'));

// jobs get

jobs.search({
  amount: 1000,
  country: 'gb',
  location: 'London, UK',
  keywords: ['php', 'developer', 'html', 'css']
}, (err, results) => {
  if (err) {
    return console.log(err);
  }

  console.log(results);
});
