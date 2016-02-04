'use strict';
const sp = require('wordsworth').getInstance();

const correctSpelling = (string, callback) => {
  const seed = __dirname + '/../resources/dictionaries/seed.txt';
  const training = __dirname + '/../resources/dictionaries/training.txt';

  sp.initialize(seed, training, () => {
    const words = string.split(' ');

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      // not spelt correctly
      if (!sp.exists(word)) {
        // replace word with first suggestion
        // if no suggestions just use original word
        words[i] = sp.suggest(word)[0] || word;
      }
    }

    callback(words.join(' '));
  });

};

module.exports = correctSpelling;
