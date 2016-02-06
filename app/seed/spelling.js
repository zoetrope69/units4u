'use strict';
const resourcesPath = __dirname + '/../../resources/';
const reviews = require(resourcesPath + 'reviews.json').reviews;
const fs = require('fs');
const async = require('async');
const spellingChecker = require('wordsworth').getInstance();
const seed = resourcesPath + 'dictionaries/seed.txt';
const training = resourcesPath + 'dictionaries/training.txt';

const newReviews = [];

const correctReviews = (callback) => {
  spellingChecker.initialize(seed, training, () => {
    async.each(reviews, (review, callback) => {
      const words = review.summary.split(' ');

      for (let i = 0; i < words.length; i++) {
        const word = words[i];

        // not spelt correctly
        if (!spellingChecker.exists(word)) {
          // replace word with first suggestion
          // if no suggestions just use original word
          words[i] = spellingChecker.suggest(word)[0] || word;
        }
      }

      review.summary = words.join(' ');

      newReviews.push(review);
      callback();
    }, (err) => {
      if (err) {
        return console.log(err);
      }

      fs.writeFile(__dirname + '/../../resources/correctedReviews.json', JSON.stringify({ reviews: newReviews }), (err) => {
        if (err) {
          return console.log(err);
        }

        callback();
      });
    });
  });
};

module.exports = correctReviews;
