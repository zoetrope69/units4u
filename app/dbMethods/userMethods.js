'use strict'

/**
 * User API methods.
 * That's right, their name is the primary key.
 *
 * @param neo4j.GraphDatabase db Database connection object
 */
const UserMethods = function (db) {

  const errorCodes = require('../lib/ErrorCodes');

  /**
  * Add a user to the database, along with their interests.
  * Format might be:
  * {
  *   "name": "Sally",
  *   "interests": ["web", "html", "css", "javascript", "Oracle Databases?"]
  * }
  **/
  function addUser (req, res) {
    const userData = req.body;
    if (!userData.hasOwnProperty('name') || !userData.name.length > 0) {
      res.status(errorCodes.server.code);
      return res.send(errorCodes.server.message);
    }
    const query = `
      CREATE (n:Person {name:  ${'\'' + userData.name + '\''} , interests: ${'\'' + userData.interests + '\''}}) RETURN n
    `;
    db.cypher({ query }, (err, results) => {
      if (err) {
        res.status(errorCodes.server.code)
        return res.send(errorCodes.server.message + ': ' + err.message.errors);
      }
      const result = results[0];
      // Return ID number and an important time
      res.send({
        'id': result.n._id
      });
    });
  }

  /**
   * Find user & interests.
   */
  function getUser (req, res) {
    if (!req.params.username) {
      res.status(errorCodes.request.code);
      return res.send(errorCodes.request.message);
    }
    const username = req.params.username,
      query = `
        MATCH (n:Person { name: ${'\'' + username + '\''} }) RETURN n
    `;
    db.cypher({ query }, (err, results) => {
      if (err) {
        return console.log(err.message.errors);
      }
      const result = results[0];
      // Return ID number and a time reference.
      res.send({
        '_id': result.n._id,
        'interests': result.n.properties.interests
      });
    });
  }

  /**
   * Add review & studied relationships to DB.
   */
  function addReview (req, res) {
    console.log(req);
    res.send('add a review to a specified user');
  }

  return {
    addUser,
    getUser,
    addReview
  }

};

module.exports = UserMethods;
