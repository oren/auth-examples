'use strict';

var bcrypt = require('bcrypt-nodejs');
var sqlite3 = require('sqlite3').verbose();

module.exports = function (path) {

  var db = new sqlite3.Database(path || 'users.sqlite');

  db.run(
    'CREATE TABLE IF NOT EXISTS users ' +
    '(username TEXT PRIMARY KEY, password TEXT, salt TEXT) ' +
    'WITHOUT ROWID'
  );


  return {
    find: function (username, callback) {
      return db.get(
        'SELECT * FROM users WHERE username=?',
        username,
        callback
      );
    },
    setUp: function (req, res, next) {
      var username = req.body.username;
      var password = req.body.password;

      bcrypt.genSalt(100, function (err, salt) {
        if (err) { return res.send(err); }
        bcrypt.hash(password, salt, null, function (err, hashed) {
          if (err) { return res.send(err); }
          db.run(
            'INSERT OR FAIL INTO users VALUES (?, ?, ?)',
            username,
            hashed,
            salt,
            function (err, rows) {
              if (err) { return res.send(err); }
              res.send('User ' + rows.username + ' created');
              next();
            }
          );
        });
      });
    }
  };
};
