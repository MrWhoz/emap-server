var user = require('../models/user.js');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
  
  passport.serializeUser(function(user, done) {
    console.log('serializing user: ',user.username);
      done(null, user);
  });

  passport.deserializeUser(async function(duser, done) {
      var existUser = await user.getUserById(duser.username);
      console.log('deserializing user found: ',existUser)
      return done(err, existUser);
  });
    passport.use('local', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password'
        //passReqToCallback : true // allows us to pass back the entire request to the callback
    },
        async function(username, password, done) {
            var existUser = await user.getUserById(username);
            if (existUser.password == password) {
                console.log('passsport login success');
                return done(null, existUser);
            } else return done(null, false);
        }
    ));
}
