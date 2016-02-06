'use strict'

function setup (app, methods) {
  // api

  app.put('/api/units', methods.units.addUnitAPI);
  app.get('/api/units/:unitcode', methods.units.getUnitAPI);

  app.put('/api/users/', methods.users.addUserAPI);
  app.get('/api/users/:username', methods.users.getUserAPI);
  app.put('/api/users/:username/review', methods.users.addReviewAPI);

  app.get('/api/recommendation', methods.recommendations.getRecommendationsAPI);

  app.get('/api/jobs', methods.jobs.getJobsAPI);

  // client
  app.get('/', (req, res) => res.render('home', { DEV: process.env.NODE_ENV === 'development' }));
}

exports.setup = setup;
