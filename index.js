require('dotenv').load();

var API = require('./lib/api'),
    fs = require('fs');

var NPR = API({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  username: process.env.NPR_USERNAME,
  password: process.env.NPR_PASSWORD
});

var logo = fs.readFileSync('./logo.txt', 'utf8');

console.log(logo);

console.log('----------------------------------------');
console.log('FETCHING THE FIRST 5 RECOMMENDED STORIES');
console.log('----------------------------------------');

NPR.getAccessToken()
  .then(NPR.getRecommendations.bind(NPR, 'npr'))
  .then(function(recommendations) {
    // limit to the first 5
    recommendations = recommendations.slice(0,5)
    // dump each link to the console
    recommendations.forEach(function(link) {
      console.log(link, '\n');
    });
  })
  .catch(function(err) {
    console.error(err);
  });
