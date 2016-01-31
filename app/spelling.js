const sp = require('wordsworth').getInstance();

const correctSpelling = (word, callback) => {
  const seed = __dirname + '/../resources/dictionaries/seed.txt';
  const training = __dirname + '/../resources/dictionaries/training.txt';
  sp.initialize(seed, training, () => callback(sp.suggest(word)));
};

module.exports = correctSpelling;
