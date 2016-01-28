const sp = require('wordsworth').getInstance();

const correctSpelling = (word, callback) => {

  sp.initialize(__dirname + '/../resources/dictionaries/seed.txt',
                __dirname + '/../resources/dictionaries/training.txt',
    () => {
      const suggestions = sp.suggest(word);
      console.log(suggestions);
      callback(suggestions.length > 0 ? suggestions[0] : word);
    }
  );

};

module.exports = correctSpelling;
