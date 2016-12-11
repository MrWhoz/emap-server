var express = require('express');
var sockio = require("socket.io");
var router = express.Router();
var user = require('../models/user.js');

router.get('/', async function(req, res, next) {
    var userList = await user.getUserList('active');
    console.log(userList);
    res.send(userList);
});

router.post('/register', async function(req, res, next) {
    //TODO: post register
    console.log('get register post', req.body);
    var data = {
        id: req.body.username,
        password: req.body.password,
        role: 'customer',
        name: req.body.name,
        mail: req.body.mail,
        status: 'active'
    };
    var result = await user.register(data);
    res.render('success',{
      message : 'Account Created'
    });
});

module.exports = router;
