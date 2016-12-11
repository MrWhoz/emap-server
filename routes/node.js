var express = require('express');
var sockio = require("socket.io");
var sess;
var node = require('../models/node.js');
// -----
var router = express.Router();
var logger = require('../libs/winston.js');
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
    console.log(data, nodes);
    res.send({
        record: data,
        'nodes': nodes
    });
});
router.get('/config', function(req, res) {
    if (req.session.hasOwnProperty('passport')) {
        res.render('configmarkers', {
            qs: req.query
        });
    } else res.render('error', {
        code: -1,
        message: 'You are not authenticated'
    });
});

/* GET Add Node page. */ //TODO :move all node function to route node
router.get('/addnode', function(req, res) {
    if (req.session.hasOwnProperty('passport')) {
        res.render('addnode', {
            qs: req.query
        });
    } else res.send('error', {
        code: -1,
        message: 'You are not authenticated'
    });
});

/* GET ConfigNode page. */ //TODO :move all node function to route node
router.get('/confignode', function(req, res) {
    if (req.session.hasOwnProperty('passport')) {
        res.render('confignode', {
            qs: req.query
        });
    } else res.render('error', {
        code: -1,
        message: 'You are not authenticated'
    });
});

/* GET updatenode page. */ //TODO :move all node function to route node
router.get('/update', function(req, res) {
    if (req.session.hasOwnProperty('passport')) {
        res.render('update', {
            qs: req.query
        });
    } else res.render('error', {
        code: 0,
        message: 'You are not authenticated'
    });

});

/* GET replacenode page. */ //TODO :move all node function to route node
router.get('/replace', function(req, res) {
    if (req.session.hasOwnProperty('passport')) {
        res.render('replace', {
            qs: req.query
        });
    }
    res.render('error', {
        code: 0,
        message: 'You are not authenticated'
    });
});
// ===============API============
// ==============================
// ==============================
router.get('/replacenode', async function(req, res, next) {
    if (req.query.node && req.query.node_new) {
        var result = await node.replaceNode(req.query.node_new, req.query.node);
    }
    res.redirect('/node/confignode');
});
// GET node/nodelist info, status 1 = active 0 = disable
router.get('/getinfo', async function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    if (req.query.id) {
        var data = await node.getNodeInfoByID(req.query.id);
        logger.info("IP:" + req.clientIP + " GET /node/getinfo: get node info by id:", req.query.id, data);
    } else if (req.query.phone) {
        var data = await node.getNodeInfoByPhone(req.query.phone);
        logger.info("IP:" + req.clientIP + " GET /node/getinfo: get node info by phone:", req.query.id, data);
    } else if (req.query.list) {
        let status = parseInt(req.query.status)
        var data = await node.getNodeList(status);
        logger.info("IP:" + req.clientIP + " GET /node/getinfo: get list node info - number of nodes", data.length);
    }
    res.send(data);
});

router.get('/getdata', async function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    if (req.query.id) {
        var data = await node.getNodeDataByID(req.query.id);
    }
    logger.info("IP:" + req.clientIP + " GET /node/getdata: Node data ID", req.query.id, 'number of records: ', data.length);
    res.send(data);
});

// GET add node data /add?node=[node]&s1=[sensor1]&s2=[sensor2]&s3=[sensor3]
router.post('/initnew', async function(req, res, next) {
    // TODO : change get to post method, discuss about using device or web/app to config this
    var lat = parseFloat(req.body.lat);
    var lng = parseFloat(req.body.lng);
    let data = {
        node_id: req.body.node_id,
        location: {
            lat: lat,
            lng: lng
        },
        phone: req.body.phone,
        status: 0
    };
    logger.info("IP:" + req.clientIP + " GET /node/initnew: Node data", data);
    let result = await node.addNode(data);
    // res.send(result);
    logger.info("IP:" + req.clientIP + " GET /node/initnew: init new node ", result);
    res.send(result);
})

router.post('/updatenode', async function(req, res, next) {
    if (req.body.node_id) {
        var lat = parseFloat(req.body.lat);
        var lng = parseFloat(req.body.lng);
        let data = {
            node_id: req.body.node_id,
            location: {
                lat: lat,
                lng: lng
            },
            phone: req.body.phone
        }
        let result = await node.updateNode(data);
        logger.info("IP:" + req.clientIP + " GET /node/updatenode: Node data", data);
        res.send(result)
    }
});
router.get('/add', async function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let nodeData = {
        "node_id": req.query.node,
        "s1": req.query.s1,
        "s2": req.query.s2,
        "s3": req.query.s3,
        "s4": req.query.s4,
        "s5": req.query.s5
    };
    var result = await node.addNodeData(nodeData);
    logger.info("IP:" + req.clientIP + " GET /node/add: Node data", result, nodeData);
    res.send(result);
});
module.exports = router;
