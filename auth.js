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
    bearer: new BearerStrategy(function (token, done) {
        done();
    }),
    issue: function (req, res, next) {
      next();
    }
  }
}
