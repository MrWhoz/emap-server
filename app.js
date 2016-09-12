var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
/*---------------BEGIN INIT------------------*/

var routes = require('./routes/index');
var app = express();

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname,'public')));

app.use('/', routes);

app.use(function(req,res,next){
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


module.exports = app;
