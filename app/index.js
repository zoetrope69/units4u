'use strict';
require('dotenv').config(); // pull in environment variables from .env

const express = require('express'),
  errorHandler = require('errorhandler'),
  bodyParser = require('body-parser'),
  expressHandlebars = require('express-handlebars'),

  routes = require('./routes'),
  UserMethods = require('./methods/user'),
  UnitMethods = require('./methods/unit'),
  RecommendationMethods = require('./methods/recommendation'),
  JobMethods = require('./methods/job'),

  db = require('./db');

const app = express(),
  port = process.env.PORT;

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
  jobs: new JobMethods()
}

function start () {
  routes.setup(app, methods);
  app.listen(port);
  console.log(`Express server listening on port ${port} in ${app.settings.env} mode.`);
}

exports.start = start;
exports.app = app;

start();
