var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
require('babel-register');
require('babel-polyfill');
/*---------------BEGIN INIT------------------*/

var routes = require('./routes/index');
var app = express();

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.set('views', path.join(__dirname,'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname,'public')));

app.use('/', routes);

app.use(function(req,res,next){
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.get('/url', function (req, res) {
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


module.exports = app;
