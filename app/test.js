require('dotenv').config();
const db = require('./db');
const userMethods = require('./dbMethods/userMethods')(db);
const unitMethods = require('./dbMethods/unitMethods')(db);
const recommendationMethods = require('./dbMethods/recommendationMethods')(db);
const correctSpelling = require('./spelling');
const sentiment = require('speakeasy-nlp').sentiment.analyze;
const jobs = require('./jobs');

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

// example jobs get
jobs.search({
  amount: 1000,
  country: 'gb',
  location: 'London, UK',
  keywords: ['php', 'developer', 'html', 'css']
}, (err, results) => {
  if (err) {
    return console.log(err);
  }

  console.log(results);
});
