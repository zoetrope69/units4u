'use strict';

const speakeasyNlp = require('speakeasy-nlp').sentiment.analyze;
const sentiment = require('sentiment');

// from kit's website: http://lesterk.myweb.port.ac.uk/inse/2013~14/feedback/#mid
const feedback = require('../resources/kitsFeedback');

const output = {
  'speakeasy-nlp': testSentiment(speakeasyNlp),
  'sentiment': testSentiment(sentiment)
};

console.log(output);

function testSentiment (sentimentFunction) {
  const results = {
    success: 0,
    neutral: 0,
    fail: 0,
    total: 0
  };

  for (let i = 0; i < feedback.good.length; i++) {
    const item = feedback.good[i];

    const result = sentimentFunction(item);

    if (result.score === 0) {
      results.neutral++;
    } else if (result.score > 0) {
      results.success++;
    } else {
      results.fail++;
    }

    results.total++;
  }

  for (let i = 0; i < feedback.bad.length; i++) {
    const item = feedback.bad[i];

    const result = sentimentFunction(item);

    if (result.score === 0) {
      results.neutral++;
    } else if (result.score < 0) {
      results.success++;
    } else {
      results.fail++;
    }

    results.total++;
  }

  return results;
}
