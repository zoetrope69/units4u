/* recommendation method tests go here

require('dotenv').config();
const db = require('../app/db');
const recommendationMethods = require('../app/methods/recommendation')(db);

recommendationMethods.getRecommendations('geometry', (err, res) => {
  if (err) {
    return console.log(err.message.errors);
  }

  console.log('Recommendations ', res);
});

*/
