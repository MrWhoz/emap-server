var express = require('express');
var session = require('express-session');
var sockio = require("socket.io");
var sess;
// -----
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('USER ROUTE');
});

module.exports = router;
