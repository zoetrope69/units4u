'use strict';
const defaultKeyword = 'geometry';

function debounce (func, wait, immediate) {
  let timeout;
  return () => {
    const context = this, args = arguments; // eslint-disable-line consistent-this
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  }
}

const loadRecommendations = (keyword, assessment, sentiment) => new Promise((resolve, reject) => {

  // default arguments to if not passed in
  keyword = keyword || defaultKeyword;
  assessment = assessment || '';
  sentiment = sentiment || 'loved';

  const reccommendationUri = `api/recommendation?keyword=${keyword}&assessment=${assessment}&sentiment=${sentiment}`; // eslint-disable-line no-undef
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

    <p class="output__intro">OK, based on the filters, here's what we've got:</p>

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

    <h2>Reviews for <q>${unit.title}</q></h2>
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

  output += `

    <div class="output__jobs"></div>

  `;

  outputEl.innerHTML = output;

  const jobsEl = document.querySelector('.output__jobs');

  let jobsOutput = '';

  const jobsUri = `api/jobs?keywords=${jobsKeywords}&amount=3`; // eslint-disable-line no-undef
  fetch(jobsUri)
    .then((response) => response.json())
    .then((result) => {

      const jobs = result.jobs;

      jobsOutput += `
        <h2>Jobs for <q>${unit.title}</q></h2>
      `;

      if (jobs.length < 1) {
        jobsOutput += `<p>No jobs</p>`;
      }

      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];

        jobsOutput += `
        <${job.url ? 'a href="' + job.url + '"' : 'div'} class="job">
          <h3 class="job__title">${job.title}</h3>
          <span class="job__company">${job.company}</span>
          <span class="job__location">(${job.location})</span>
          <span class="job__date" title="${job.date.full}">Posted ${job.date.relative}</span>
          <p class="job__summary">${job.summary}</p>
        </${job.url ? 'a' : 'div'}>
        `;
      }

      jobsEl.innerHTML = jobsOutput;
    })
    .catch((error) => console.log(error));
}

const handleInput = debounce(() => {
  const keyword = document.querySelector('.filter__keyword').value.trim();
  const assessment = document.querySelector('input[name="assessment"]:checked').value;
  const sentiment = document.querySelector('input[name="sentiment"]:checked').value;

  loadRecommendations(keyword, assessment, sentiment)
    .then(displayRecommendations)
    .catch((err) => console.log(err));
}, 150);

const load = () => {
  const keywordInputEl = document.querySelector('.filter__keyword');
  const assessmentInputEls = document.querySelectorAll('.filter__assessment');
  const sentimentInputEls = document.querySelectorAll('.filter__sentiment');

  // load default recommendations
  loadRecommendations()
    .then(displayRecommendations)
    .catch((err) => console.log(err));

  keywordInputEl.placeholder = defaultKeyword;
  keywordInputEl.addEventListener('input', handleInput, false);

  for (let i = 0; i < assessmentInputEls.length; i++) {
    const assessmentInputEl = assessmentInputEls[i];
    assessmentInputEl.addEventListener('change', handleInput, false);
  }

  for (let i = 0; i < sentimentInputEls.length; i++) {
    const sentimentInputEl = sentimentInputEls[i];
    sentimentInputEl.addEventListener('change', handleInput, false);
  }
};

window.onload = load;
