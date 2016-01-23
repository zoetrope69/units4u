'use strict';

const sentiment1 = require('speakeasy-nlp').sentiment.analyze;
const sentiment2 = require('sentiment');

// from kit's website: http://lesterk.myweb.port.ac.uk/inse/2013~14/feedback/#mid
const feedback = require('../resources/kitsFeedback');

console.log('\n');

console.log('speakeasy-nlp');
console.log('---------');
testSentiment(sentiment1);
console.log('\n');

console.log('sentiment');
console.log('---------');
testSentiment(sentiment2);
console.log('\n');

function testSentiment (sentimentFunction) {
  let successAmount = 0;
  let neutralAmount = 0;
  let failAmount = 0;

  for (let i = 0; i < feedback.good.length; i++) {
    const item = feedback.good[i];

    const result = sentimentFunction(item);

    if (result.score === 0) {
      neutralAmount++;
    } else if (result.score > 0) {
      successAmount++;
    } else {
      failAmount++;
    }
  }

  for (let i = 0; i < feedback.bad.length; i++) {
    const item = feedback.bad[i];

    const result = sentimentFunction(item);

    if (result.score === 0) {
      neutralAmount++;
    } else if (result.score < 0) {
      successAmount++;
    } else {
      failAmount++;
    }
  }

  console.log('Success: ' + successAmount + '/' + (feedback.good.length + feedback.bad.length));
  console.log('Neutral: ' + neutralAmount + '/' + (feedback.good.length + feedback.bad.length));
  console.log('Fail:    ' + failAmount + '/' + (feedback.good.length + feedback.bad.length));
}
