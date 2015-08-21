var npr = require('npr-api')(),
    fs = require('fs'),
    chalk = require('chalk'),
    auth = require('./lib/auth'),
    omx = require('node-omx')();
    wget = require('wget-improved');

var logo = fs.readFileSync('./logo.txt', 'utf8');

console.log(logo);

// silence swagger log output
process.env.NODE_ENV = 'test';

npr.one
   .init()
   .then(auth.getToken.bind(auth, npr))
   .then(function(token) {
     return npr.one.setAccessToken(token);
   })
  .then(function() {
     return npr.one.listening.getRecommendations({ channel: 'npr' });
   })
   .then(function(recommendations) {
     // print out the first two recommendations to the console
     var tmp = '/tmp/test.mp4 ';
     wget.download(recommendations.items[0].links.audio[0].href, tmp)
       .on('end', function() {
         omx.play(tmp);
         omx.on('play', function() {console.log('play');});
         omx.on('stop', function() {console.log('stop');});
       });
   })
   .catch(function(err) {
     console.error(err,err.stack);
   });
