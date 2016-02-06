'use strict'
const request = require('request');

const JobMethods = function () {

  const errorCodes = require('../lib/ErrorCodes');

  function getJobsAPI (req, res) {
    let keywords = req.query.keywords || []; // default to empty string
    const location = req.query.location || ''; // default to empty string
    const amount = req.query.amount;

    keywords = JSON.parse(keywords);

    getJobs({ keywords, location, amount }, (err, results) => {
      if (err) {
        res.status(errorCodes.server.code)
        return res.send(errorCodes.server.message + ': ' + err);
      }

      // Return jobs
      res.send({
        'jobs': results
      });
    });
  }

  function getJobs (options, callback) {
    options.keywords = options.keywords || [];
    options.location = options.location || '';
    options.country = options.country || 'gb';
    options.amount = options.amount || 200;

    // if there isn't any keywords error out
    if (options.keywords.length < 1) {
      return callback('Need at least one keyword', null);
    }

    const query = {
      v: 2,
      format: 'json',
      publisher: process.env.INDEED_PUBLISHER_ID,
      radius: 200,
      q: options.keywords.join(', '),
      l: options.location,
      co: options.country,
      limit: options.amount,
      userip: '1.2.3.4',
      useragent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36'
    };

    request({
      url: 'http://api.indeed.com/ads/apisearch',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      qs: query
    }, (err, res, body) => {
      if (err) {
        return callback(err, null);
      }

      const jobs = JSON.parse(body).results;

      const results = jobs.map((job) => {
        // strip out any filthy html
        const summary = job.snippet.replace(/<\/?[^>]+(>|$)/g, '');

        return {
          id: job.jobkey[0],
          title: job.jobtitle,
          company: job.company,
          location: job.formattedLocation,
          date: {
            full: job.date,
            relative: job.formattedRelativeTime
          },
          summary,
          url: job.url
        };
      });

      return callback(null, results);
    })
  }

  return {
    getJobsAPI,
    getJobs
  };

};

module.exports = JobMethods;
