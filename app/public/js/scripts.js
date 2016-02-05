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
  // wrap keywords in summary with a <mark> tag to highlight them
  unit.summary = unit.summary.split(keyword).join(`<mark>${keyword}</mark>`);

  const review = recommendation.reviews[0];
  const score = review.sentiment * review.summary.split(' ').length;

  // append results
  outputEl.innerHTML = `
    <h2>${unit.title} (<small>${unit.code}</small>)</h2>
    <p>${unit.summary}</p>
    <div class="weighting">
      <div class="weighting__area weighting__area--coursework" style="width: ${unit.coursework}%">
        C/W: ${unit.coursework}%
      </div>
      <div class="weighting__area weighting__area--exam" style="width:${unit.exam}%">
        Exam: ${unit.exam}%
      </div>
    </div>

    <h3>Review</h3>
    <blockquote>${review.summary}</blockquote>
    <p>Sentiment: ${review.sentiment} <small>(${score})</small></p>
  `;
}

const handleKeywordInput = (event) => {
  const keyword = event.target.value || defaultKeyword; // default to keyword

  const popSound = new Audio('sounds/pop-sound.wav');
  popSound.play();

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
