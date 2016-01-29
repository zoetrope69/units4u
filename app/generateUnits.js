'use strict'
require('dotenv').config();
const db = require('./db');
const units = require('../resources/units.json').units;
const unitMethods = require('./dbMethods/unitMethods')(db);

for (let i = 0; i < units.length; i++) {
  unitMethods.addUnit(units[i], (res) => {
    console.log(res);
  });
}
