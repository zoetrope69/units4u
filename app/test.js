require('dotenv').config();
const db = require('./db');
const userMethods = require('./methods/user')(db);
const unitMethods = require('./methods/unit')(db);
const recommendationMethods = require('./methods/recommendation')(db);
const correctSpelling = require('./methods/spelling');
const sentiment = require('sentiment');

recommendationMethods.getRecommendations('geometry', (err, res) => {
  if (err) {
    return console.log(err.message.errors);
  }

  console.log('Recommendations ', res);
});

userMethods.getUser('Ben Harris', (err, res) => {
  if (err) {
    return console.log(err.message.errors);
  }

  console.log('User ', res);
});

unitMethods.getUnit('MATH20812', (err, res) => {
  if (err) {
    return console.log(err.message.errors);
  }

  console.log('Unit ', res);
});

// example spelling suggestion
const summary = 'was a very nioce course, i enjoed it throghly but i disslike the lcturer';
correctSpelling(summary, (correctedSummary) => {

  // example sentiment analysis usage
  console.log('original:' , summary);
  console.log('corrected spelling: ', correctedSummary)
  console.log('original sentiment: ', sentiment(summary));
  console.log('corrected sentiment: ', sentiment(correctedSummary));

});
