'use strict';
const defaultKeyword = 'geometry';

const loadRecommendations = (keyword) => new Promise((resolve, reject) => {
  keyword = keyword || ''; // default to an empty string

  const reccommendationUri = `${HOST}/api/recommendation?keyword=${keyword}`; // eslint-disable-line no-undef
  fetch(reccommendationUri)
    .then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const displayRecommendations = (result) => {
  if (result.err) {
    return console.log(result.err);
  }

  const recommendations = result.recommendations;

  const outputEl = document.querySelector('.output');

  // clear output
  outputEl.innerHTML = '';

  // if no recommendations
  if (recommendations.length < 1) {
    return outputEl.innerHTML = `
      <p class="no-recommendations">
        No recommendations&hellip;
      </p>
    `;
  }

  const recommendation = recommendations[0];
  const keyword = recommendation.keyword;

  const unit = recommendation.unit;

  const jobsKeywords = JSON.stringify(unit.title.toLowerCase().split(' '));

  // wrap any keywords in summary with a <mark> tag to highlight them
  unit.summary = unit.summary.replace(new RegExp(keyword, 'gi'), '<mark>$&</mark>');
  unit.title = unit.title.replace(new RegExp(keyword, 'gi'), '<mark>$&</mark>');

  const reviews = recommendation.reviews;

  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];
    review.score = review.sentiment * review.summary.split(' ').length;
    review.summary = review.summary.replace(new RegExp(keyword, 'gi'), '<mark>$&</mark>');
  }

  // output to page

  let output = '';

  output += `
  <div class="column">
    <h1>${unit.title} (<small>${unit.code}</small>)</h1>
    <p>${unit.summary}</p>

    <div class="weighting">
  `;

  if (unit.coursework) {
    output += `
      <div class="weighting__area weighting__area--coursework" style="width: ${unit.coursework}%">
        C/W: ${unit.coursework}%
      </div>
    `;
  }

  if (unit.exam) {
    output += `
      <div class="weighting__area weighting__area--exam" style="width:${unit.exam}%">
        Exam: ${unit.exam}%
      </div>
    `;
  }

  output += `
    </div>
  </div>

  <div class="column">

    <h2>Reviews</h2>
  `;

  if (reviews.length < 1) {
    output += `<p>No reviews</p>`;
  }

  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];
    const greenHue = 100;
    const colourCalc = (greenHue / 2) + (greenHue * review.score) / 4;

    let reviewImagePath = review.score;

    if (review.score === 0) {
      reviewImagePath = `0.${Math.floor(Math.random() * 8) + 1}`;
    }

    output += `
    <div class="review" style="color: hsl(${colourCalc}, 48%, 48%)">
      <div class="review__emoji">
        <img src="images/${reviewImagePath}.png" />
      </div>
      <blockquote class="review__summary">
        <h3 class="review__sentiment">
          Sentiment: ${Math.round(review.sentiment * 1000) / 1000}
          <small>(${review.score})</small>
          Grade: ${review.grade}
        </h3>
        ${review.summary}
      </blockquote>
    </div>
    `;
  }

  const jobsUri = `${HOST}/api/jobs?keywords=${jobsKeywords}&amount=3`; // eslint-disable-line no-undef
  fetch(jobsUri)
    .then((response) => response.json())
    .then((result) => {
      console.log('job result', result);

      const jobs = result.jobs;

      output += `
        <h2>Jobs</h2>
      `;

      if (jobs.length < 1) {
        output += `<p>No jobs</p>`;
      }

      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];

        output += `
        <${job.url ? 'a href="' + job.url + '"' : 'div'} class="job">
          <h3 class="job__title">${job.title}</h3>
          <span class="job__company">${job.company}</span>
          <span class="job__location">(${job.location})</span>
          <span class="job__date" title="${job.date.full}">Posted ${job.date.relative}</span>
          <p class="job__summary">${job.summary}</p>
        </${job.url ? 'a' : 'div'}>
        `;
      }

      output += `
      </div>
      `;

      outputEl.innerHTML = output;
    })
    .catch((error) => console.log(error));


}

const handleKeywordInput = (event) => {
  const keyword = event.target.value.trim() || defaultKeyword; // default to keyword

  loadRecommendations(keyword)
    .then(displayRecommendations)
    .catch((err) => console.log(err));
};

const load = () => {
  const keywordInputEl = document.querySelector('.keyword__input');

  loadRecommendations(defaultKeyword)
    .then(displayRecommendations)
    .catch((err) => console.log(err));

  keywordInputEl.placeholder = defaultKeyword;
  keywordInputEl.addEventListener('input', handleKeywordInput, false);
};

window.onload = load;
