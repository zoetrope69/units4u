'use strict';
require('dotenv').config();
const casual = require('casual');
const reviews = require('../resources/reviews.json').reviews;
const sentiment = require('speakeasy-nlp').sentiment.analyze;
const db = require('./db');
const userMethods = require('./dbMethods/userMethods')(db);

function randomNumber (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const amountOfUniYears = 2;
const amountOfUnitsInaYear = 3;


for (let i = 0; i < reviews.length; i+=(amountOfUniYears * amountOfUnitsInaYear)) {

  const student = {
    name: casual.full_name,
    year: 2
  };

  const studentUnits = [];
  const studentReviews = [];
  let unitAmount = amountOfUnitsInaYear * student.year;

  while (unitAmount) {
    const randNo = randomNumber(0, reviews.length);
    const review = reviews[randNo];

    // if we dont have any review picked yet
    if (studentReviews.length < 1) {
      review.sentiment = sentiment(review.summary).comparative;

      const minGrade = 40;
      const maxGrade = 90;
      review.grade = randomNumber(minGrade, maxGrade);
      studentReviews.push(review); // uhhh push it, PUSH IT REAL GOOD
      studentUnits.push('"'+review.id+'"');

      --unitAmount;
    }

    for (let i = 0; i < studentReviews.length; i++) {
      const studentUnit = studentReviews[i];

      // if we dont already have this unit
      if (studentUnit.id !== review.id) {

        review.sentiment = sentiment(review.summary).comparative;

        const minGrade = 40;
        const maxGrade = 90;
        review.grade = randomNumber(minGrade, maxGrade);

        studentReviews.push(review); // add it to their units
        studentUnits.push('"'+review.id+'"');

        // reduce the amount of units we need and break out to the enxt loop
        --unitAmount;
        break;
      }
    }

  }

  student.reviews = studentReviews;
  student.units = studentUnits;

  console.log(student);

  userMethods.addUser(student, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  });

  for (let j = 0; j < student.reviews.length; j++) {
    userMethods.addReview(student.name, student.reviews[j], (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  }
}

// create grade from sentiment
// add user and review to database
