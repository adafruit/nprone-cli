require('dotenv').load();

var API = require('./lib/api');

var NPR = API({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  username: process.env.NPR_USERNAME,
  password: process.env.NPR_PASSWORD
});

NPR.authenticate(function(err, token) {

  if(err)
    return console.error(err);

  if(! token)
    return console.error('invalid token');

  console.log('Bearer ' + token);

});
