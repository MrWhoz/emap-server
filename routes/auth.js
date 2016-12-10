var express = require('express');
var router = express.Router();
var user = require('../models/user.js');

module.exports = function(passport) {
    router.get('/loginState', function(req, res) {
        if (req.isAuthenticated()) {
            res.send({
                'isLogin': true,
                'user': {
                    'displayName': req.user.name,
                    'user_id': req.user.user_id
                }
            })
        } else
            res.send({
                'isLogin': false
            })
    });

    router.post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/#loginfail',
            passReqToCallback: true,
            session:true
        }),
        function(req, res, next) {
            res.redirect('/');
        });

    router.get('/logout', function(req, res) {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });
    router.get('/success', function(req, res) {
        console.log('success');
        res.send({
            state: 'success',
            username: req.session.passport.user
        });
    });

    //send failure login state back to view(angular)
    router.get('/failure', function(req, res) {
        console.log('failure');
        res.send({
            state: 'failure',
            user: null,
            message: "Invalid username or password"
        });
    });

    function isLoggedIn(req, res, next) {
        console.log('islog', req);
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            console.log('islog success');
            return next();
        }
        // if they aren't redirect them to the home page
        console.log('islog failure');
        res.redirect('/');

    }
    return router;
}
