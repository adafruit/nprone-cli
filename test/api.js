var API = require('../lib/api');

describe('NPR API', function() {

  describe('OAuth', function() {

    it('should get an access token', function(done) {

      var NPR = API({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        username: process.env.NPR_USERNAME,
        password: process.env.NPR_PASSWORD
      });

      NPR.authenticate(function(token) {

        if(! token)
          return done('invalid token');

        done();

      });

    });

  });

});
