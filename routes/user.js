var express = require('express');
var session = require('express-session');
var sockio = require("socket.io");
var router = express.Router();
var passport = require('passport');
var user = require('../models/user.js');

router.get('/', async function(req, res, next) {
  console.log('dsadasasd');
    var userList = await user.getUserList('active');


    console.log(userList);
});

router.post('/login', async function(req, res, next) {

});


module.exports = router;
