'use strict';
require('dotenv').config(); // pull in environment variables from .env

const express = require('express'),
  errorHandler = require('errorhandler'),
  routes = require('./routes'),
  UserMethods = require('./dbMethods/userMethods'),
  UnitMethods = require('./dbMethods/unitMethods'),
  RecommendationMethods = require('./dbMethods/recommendationMethods'),
  db = require('./db');

const app = express(),
  port = process.env.EXPRESS_PORT;

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}

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

const sentiment = require('speakeasy-nlp').sentiment.analyze;

console.log(sentiment('cool dog man'));
