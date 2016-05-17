var inquirer = require('inquirer'),
    path = require('path'),
    config = path.join(process.env['HOME'], '.npr-one'),
    dotenv = require('dotenv').load({silent: true, path: config}),
    fs = require('fs'),
    npr;

var client_creds = [
  {
    type: 'input',
    name: 'CLIENT_ID',
    message: 'NPR Application ID',
  },
  {
    type: 'input',
    name: 'CLIENT_SECRET',
    message: 'NPR Application Secret',
  }
];

var device_code = [
  {
    type: 'list',
    name: 'device',
    message: 'Authorize the NPR One CLI @ ',
    choices: ['Complete', 'Exit']
  }
];

var requestDeviceCode = function() {

  return new Promise(function(resolve, reject) {

    npr.one.authorization
      .generateDeviceCode({
         client_id: process.env.CLIENT_ID,
         client_secret: process.env.CLIENT_SECRET,
         scope: 'listening.readonly listening.write identity.readonly'
       })
      .then(function(res) {

        device_code[0].message += res.verification_uri;
        device_code[0].message += ' using code: ' + res.user_code;

        inquirer.prompt(device_code, function(answers) {

          if(answers.device === 'Exit')
            process.exit();

          resolve(res.device_code);

        });

      })
      .catch(reject);

  });

};

var requestToken = function(code) {

  return new Promise(function(resolve, reject) {

    npr.one.authorization
      .createToken({
         grant_type: 'device_code',
         client_id: process.env.CLIENT_ID,
         client_secret: process.env.CLIENT_SECRET,
         code: code
       })
      .then(function(res) {
        process.env.NPR_ACCESS_TOKEN = res.access_token;
        resolve(res.access_token);
      })
      .catch(reject);

  });

};

var getClientCreds = function() {

  return new Promise(function(resolve, reject) {

    if(process.env.CLIENT_ID && process.env.CLIENT_SECRET)
      return resolve();

    inquirer.prompt(client_creds, function(answers) {

      process.env.CLIENT_ID = answers.CLIENT_ID;
      process.env.CLIENT_SECRET = answers.CLIENT_SECRET;

      resolve();

    });

  });

};

exports.getToken = function(api) {

  npr = api;

  return new Promise(function(resolve, reject) {

    if(process.env.NPR_ACCESS_TOKEN)
      return resolve(process.env.NPR_ACCESS_TOKEN);

    getClientCreds()
      .then(requestDeviceCode.bind(this))
      .then(requestToken.bind(this))
      .then(function(token) {
        fs.writeFileSync(config, 'NPR_ACCESS_TOKEN=' + process.env.NPR_ACCESS_TOKEN + '\n');
        resolve(token);
      })
      .catch(reject);

  });

};

