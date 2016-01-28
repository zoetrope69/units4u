'use strict';

const speakeasyNlp = require('speakeasy-nlp').sentiment.analyze;
const feedback = require('../resources/reviews').reviews;

for (let i = 0; i < feedback.length; i++) {
  feedback[i].sentiment = speakeasyNlp(feedback[i].summary);
  if (i === feedback.length -1) {
    addToDaddabase(feedback);
  }
}


function addToDaddabase (processedFeedback) {
  console.log(processedFeedback);
}
