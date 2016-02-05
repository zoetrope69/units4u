'use strict'

function setup (app, methods) {

  // api

  app.put('/api/units', methods.units.addUnitAPI);
  app.get('/api/units/:unitcode', methods.units.getUnitAPI);

  app.put('/api/users/', methods.users.addUserAPI);
  app.get('/api/users/:username', methods.users.getUserAPI);
  app.put('/api/users/:username/review', methods.users.addReviewAPI);

  app.get('/api/recommendation', methods.recommendations.getRecommendationsAPI);

  // client

  app.get('/', (req, res) => res.render('home'));

}

exports.setup = setup;
