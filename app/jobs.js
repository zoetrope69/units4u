require('dotenv').config(); // pull in environment variables from .env

const request = require('request');

module.exports = {

  search: function (options, callback) {

    options.keywords = options.keywords || [];
    options.location = options.location || '';
    options.country = options.country || 'gb';
    options.amount = options.amount || 1;

    // if there isn't any keywords error out
    if (options.keywords.length < 1) {
      return callback('Need at least one keyword', null);
    }

    if (options.location.length <= 0) {
      return callback('Need to set a location', null);
    }

    const query = {
      v: 2,
      format: 'json',
      publisher: process.env.INDEED_PUBLISHER_ID,
      radius: 200,
      q: options.keywords.join(' '),
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
        const description = job.snippet.replace(/<\/?[^>]+(>|$)/g, '');

        return {
          id: job.jobkey[0],
          title: job.jobtitle,
          description
        };
      });

      return callback(null, results);
    })

  }

};
