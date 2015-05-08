var argv = require('minimist')(process.argv.slice(2));
var JWT_SECRET = argv.jwtSecret || 'dontdothis';
var JWT_EXPIRY = argv.jwtExpiry || 1;
var DB_PATH = argv.dbPath

var restify = require('restify');
var passport = require('passport');
var fs = require('fs');


var db = require('./db')(DB_PATH)


var auth = require('./auth')(db, JWT_SECRET, JWT_EXPIRY);


passport.use(auth.local);
passport.use(auth.bearer(JWT_SECRET));

var bearerAuth = passport.authenticate('bearer', {session: false});
var localAuth = passport.authenticate('local', {session: false});

var server = restify.createServer({
  name: 'aath'
});
server.pre(restify.pre.userAgentConnection());
server.use(restify.bodyParser({mapParams: false}));

server.post('/login',
  localAuth,
  auth.issue(JWT_SECRET, JWT_EXPIRY)
);

server.get('/restricted',
  bearerAuth,
  function (req, res, next) {
    res.send('Congrats.');
    next();
  }
)


server.listen('8080', function () {
  console.log('Yolo at 8080')
});
