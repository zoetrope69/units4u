'use strict';
const defaultKeyword = 'geometry';

const loadRecommendation = (keyword) => new Promise((resolve, reject) => {
  keyword = keyword || ''; // default to an empty string

  const uri = `http://localhost:${EXPRESS_PORT}/api/recommendation?keyword=${keyword}`; // eslint-disable-line no-undef
  fetch(uri)
    .then((response) => response.json())
    .then((result) => resolve(result))
    .catch((err) => reject(err));

});

const displayRecommendations = (result) => {
  if (result.err) {
    return console.log(result.err);
  }

  const outputEl = document.querySelector('.output');

  // clear output
  outputEl.innerHTML = '';

  // if no recommendations
  if (result.recommendations.length < 1) {
    return outputEl.innerHTML = `
      <p class="no-recommendations">
        No recommendations&hellip;
      </p>
    `;
  }

  const recommendation = result.recommendations[0];
  const keyword = recommendation.keyword;

  const unit = recommendation.unit;

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
    </div>

    <div class="column">

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

    <h2>Reviews</h2>
  `;

  if (reviews.length < 1) {
    output += `<p>No reviews</p>`;
  }

  for (let i = 0; i < reviews.length; i++) {

    const review = reviews[i];
    const greenHue = 100;
    const colourCalc = (greenHue / 2) + (greenHue * review.score) / 4; // eslint-disable-line no-magic-numbers

    output += `
    <div class="review" style="color: hsl(${colourCalc}, 48%, 48%)">
      <div class="review__emoji">
        <img src="images/${review.score}.png" />
      </div>
      <blockquote class="review__summary">
        <p class="review__sentiment">Sentiment: ${review.sentiment} <small>(${review.score})</small></p>
        ${review.summary}
      </blockquote>
    </div>
    `;

  }

  output += `
    </div>
  `;

  outputEl.innerHTML = output;
}

const handleKeywordInput = (event) => {
  const keyword = event.target.value.trim() || defaultKeyword; // default to keyword

  loadRecommendation(keyword)
    .then(displayRecommendations)
    .catch((err) => console.log(err));
};

const load = () => {
  const keywordInputEl = document.querySelector('.keyword__input');

  loadRecommendation(defaultKeyword)
    .then(displayRecommendations)
    .catch((err) => console.log(err));

  keywordInputEl.placeholder = defaultKeyword;
  keywordInputEl.addEventListener('input', handleKeywordInput, false);
};

window.onload = load;
