'use strict'

/* eslint no-unused-vars: 1 */

const UserMethods = function (db) {

  function addUser (req, res) {
    console.log(req);
    res.send('add a user, with reviews?');
  }

  function getUser (req, res) {
    console.log(req);
    res.send('find user and reviews');
  }

  function addReview (req, res) {
    console.log(req);
    res.send('add a review to a specified user');
  }

  return {
    addUser,
    getUser,
    addReview
  }

};

module.exports = UserMethods;
