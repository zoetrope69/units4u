/* user method tests go here

require('dotenv').config();
const db = require('../app/db');

const userMethods = require('../app/methods/user')(db);

userMethods.getUser('Ben Harris', (err, res) => {
  if (err) {
    return console.log(err.message.errors);
  }

  console.log('User ', res);
});

*/
