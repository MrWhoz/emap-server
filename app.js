var express = require('express');
var session = require('express-session');
var engine = require('ejs-locals');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
require('babel-register');
require('babel-polyfill');
var serveIndex = require('serve-index');
//const flash = require('connect-flash');
var auth = require('./routes/auth')(passport);
/*---------------BEGIN INIT------------------*/

var routes = require('./routes/index');
var user = require('./routes/user');
var node = require('./routes/node');
var initPassport = require('./libs/auth');

var app = express();

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
initPassport(passport);
app.use(passport.initialize());
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
    secret: 'ssshhhh'
}));

app.use(passport.session());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/log', express.static(path.join(__dirname, 'log')));
app.use('/log', serveIndex('./log'));
app.use('/', routes);
app.use('/user', user);
app.use('/node', node);
app.use('/auth', auth);
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
//app.use(flash());
app.get('/url', function(req, res) {
    res.render('view', {
        page: req.url,
        nav: {
            'home': '/home',
            'graph': '/graph',
            'stastic': '/stastic',
            'contact': '/contact'
        }
    });
});

//--------

module.exports = app;
