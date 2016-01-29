'use strict'

/* eslint no-unused-vars: 1 */

const UnitMethods = function (db) {

  const errorCodes = require('../lib/ErrorCodes');

  function addUnitAPI (req, res) {
    const userData = req.body;
    if (!userData.hasOwnProperty('name') || !userData.name.length > 0) {
      res.status(errorCodes.server.code);
      return res.send(errorCodes.server.message);
    }
    addUser(userData, (err, results) => {
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
    const query = `
      CREATE (n:Person {name:  ${'\'' + unit.code + '\''} , interests: ${'\'' + unit.name + '\''}}) RETURN n
    `;
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

  function findUnit(unit) {
    const query = `
        MATCH (n:Person { title: ${'\'' + username + '\''} }) RETURN n
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
