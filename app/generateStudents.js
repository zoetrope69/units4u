'use strict';
const casual = require('casual');
const reviews = require('../resources/reviews.json').reviews;
const sentiment = require('speakeasy-nlp').sentiment.analyze;

function randomNumber (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const amountOfUniYears = 3;
const amountOfUnitsInaYear = 3;

const student = {
  name: casual.full_name,
  year: randomNumber(1, amountOfUniYears)
};

const studentUnits = [];
let unitAmount = amountOfUnitsInaYear * student.year;

while (unitAmount) {
  const randNo = randomNumber(0, reviews.length);
  const review = reviews[randNo];

  // if we dont have any review picked yet
  if (studentUnits.length < 1) {
    studentUnits.push(review); // uhhh push it, PUSH IT REAL GOOD

    --unitAmount;
  }

  for (let i = 0; i < studentUnits.length; i++) {
    const studentUnit = studentUnits[i];

    // if we dont already have this unit
    if (studentUnit.id !== review.id) {

      review.sentiment = sentiment(review.summary).score;

      const minGrade = 40;
      const maxGrade = 90;
      review.grade = randomNumber(minGrade, maxGrade);

      studentUnits.push(review); // add it to their units

      // reduce the amount of units we need and break out to the enxt loop
      --unitAmount;
      break;
    }
  }

}

student.units = studentUnits;

console.log(student);

// create grade from sentiment
// add user and review to database
