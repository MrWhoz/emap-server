var express = require('express');
var session = require('express-session');
var sockio = require("socket.io");
var router = express.Router();
var passport = require('passport');
var user = require('../models/user.js');
var LocalStrategy = require('passport-local').Strategy;

passport.use('local', new LocalStrategy(
    async function(username, password, done) {
        var User = await user.getUserById(username);
        if (User) {
            if (User.password == password) {
                return done(null, User);
            } else return done(null, false)
        } else
            return done(null, false);
    }));

passport.serializeUser(function(user, done) {
    done(null, user.user_id);
});

passport.deserializeUser(async function(id, done) {
    var existUser = await user.getUserById(id);
    return done(err, existUser);
});

router.get('/', async function(req, res, next) {
    var userList = await user.getUserList('active');
    console.log(userList);
    res.send(userList);
});

router.get('/loginState', function(req, res) {
    if (req.isAuthenticated())
        res.send({
            'isLogin': true,
            'user': {
                'displayName': req.user.name,
                'user_id': req.user.user_id
            }
        })
    else
        res.send({
            'isLogin': false
        })
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '#',
        failureRedirect: '#',
        failureFlash: true
    }),
    function(req, res) {
        res.end('gotcha');
    });

router.get('/success', function(req, res) {
    res.send({
        state: 'success',
        user: req.user ? req.user : null
    });
});

//send failure login state back to view(angular)
router.get('/failure', function(req, res) {
    res.send({
        state: 'failure',
        user: null,
        message: "Invalid username or password"
    });
});

router.post('/register', async function(req, res, next) {
    //TODO: post register
    console.log('get register post', req.body);
    var data = {
        id: req.body.id,
        password: req.body.password,
        role: req.body.role,
        name: req.body.name,
        mail: req.body.mail,
        status: 'active'
    };
    var result = await user.register(data);
    res.send(result);
});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
module.exports = router;
