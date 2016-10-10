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
  sess.email = req.body.email;
  res.end('done');
});
app.get('/admin',function(req,res){
  sess=req.session;
  if(sess.email){
    res.set('cuong',sess.email);
    res.write('<h1>Hello '+sess.email+'</h1>');
    res.end('<a href="/logout">Logout</a>');
  }else{
    res.write('<h1>Please login first.</h1>');
    res.end('<a href="/check">Login</a>');
  }
})


// var middleware = {

//     render: function (view) {
//         return function (req, res, next) {
//             res.render(view);
//         }
//     },

//     globalLocals: function (req, res, next) {
//         res.locals({ 
//             siteTitle: "My Website's Title",
//             pageTitle: "The Root Splash Page",
//             author: "Cory Gross",
//             description: "My app's description",
//         });
//         next();
//     },

//     index: function (req, res, next) {
//         res.locals({
//             indexSpecificData: someData
//         });
//         next();
//     }

// };


// app.use(middleware.globalLocals);
// app.get('/stastic', middleware.index, middleware.render('stastic'));
app.get('/logout',function(req,res){
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect('/');
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




module.exports = app;
