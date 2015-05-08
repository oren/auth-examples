var bcrypt = require('bcrypt-nodejs');
var sqlite3 = require('sqlite3').verbose();

module.exports = function (path) {

  var db = new sqlite3.Database(path || 'users.sqlite');

  db.serialize(function () {
    db.run('CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT, salt TEXT) WITHOUT ROWID');

    var username = 'mats';
    var password = '2k15';

    bcrypt.genSalt(100, function (err, salt) {
      if (err) throw err;
      bcrypt.hash(password, salt, null, function (err, hashed) {
        if (err) {console.log(err); return err};
        db.run('INSERT OR FAIL INTO users VALUES (?, ?, ?)', username, hashed, salt, function (err, rows){
          if (err) console.log(err);
        })
      })
    })
  })

  return {
    find: function (username, callback) {
      return db.get('SELECT * FROM users WHERE username=?', username, callback)
    }
  }
}
