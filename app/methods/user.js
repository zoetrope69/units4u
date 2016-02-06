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
  function addUserAPI (req, res) {
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
    });
  }

  function addUser (user, callback) {
    const query = `
      CREATE (:Person {
        name: "${user.name}",
        year: ${user.year},
        units: ["${user.units.join('", "')}"]
      })
    `;

    db.cypher({ query }, callback);
  }

  /**
   * Get user & interests.
   */
  function getUserAPI (req, res) {
    if (!req.params.username) {
      res.status(errorCodes.request.code);
      return res.send(errorCodes.request.message);
    }

    getUser(req.params.username, (err, results) => {
      if (err) {
        return console.log('error:', err.message.errors);
      }

      const result = results[0];

      // Return ID number and a time reference.
      res.send({
        'id': result.p._id,
        'interests': result.p.properties.interests
      });
    });
  }

  function getUser (name, callback) {
    const query = `MATCH (p:Person { name: "${name}" }) RETURN p`;
    db.cypher({ query }, callback);
  }

  /**
   * Add review & studied relationships to DB.
   *
   * {
   *   "review": {
   *       "sentiment": 0.5,
   *       "keywords": ["difficult", "java"]
   *   },
   *   "unit": "WEBSCRP"
   * }
   */
  function addReviewAPI (req, res) {
    if (!req.params.username) {
      res.status(errorCodes.request.code);
      return res.send(errorCodes.request.message);
    }

    const userData = req.body;

    addReview(req.params.name, userData.review, (err) => {
      if (err) {
        console.log(err);
        res.status(errorCodes.server.code);
        return res.send(errorCodes.server.message);
      }

      res.send('ok');
    });

  }

  function addReview (name, review, callback) {
    // Need a user and a unit ID.
    // (Keanu)-[:REVIEWED {sentiment:0.8, keywords:['maths', 'hard', 'fun']}]->(COSINE)
    const query = `
      MATCH (a:Person { name: "${name}" }), (u:Unit { code: "${review.unit}" })
      CREATE (a)-[:REVIEWED {sentiment: ${review.sentiment}, summary: "${review.summary}", grade: ${review.grade}} ]->(u)
    `;

    db.cypher({ query }, callback);
  }

  return {
    addUser,
    addUserAPI,
    getUser,
    getUserAPI,
    addReview,
    addReviewAPI
  }

};

module.exports = UserMethods;
