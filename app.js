var express = require('express');
var session = require('express-session');
var engine = require('ejs-locals');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
require('babel-register');
require('babel-polyfill');
/*---------------BEGIN INIT------------------*/

var routes = require('./routes/index');
var app = express();

var config = require('./routes/index');

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.set('views', path.join(__dirname,'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(session({secret:'ssshhhh'}));
var sess;

app.get('/check',function(req,res){
    sess = req.session;

    if(sess.email){
      res.redirect('/admin');
    }else{
      res.render('check');
    }
});


// check session 
app.post('/login',function(req,res){
  sess = req.session;
  sess.email = req.body.username;
  res.end('done');
});
app.use(function(req, res, next){
   
    res.locals.session = "hi";
    next();
});
app.get('/stastic',function(req,res){
  sess=req.session;
  if(sess.email){
    res.render('stastic', {
        title: 'test', temp:sess.email
    });
    

  }else{
    // res.write('<h1>Please login first.</h1>');
    // res.end('<a href="/check">Login</a>');
    res.render('stastic', {
        title: 'test',
        temp: 'nouser'
    });
  }
});

app.get('/logout',function(req,res){
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect('/stastic');
    }
  })
});

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

//--------



module.exports = app;
