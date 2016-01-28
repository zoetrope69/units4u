const fs = require('fs');

const nodehun = require('nodehun');
const dict = new nodehun(fs.readFileSync(__dirname + '/../resources/dictionaries/en_GB.aff'),
                        fs.readFileSync(__dirname + '/../resources/dictionaries/en_GB.dic'));

const sp = require('wordsworth').getInstance();

const words = [
  { word: 'dag', correct: 'dog' }
  // { word: 'teamwurk', correct: 'teamwork' },
  // { word: 'kool', correct: 'cool' },
  // { word: 'noce', correct: 'nice'}
];

const results = {
  nodehun: [],
  wordsworth: []
};

words.forEach((item) => {

  const promises = [];

  promises.push(
    new Promise((resolve, reject) => {
      dict.spellSuggestions(item.word, (err, correct, suggestions) => {
        if (err) {
          return reject(err);
        }

        resolve({
          type: 'nodehun',
          result: suggestions.indexOf(item.correct)
        });
      });
    })
  );

  promises.push(
    new Promise((resolve) => {
      sp.initialize(__dirname + '/../resources/dictionaries/seed.txt',
                    __dirname + '/../resources/dictionaries/training.txt',
        () => {
          resolve({
            type: 'wordsworth',
            result: sp.suggest(item.word).indexOf(item.correct)
          });
        }
      );
    })
  );

  Promise.all(promises).then((value) => {
    console.log('v', value);
  }, (reason) => {
    console.log(reason);
  });

});
