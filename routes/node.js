var express = require('express');
var sockio = require("socket.io");
var sess;
var node = require('../models/node.js');
// -----
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('NODE ROUTE');
});

router.get('/test', function(req, res, next) {
    res.send('test ROUTE');
});
router.get('/monthlyrecord', async function(req, res, next) {
  console.log('get here');
    var data = await node.getRecordCount();
    var nodes = await node.getNodeCount();
    console.log(data,nodes);
    res.send({
        record: data,
        'nodes': nodes
    });
});
module.exports = router;
