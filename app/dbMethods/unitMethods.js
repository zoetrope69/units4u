'use strict'

/* eslint no-unused-vars: 1 */

const UnitMethods = function (db) {

  function addUnit (req, res) {
    console.log(req);
    res.send('add a unit to the db');
  }

  function findUnit (req, res) {
    console.log(req);
    res.send('find a unit, keywords, and avg sentiments');
  }

  return {
    addUnit,
    findUnit
  }

};

module.exports = UnitMethods;
