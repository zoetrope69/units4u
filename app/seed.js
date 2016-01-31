'use strict';
require('dotenv').config();
const db = require('./db');
const seedUnits = require('./seedUnits');
const seedStudents = require('./seedStudents');

console.log('Dropping database...');

db.cypher({ query: 'MATCH (n) DETACH DELETE n' }, () => {
  console.log('Database dropped\n');

  console.log('Seeding database...\n');

  console.log('Seeding units...');
  seedUnits(() => {
    console.log('Units seeded\n');

    console.log('Seeding students...');
    seedStudents(() => {
      console.log('Students seeded\n');

      console.log('Database seeded!');
    });
  });

});
