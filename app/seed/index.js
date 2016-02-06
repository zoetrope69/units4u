'use strict';
require('dotenv').config();

const db = require('../db');
const spelling = require('./spelling');

const seed = function (callback) {

  console.log('Correcting spelling of review summaries...');

  spelling(() => {
    console.log('Corrected spelling of review summaries\n');

    console.log('Dropping database...');

    db.cypher({ query: 'MATCH (n) DETACH DELETE n' }, () => {
      console.log('Database dropped\n');

      console.log('Seeding database...\n');

      console.log('Seeding units...');

      const seedUnits = require('./units');
      seedUnits(() => {
        console.log('Units seeded\n');

        console.log('Seeding students...');
        const seedStudents = require('./students');
        seedStudents(() => {
          console.log('Students seeded\n');

          console.log('Database seeded!');
          callback();
        });
      });
    });
  });

}

module.exports = seed;
