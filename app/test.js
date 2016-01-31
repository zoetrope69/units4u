require('dotenv').config();
const db = require('./db');
const userMethods = require('./dbMethods/userMethods')(db);
const unitMethods = require('./dbMethods/unitMethods')(db);

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

// example sentiment analysis usage
const sentiment = require('speakeasy-nlp').sentiment.analyze;
console.log(sentiment('cool dog man'));

// example spelling suggestion
const correctSpelling = require('./spelling');
correctSpelling('noice', (suggestion) => console.log('suggestion', suggestion));

// example jobs get
const jobs = require('./jobs')
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
