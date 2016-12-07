var express = require('express');
var sockio = require("socket.io");
var sess;
// -----
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('NODE ROUTE');
});

router.get('/test', function(req, res, next) {
    res.send('test ROUTE');
});

module.exports = router;
