/* eslint-disable no-magic-numbers, no-undef, no-unused-vars */
require('dotenv').config(); // pull in environment variables from .env

const jobs = require('../app/methods/job');
const getJobs = jobs().getJobs;
const expect = require('chai').expect;

describe('getJobs', () => {
  it('should error if no keywords are sent', () => {

    getJobs({}, (err, jobs) => {
      expect(err).to.exist;
      expect(jobs).to.not.exist;
      expect(err).to.equal('Need at least one keyword');
    });

  });

  it('should return an array of jobs (specified by an amount)', () => {

    // no location
    const options = {
      amount: 10,
      country: 'gb',
      location: 'London, UK',
      keywords: ['php', 'js', 'html', 'js']
    };

    getJobs(options, (err, jobs) => {
      expect(err).to.not.exist;
      expect(jobs).to.exist;
      expect(jobs).to.be.an('array');
      expect(jobs).to.be.at.most(10);
    });

  });

  it('should return an empty array if no jobs', () => {

    // no location
    const options = {
      location: 'Fake Place Name, UK',
      keywords: ['cool']
    };

    getJobs(options, (err, jobs) => {
      expect(err).to.not.exist;
      expect(jobs).to.exist;
      expect(jobs).to.be.an('array');
      expect(jobs).to.be.empty;
    });

  });
});
