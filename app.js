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
var user = require('./routes/user');
var node = require('./routes/node');

var app = express();

var config = require('./routes/index');

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(session({
    secret: 'ssshhhh'
}));
var sess;
var checksess;

app.get('/check', function(req, res) {
    sess = req.session;

    if (sess.email) {
        res.redirect('/admin');
    } else {
        res.render('check');
    }
});

// app.get('/contact',function(req,res){
//       res.render('contact',{
//         title: 'contact', temp:'nouser'
//       })
// });
// check session
app.post('/login', function(req, res) {
    sess = req.session;
    sess.email = req.body.username;
    res.end('done');
});
app.use(function(req, res, next) {

    res.locals.session = "hi";
    next();
});

app.get('/home', function(req, res) {
    // sess=req.session;
    sess = req.session;
    checksess = sess.email;
    if (checksess) {
        res.render('home', {
            title: 'test',
            temp: checksess
        });


    } else {
        res.render('home', {
            title: 'test',
            temp: 'nouser'
        });

    }
});
app.get('/stastic', function(req, res) {
    if (checksess) {
        res.render('stastic', {
            title: 'test',
            temp: checksess
        });
        app.get('/contact', function(req, res) {
            if (sess.email) {
                res.render('contact', {
                    title: 'contact',
                    temp: checksess
                })
            }
        });


    } else {
        res.render('stastic', {
            title: 'test',
            temp: 'nouser'
        });

    }
});

//------------
app.get('/contact', function(req, res) {
    // sess=req.session;
    if (checksess) {
        res.render('contact', {
            title: 'test',
            temp: checksess
        });


    } else {
        res.render('contact', {
            title: 'test',
            temp: 'nouser'
        });

    }
});
//-----Graph session
app.get('/graph', function(req, res) {
    // sess=req.session;
    if (checksess) {
        res.render('graph', {
            title: 'test',
            qs: req.query,
            temp: checksess
        });


    } else {
        res.render('graph', {
            title: 'test',
            temp: 'nouser',
            qs: req.query
        });

    }
});
//----home page session
//-----Graph session
app.get('/', function(req, res) {
    // sess=req.session;
    if (checksess) {
        res.render('home', {
            title: 'test',
            temp: checksess
        });


    } else {
        res.render('home', {
            title: 'test',
            temp: 'nouser'
        });

    }
});



app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/home');
        }
    })
});

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', user);
app.use('/node', node);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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
