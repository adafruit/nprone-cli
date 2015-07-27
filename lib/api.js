/************************ DEPENDENCIES *****************************/
var util = require('util'),
    OAuth = require('oauth'),
    bunyan = require('bunyan'),
    request = require('request');

var proto = API.prototype;
exports = module.exports = API;

/************************* CONSTRUCTOR ****************************/
function API(config) {

  if (! (this instanceof API))
    return new API(config);

  util._extend(this, config || {});

  if(! this.log)
    this.log = bunyan.createLogger({name: 'npr-one-api'});

}

/*************************** DEFAULTS *****************************/
proto.client_id = false;
proto.client_secret = false;
proto.username = false;
proto.password = false;
proto.access_token = false;
proto.refresh_token = false;
proto.api_url = 'https://api.npr.org/';
proto.auth_endpoint = 'authorization/v2/authorize';
proto.token_endpoint = 'authorization/v2/token';

/***************************** AUTH *******************************/
proto.authenticate = function(cb) {

  this.getAccessToken()
    .then(cb)
    .catch(function(err) {
      this.log.error(err);
      cb();
    }.bind(this));

};

proto.getAccessToken = function() {

  var self = this;

  return new Promise(function(resolve, reject) {

    if(self.access_token)
      return resolve(self.access_token);

    if(! self.client_id)
      return reject('OAuth Client ID not supplied');

    if(! self.client_secret)
      return reject('OAuth Client Secret not supplied');

    if(! self.username)
      return reject('NPR username not supplied');

    if(! self.password)
      return reject('NPR password not supplied');

    var oauth2 = new OAuth.OAuth2(
      self.client_id,
      self.client_secret,
      self.api_url,
      self.auth_endpoint,
      self.token_endpoint,
      { 'User-Agent': 'NPR%20One/2 CFNetwork/711.4.6 Darwin/14.0.0'}
    );

    var oauth_cb = function(err, access_token, refresh_token, results) {

      if(err)
        return reject(err);

      self.access_token = access_token;
      self.refresh_token = refresh_token;

      self.log.debug('access token', self.access_token);
      self.log.debug('refresh token', self.refresh_token);
      self.log.debug('results', results);

      return resolve(access_token);

    };

    var oauth_params = {
      grant_type: 'password',
      username: self.username,
      password: self.password
    };

    oauth2.getOAuthAccessToken('', oauth_params, oauth_cb);

  });

};

/*********************** RECOMMENDATIONS **************************/




