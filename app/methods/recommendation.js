'use strict'

const RecommendationMethods = function (db) {

  const errorCodes = require('../lib/ErrorCodes');

  function getRecommendationsAPI (req, res) {
    // default to empty strings
    const keyword = req.query.keyword || '';
    const assessment = req.query.assessment || '';
    const sentiment = req.query.sentiment || '';

    getRecommendations(keyword, assessment, sentiment, (err, results) => {
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

  function getRecommendations (keyword, assessment, sentiment, callback) {
    const assessmentWeighting = assessment ? `Unit.${assessment} DESC,` : '';
    const query = `
      MATCH (Person)-[r:REVIEWED]->(Unit)
      WHERE
        Unit.summary =~ '(?i).*${keyword}.*'
        OR Unit.title =~ '(?i).*${keyword}.*'
        OR r.summary =~ '(?i).*${keyword}.*'
      RETURN DISTINCT Unit, r
      ORDER BY
        ${assessmentWeighting}
        r.sentiment ${sentiment === 'loved' ? 'DESC' : 'ASC'},
        Unit.title
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

      if (recommendations.length > 0) {
        const newRecommendations = [];

        newRecommendations.push(recommendations[0]);

        for (let i = 1; i < recommendations.length; i++) {
          const recommendation = recommendations[i];

          for (let j = 0; j < newRecommendations.length; j++) {
            const newRecommendation = newRecommendations[j];

            if (newRecommendation.unit.code === recommendation.unit.code) {
              newRecommendations[j].reviews = newRecommendations[j].reviews.concat(recommendations[i].reviews);
              break;
            }
          }
        }

        recommendations = newRecommendations;
      }

      callback(null, recommendations);
    });
  }

  return {
    getRecommendationsAPI,
    getRecommendations
  }

};

module.exports = RecommendationMethods;
