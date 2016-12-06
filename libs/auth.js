var user = require('../models/user.js');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

    passport.use('local', new LocalStrategy(
        async function(username, password, done) {
            console.log('auth', username, password);
            var tempUser = await user.getUserById(username);
            if (tempUser.password == password) {
                console.log('passsport login success');
                return done(null, tempUser);
            } else return done(null, false);
        }
    ));

    passport.serializeUser(function(user, done) {
      console.log('serializing user: ',user.username);
        done(null, user);
    });

    passport.deserializeUser(async function(duser, done) {
        var existUser = await user.getUserById(duser.username);
        console.log('deserializing user found: ',existUser)
        done(err, existUser);
    });
}
