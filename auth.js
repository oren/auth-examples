var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');

module.exports = function (db, jwt_secret, jwt_expiry) {
  return {
    local: new LocalStrategy(function (username, password, done) {
      db.find(username, function (err, dbUser) {
        if (err) return done(err);
        if (!dbUser) return done(null, false);

        bcrypt.hash(password, dbUser.salt, null, function (err, res) {
          if (err) return done(err);
          if (res !== dbUser.password) return done(null, false);
          return done(null, dbUser);
        });
      });
    }),
    bearer: function (JWT_SECRET) {
      return new BearerStrategy(function (token, done) {
        jwt.verify(token, JWT_SECRET, function (err, decoded){
          if (err) return done(err);
          db.find(decoded.username, function (err, dbUser) {
            if (err) return done(err);
            if (!dbUser) return done(null, false);
            return done(null, dbUser);
          });
        });
      });
    },
    issue: function (JWT_SECRET, JWT_EXPIRY) {
      return function(req, res, next) {
          var obj = {username: req.user.username};
          var token = jwt.sign(obj, JWT_SECRET, {expiresInMinutes: JWT_EXPIRY})
          res.send('BEARER ' + token);
          next();
      };
    }
  }
}
