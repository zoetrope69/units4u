'use strict';
require('dotenv').config(); // pull in environment variables from .env

const db = require('./db');

const jobs = require('./jobs');

const query = `
  MATCH (p:Person)-[s:STUDIED]->(unit)
  WHERE "javascript" in p.interests
  AND s.sentiment > 0.5 RETURN unit.title
`;

db.cypher({ query }, (err, results) => {

  if (err) {
    return console.log(err.message.errors);
  }

  const result = results[0];

  console.log(result['unit.title']);

});

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
