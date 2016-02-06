'use strict';
const fs = require('fs');

const nodehun = require('nodehun');
const dict = new nodehun(fs.readFileSync(__dirname + '/../resources/dictionaries/en_GB.aff'),
                        fs.readFileSync(__dirname + '/../resources/dictionaries/en_GB.dic'));

const sp = require('wordsworth').getInstance();

const words = [
  { word: 'achieve', correct: 'acheive'},
  { word: 'dag', correct: 'dog' },
  { word: 'forward', correct: 'foward'},
  { word: 'kool', correct: 'cool' },
  { word: 'neccessary', correct: 'necessary'},
  { word: 'noce', correct: 'nice'},
  { word: 'posession', correct: 'possession'},
  { word: 'tatoo', correct: 'tattoo'},
  { word: 'teamwurk', correct: 'teamwork' },
  { word: 'truely', correct: 'truly'}
];

console.log('Processing words...');
processWords(words, (results, words) => {
  console.log('Amount of words: ', words.length);
  console.log('Accuracy (lower better) ', results);
  // console.log(words);
});

function spelling1 (item, results) {
  return new Promise((resolve, reject) => {
    dict.spellSuggestions(item.word, (err, correct, suggestions) => {
      if (err) {
        return reject(err);
      }

      const score = suggestions.indexOf(item.correct);
      const type = 'nodehun';

      addToTotal(results, type, score);

      resolve({ type, score });
    });
  });
}

function spelling2 (item, results) {
  return new Promise((resolve) => {
    sp.initialize(__dirname + '/../resources/dictionaries/seed.txt',
                  __dirname + '/../resources/dictionaries/training.txt',
      () => {

        const score = sp.suggest(item.word).indexOf(item.correct);
        const type = 'wordsworth';

        addToTotal(results, type, score);

        resolve({ type, score });

      }
    );
  });
}

function addToTotal (results, type, score) {
  // initialize spellchecking type if doesn't exist
  if (typeof results[type] === 'undefined') {
    results[type] = 0;
  }

  // add score to total
  results[type] += score;
}

function processWords (words, callback) {
  const results = {
    'nodehun': 0,
    'wordsworth': 0
  };

  for (let i = 0; i < words.length; i++) {
    const item = words[i];

    const promises = [
      spelling1(item, results),
      spelling2(item, results)
    ];

    Promise.all(promises).then((output) => {
      item.score = output;

      if (i === words.length - 1) {
        callback(results, words);
      }
    }, (reason) => {
      console.log(reason);
    });
  }
}
