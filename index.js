require('dotenv').load();

var API = require('./lib/api'),
    fs = require('fs'),
    chalk = require('chalk');

var npr = API({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  username: process.env.NPR_USERNAME,
  password: process.env.NPR_PASSWORD
});

var logo = fs.readFileSync('./logo.txt', 'utf8');

console.log(logo);

// silence swagger log output
process.env.NODE_ENV = 'test';

console.log(chalk.white.bold('User:', chalk.reset(npr.username)));

npr.getRecommendation('npr')
  .then(function(url) {
    console.log(chalk.white.bold('Recommended Story:', chalk.reset(url)));
  })
  .catch(function(err) {
    console.error(chalk.red.bold('ERROR',JSON.stringify(err)));
  });

