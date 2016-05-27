'use strict';

const inquirer = require('inquirer'),
      path = require('path'),
      config = path.join(process.env['HOME'], '.npr-one'),
      dotenv = require('dotenv').load({silent: true, path: config}),
      fs = require('fs');

let npr;

const client_creds = [
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

const device_code = [
  {
    type: 'list',
    name: 'device',
    message: 'Authorize the NPR One CLI @ ',
    choices: ['Complete', 'Exit']
  }
];

const requestDeviceCode = () => {

  return new Promise((resolve, reject) => {

    npr.one.authorization
      .generateDeviceCode({
         client_id: process.env.CLIENT_ID,
         client_secret: process.env.CLIENT_SECRET,
         scope: 'listening.readonly listening.write identity.readonly'
       })
      .then((res) => {

        device_code[0].message += `${res.verification_uri} using code: ${res.user_code}`;

        inquirer.prompt(device_code, (answers) => {

          if(answers.device === 'Exit')
            process.exit();

          resolve(res.device_code);

        });

      })
      .catch(reject);

  });

};

const requestToken = (code) => {

  return new Promise((resolve, reject) => {

    npr.one.authorization
      .createToken({
         grant_type: 'device_code',
         client_id: process.env.CLIENT_ID,
         client_secret: process.env.CLIENT_SECRET,
         code: code
       })
      .then((res) => {
        process.env.NPR_ACCESS_TOKEN = res.access_token;
        resolve(res.access_token);
      })
      .catch(reject);

  });

};

const getClientCreds = () => {

  return new Promise((resolve, reject) => {

    if(process.env.CLIENT_ID && process.env.CLIENT_SECRET)
      return resolve();

    inquirer.prompt(client_creds, (answers) => {

      process.env.CLIENT_ID = answers.CLIENT_ID;
      process.env.CLIENT_SECRET = answers.CLIENT_SECRET;

      resolve();

    });

  });

};

exports.getToken = (api) => {

  npr = api;

  return new Promise((resolve, reject) => {

    if(process.env.NPR_ACCESS_TOKEN)
      return resolve(process.env.NPR_ACCESS_TOKEN);

    getClientCreds()
      .then(requestDeviceCode.bind(this))
      .then(requestToken.bind(this))
      .then((token) => {
        fs.writeFileSync(config, `NPR_ACCESS_TOKEN=${process.env.NPR_ACCESS_TOKEN}\n`);
        resolve(token);
      })
      .catch(reject);

  });

};

