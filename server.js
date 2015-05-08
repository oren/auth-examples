var argv = require('minimist')(process.argv.slice(2));
var JWT_SECRET = argv.jwtSecret;
var JWT_EXPIRY = argv.jwtExpiry;
var DB_PATH = argv.dbPath

var restify = require('restify');
var passport = require('passport');
var fs = require('fs');


var db = require('./db')(DB_PATH)


var auth = require('./auth')(db, JWT_SECRET, JWT_EXPIRY);


passport.use(auth.local);
passport.use(auth.bearer)

var bearerAuth = passport.authenticate('bearer', {session: false});
var localAuth = passport.authenticate('local', {session: false});

var server = restify.createServer({
  name: 'aath'
});
server.pre(restify.pre.userAgentConnection());
server.use(restify.bodyParser({mapParams: false}));

server.post('/login',
  function (req, res, next) { console.log(req.body); next();},
  localAuth,
  function(req, res) { res.send("wojooo")}
);


server.listen('8080', function () {
  console.log('Yolo at 8080')
});
