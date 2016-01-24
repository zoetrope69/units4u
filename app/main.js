'use strict';
require('dotenv').config(); // pull in environment variables from .env

const db = require('./db');

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

const sentiment = require('speakeasy-nlp').sentiment.analyze;

console.log(sentiment('cool dog man'));
