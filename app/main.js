'use strict';
require('dotenv').config(); // pull in environment variables from .env

const express = require('express'),
  errorHandler = require('errorhandler'),
  routes = require('./routes'),
  bodyParser = require('body-parser'),
  expressHandlebars = require('express-handlebars'),
  UserMethods = require('./dbMethods/userMethods'),
  UnitMethods = require('./dbMethods/unitMethods'),
  RecommendationMethods = require('./dbMethods/recommendationMethods'),
  JobsMethods = require('./dbMethods/jobsMethods'),
  db = require('./db');

const app = express(),
  port = process.env.EXPRESS_PORT;

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}

app.use(bodyParser.json()) // parse application/json

app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

const expressHandlebarsOptions = {
  layoutsDir: __dirname + '/views/layouts',
  defaultLayout: 'main',
  extname: '.hbs'
};
app.engine('hbs', expressHandlebars(expressHandlebarsOptions));
app.set('view engine', 'hbs');

const methods = {
  users: new UserMethods(db),
  units: new UnitMethods(db),
  recommendations: new RecommendationMethods(db),
  jobs: new JobsMethods()
}

function start () {
  routes.setup(app, methods);
  app.listen(port);
  console.log(`Express server listening on port ${port} in ${app.settings.env} mode.`);
}

exports.start = start;
exports.app = app;

start();
