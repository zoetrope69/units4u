'use strict'

/* eslint no-unused-vars: 1 */

const UnitMethods = function (db) {

  const errorCodes = require('../lib/ErrorCodes');

  function addUnitAPI (req, res) {
    const unitData = req.body;
    if (!unitData.hasOwnProperty('unitcode') || !unitData.unitcode.length > 0) {
      res.status(errorCodes.server.code);
      return res.send(errorCodes.server.message);
    }
    addUnit(unitData, (err, results) => {
      if (err) {
        res.status(errorCodes.server.code)
        return res.send(errorCodes.server.message + ': ' + err.message.errors);
      }
      const result = results[0];
      // Return ID number and an important time
      res.send({
        'id': result.n._id
      });
    })
  }

  function addUnit (unit, callback) {
    const query = `CREATE (${unit.id}:Unit {code: '${unit.id}', title:'${unit.name}', summary: '${unit.summary}', coursework: ${unit.coursework}, exam: ${unit.exam}})`;
    db.cypher({ query }, callback);
  }

  function findUnitAPI (req, res) {
    if (!req.params.unitcode) {
      res.status(errorCodes.request.code);
      return res.send(errorCodes.request.message);
    }
    findUnit(req.params.unitcode, (err, results) => {
      if (err) {
        res.status(errorCodes.server.code)
        return res.send(errorCodes.server.message + ': ' + err.message.errors);
      }
      const result = results[0];
      // Return ID number and an important time
      res.send({
        'unit': result.n
      });
    });
  }

  function findUnit (unitcode, callback) {
    const query = `
        MATCH (n:Unit { unitcode: ${'\'' + unitcode + '\''} }) RETURN n
    `;
    db.cypher({ query }, callback);
  }

  return {
    addUnit,
    addUnitAPI,
    findUnit,
    findUnitAPI
  }

};

module.exports = UnitMethods;
