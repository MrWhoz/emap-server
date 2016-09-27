var express = require('express');
var router = express.Router();
var node = require('../models/node.js');

//https://api.thingspeak.com/update?api_key=G1JJIY5JTMO7MLXE&field3=10&field1=10&field2=16
//TODO
router.get('/', function(req, res, next) {
    res.render('index');
});

/* GET Contact page. */
router.get('/contact', function(req, res) {
    res.render('contact', {
        title: 'Contact'
    });
});

/* GET Graph page. */
router.get('/graph', function(req, res) {
    res.render('graph', {
        title: 'Graph'
    });
});

/* GET Stastic page. */
router.get('/Stastic', function(req, res) {
    res.render('Stastic', {
        title: 'Stastic'
    });
});

/* GET Home page. */
router.get('/home', function(req, res) {
    res.render('home', {
        title: 'Home'
    });
});

/* GET ConfigMarkers page. */
router.get('/configmarkers', function(req, res) {
    res.render('configmarkers', {
        title: 'Config'
    });
});


router.get('/getinfo', async function(req, res, next) {
    if (req.query.id) {
        var data = await node.getNodeInfoByID(req.query.id);
    } else if (req.query.phone) {
        var data = await node.getNodeInfoByPhone(req.query.phone);
    }
    res.send(data);
});

router.get('/getdata', async function(req, res, next) {
    if (req.query.id) {
        var data = await node.getNodeDataByID(req.query.id);
    }
    res.send(data);
});

router.get('/initnew', async function(req, res, next) {
  // TODO : change get to post method, discuss about using device or web/app to config this
    let data = {
        "node_id": req.query.node,
        "location": req.query.loc,
        "phone": req.query.phone,
        status: 0
    };
    console.log(data);
    node.addNode(data);
})

router.post('/updatenode', async function(req, res, next) {
    if (req.query.node) {
        let data = {
            "node_id": req.query.node,
            "location": req.query.loc,
            "phone": req.query.phone
        }
        var result = await node.updateNode(data);
    };
    res.send(result);
});

router.post('/replace', async function(req, res, next) {
    if (req.query.node && req.query.node_new) {
        var result = await node.replaceNode(req.query.node_new, req.query.node);
    }
    res.send(result);
});

router.get('/add', function(req, res, next) {
    res.render('index');
    let nodeData = {
        "node_id": req.query.node,
        "s1": req.query.s1,
        "s2": req.query.s2,
        "s3": req.query.s3
    };
    node.addNodeData(nodeData);
});

module.exports = router;
