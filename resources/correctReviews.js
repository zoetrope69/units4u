'use strict';
const reviews = require('./reviews.json').reviews;
const correctSpelling = require('../app/spelling');
const fs = require('fs');
const async = require('async');

const newReviews = [];

console.log('Correcting reviews...');

const correctReviews = (callback) => {

  async.each(reviews, (review, callback) => {
    correctSpelling(review.summary, (correctedSummary) => {
      review.summary = correctedSummary;
      console.log(correctedSummary);
      newReviews.push(review);
      callback();
    });
  }, (err) => {
    if (err) {
      return console.log(err);
    }

    console.log(newReviews);
    fs.writeFile(__dirname + '/correctedReviews.json', JSON.stringify({ reviews: newReviews }, null, '\t'), (err) => {
      if (err) {
        return console.log(err);
      }

      console.log('correctReviews.json was saved!');
      callback();
    });
  });

};

correctReviews(() => console.log('done'));

module.exports = correctReviews;
