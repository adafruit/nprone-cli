require('es6-shim');

/************************ DEPENDENCIES *****************************/
var util = require('util'),
    bunyan = require('bunyan'),
    swagger = require('swagger-client');

var proto = API.prototype;
exports = module.exports = API;

function handleError(reject, res) {
  reject(res.obj.message);
};

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
proto.api = false;
proto.swagger_url = 'https://api.npr.org/documentation/beryllium/api-docs';

proto.getClient = function() {

  var self = this;

  return new Promise(function(resolve, reject) {

    if(self.api)
      return resolve(self.api);

    var api = new swagger({
      url: self.swagger_url,
      success: function() {
        self.api = api;
        resolve(self.api);
      }
    });

  });

};

/***************************** AUTH *******************************/
proto.getAccessToken = function() {

  var self = this;

  var promise = function() {

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

      var args = {
        client_id: self.client_id,
        client_secret: self.client_secret,
        grant_type: 'password',
        username: self.username,
        password: self.password
      };

      self.api.authorization.createToken(args, function(res) {

        self.access_token = res.obj.access_token;
        self.log.debug('access token', self.access_token);
        resolve(self.access_token);

      }, handleError.bind(this, reject));

    });

  };

  return this.getClient().then(promise);

};

/*********************** LISTENING **************************/
proto.getRecommendation = function(channel) {

  var promise = function(urls) {

    return new Promise(function(resolve, reject) {

      if(! urls || urls.length < 1)
        return reject('could not retrieve a recommendation');

      resolve(urls[0]);

    });

  };

  return this.getRecommendations(channel, 1).then(promise);

};

proto.getRecommendations = function(channel, limit) {

  var self = this;

  channel = channel || 'npr';
  limit = limit || 5;

  var promise = function() {

    return new Promise(function(resolve, reject) {

      if(! self.api)
        return reject('API client not ready');

      if(! self.access_token)
        return reject('missing access token');

      var args = {
        Authorization: 'Bearer ' + self.access_token,
        channel: channel
      };

      self.api.listening.getRecommendations(args, function(res) {

        if(! res.obj.items || res.obj.items.length < 1)
          return reject('unable to retrieve recommendations');

        var urls = res.obj.items.map(function(item) {

          // try aac
          var audio = item.links.audio.find(function(a) {
            return a['content-type'] == 'audio/aac';
          });

          // try mp3 as backup
          if(! audio) {
            audio = item.links.audio.find(function(a) {
              return a['content-type'] == 'audio/mp3';
            });
          }

          return audio.href;

        });

        if(urls.length < 1)
          return reject('unable to retrieve recommendations');

        urls = urls.slice(0, limit);

        resolve(urls);

      }, handleError.bind(this, reject));

    });

  };

  return this.getAccessToken().then(promise);

};

