'use strict'

const RecommendationMethods = function (db) {
  function findRecommendations (req, res) {
    const query = `
      MATCH (p:Person)-[r:REVIEWED]->(unit)
      WHERE "javascript" in p.interests
      AND r.sentiment > 0.5 RETURN unit.title
    `;
    db.cypher({ query }, (err, results) => {
      if (err) {
        return console.log(err.message.errors);
      }
      const result = results[0];
      console.log(result);
      res.send(result);
    });

  }

  return {
    findRecommendations
  }
};

module.exports = RecommendationMethods;
