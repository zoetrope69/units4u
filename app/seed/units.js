'use strict'
const db = require('../db');
const units = require(__dirname + '/../../resources/units.json').units;
const unitMethods = require('../methods/unit')(db);

const seedUnits = (callback) => {
  let unitsCount = units.length;

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    unitMethods.addUnit(unit, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Added unit ${unit.id}`, res);
      }

      unitsCount--;

      if (unitsCount <= 0) {
        callback();
      }
    });
  }
}

module.exports = seedUnits;
