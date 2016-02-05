'use strict'

const RecommendationMethods = function (db) {

  const errorCodes = require('../lib/ErrorCodes');

  function getRecommendationsAPI (req, res) {
    const keyword = req.query.keyword || ''; // default to empty string
    getRecommendations(keyword, (err, results) => {
      if (err) {
        res.status(errorCodes.server.code)
        return res.send(errorCodes.server.message + ': ' + err.message.errors);
      }
      // Return recommendations
      res.send({
        'recommendations': results
      });
    });
  }

  function getRecommendations (keyword, callback) {
    const query = `
      MATCH (Person)-[r:REVIEWED]->(Unit)
      WHERE Unit.summary CONTAINS "${keyword}"
      RETURN DISTINCT Unit, r
      ORDER BY r.sentiment DESC
    `;

    db.cypher({ query }, (err, recommendations) => {
      if (err) {
        return callback(err.message.errors);
      }

      // map down to the unit and the review
      recommendations = recommendations.map((recommendation) => {
        return {
          keyword,
          unit: recommendation.Unit.properties,
          reviews: [recommendation.r.properties]
        };
      });

      callback(null, recommendations);
    });
  }

  return {
    getRecommendationsAPI,
    getRecommendations
  }

};

module.exports = RecommendationMethods;
