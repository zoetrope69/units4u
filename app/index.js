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

  db = require('./db'),
  seed = require('./seed');

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

function serve () {
  app.listen(port);
  console.log(`Express server listening on port ${port} in ${app.settings.env} mode.`);
}

function start () {
  routes.setup(app, methods);

  // check to see if database is seeded
  db.cypher({ query: 'MATCH n RETURN n LIMIT 1' }, (err, results) => {
    if (err) {
      if (err.code === 'ECONNREFUSED') {
        console.log(`Can't connect to Neo4j at ${process.env.NEO4J_URL}, is it running?`);
      }
      return console.log(err);
    }

    // seed database if no results at all
    if (process.env.NEO4J_SEED === 'true' || results.length < 1) {
      seed(() => {
        serve();
      });
    } else {
      // if already seeded just serve up
      serve();
    }

  });

}

exports.start = start;
exports.app = app;

start();
