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

router.get('/login', async function(req, res, next) {
  // TODO : login
});

router.post('/login', async function(req, res, next) {
  // TODO: post login info
});


router.get('/register', async function(req, res, next) {

  //TODO: below are just test code, clean it
  var test = {
    id:'xtungvo',
    name:'Tung Tan Vo',
    role:'user',
    password:'abc123',
    mail:'tung@gmail.com'
  }
  var data = {
    id: test.id,
    password: test.password,
    role: test.role,
    name: test.name,
    mail: test.mail,
    status: 'active'
  };
  var result = await user.register(data);
  res.send(result);
});

router.post('/register', async function(req, res, next) {
  //TODO: post register
  console.log('get register post',req.body);
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
module.exports = router;
