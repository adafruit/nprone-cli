var API = require('../lib/api');

process.env.NODE_ENV = 'test';

describe('NPR API', function() {

  this.timeout(10000);

  describe('OAuth', function() {

    it('should get an access token', function(done) {

      var npr = API({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        username: process.env.NPR_USERNAME,
        password: process.env.NPR_PASSWORD
      });

      npr.getAccessToken()
        .then(function(token) {

          if(! token)
            done('missing token');

          done();

        })
        .catch(function(err) {
          done(err);
        });

    });

  });

});
