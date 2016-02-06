/* unit method tests go here

require('dotenv').config();
const db = require('../app/db');

const unitMethods = require('../app/methods/unit')(db);
unitMethods.getUnit('MATH20812', (err, res) => {
  if (err) {
    return console.log(err.message.errors);
  }

  console.log('Unit ', res);
});

*/
