'use strict';
require('dotenv').config();
const db = require('./db');
const correctReviews = require('./correctReviews');

console.log('Correcting spelling of review summaries...');

correctReviews(() => {
  console.log('Corrected spelling of review summaries\n');

  console.log('Dropping database...');

  db.cypher({ query: 'MATCH (n) DETACH DELETE n' }, () => {
    console.log('Database dropped\n');

    console.log('Seeding database...\n');

    console.log('Seeding units...');

    const seedUnits = require('./seedUnits');
    seedUnits(() => {
      console.log('Units seeded\n');

      console.log('Seeding students...');
      const seedStudents = require('./seedStudents');
      seedStudents(() => {
        console.log('Students seeded\n');

        console.log('Database seeded!');
      });
    });

  });

});
