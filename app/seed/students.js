'use strict';
const casual = require('casual');
const db = require('../db');
const userMethods = require('../methods/user')(db);
const sentiment = require('sentiment');
const reviews = require(__dirname + '/../../resources/correctedReviews.json').reviews;

function randomNumber (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const amountOfUniYears = 2;
const amountOfUnitsInaYear = 3;

let benHarrisHasBeenCreated = false;

function removeReview (id) {
  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];
    if (review.id === id) {
      reviews.splice(i, 1);
    }
  }
}

function seedStudent () {
  const student = {
    name: casual.full_name,
    year: 2
  };

  if (!benHarrisHasBeenCreated) {
    student.name = 'Ben Harris';
    benHarrisHasBeenCreated = true;
  }

  const studentUnits = [];
  const studentReviews = [];
  let unitAmount = amountOfUnitsInaYear * student.year;

  while (unitAmount > 0) {
    const randNo = randomNumber(0, reviews.length);
    const review = reviews[randNo];

    // if we dont have any review picked yet OR if we dont already have this unit
    if (studentUnits.length < 1 || studentUnits.indexOf(review.unit) < 0) {
      review.sentiment = sentiment(review.summary).comparative;

      // 0.1 - 0.5 chance of sentiment to be correlated to grade
      const randNo = Math.random();
      const isItCorrelated = (randNo >= 0.1 && randNo < 0.5);

      const minGrade = 40;
      const maxGrade = 80;
      let grade = randomNumber(minGrade, maxGrade);

      if (isItCorrelated) {
        grade += Math.sign(review.sentiment) * 10;
      }

      review.grade = grade;

      studentReviews.push(review); // add it to their units
      studentUnits.push(review.unit);
      removeReview(review.id);
    }

    // reduce the amount of units we need and break out to the enxt loop
    unitAmount--;
  }

  student.reviews = studentReviews;
  student.units = studentUnits;

  return(student);
}

const amountOfStudents = Math.ceil(reviews.length / (amountOfUniYears * amountOfUnitsInaYear));

const seedStudents = (callback) => {
  let usersCount = amountOfStudents;
  let reviewsTotal = 0;

  for (let i = 0; i < amountOfStudents; i++) {
    const student = seedStudent();

    userMethods.addUser(student, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Added user ${student.name}`,res);
      }

      let reviewsCount = student.reviews.length;
      reviewsTotal += reviewsCount;

      for (let j = 0; j < student.reviews.length; j++) {
        const review = student.reviews[j];
        userMethods.addReview(student.name, review, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Added review for ${review.unit} by ${student.name} `, res);
          }

          reviewsCount--;

          if (reviewsCount <= 0) {
            usersCount--;

            if (usersCount <= 0) {
              callback();
            }
          }
        });
      }
    });
  }
}

module.exports = seedStudents;
