'use strict'

function setup (app, methods) {

  app.put('/api/units', methods.units.addUnit);
  app.get('/api/units/:unitcode', methods.units.findUnit);

  app.put('/api/users/:username', methods.users.addUser);
  app.get('/api/users/:username', methods.users.getUser);
  app.put('/api/users/:username/review', methods.users.addReview);

  app.get('/api/recommendation', methods.recommendations.findRecommendations);

}

exports.setup = setup;
