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

/* GET Add Node page. */
router.get('/configmarkers/addnode', function(req, res) {
    res.render('addnode', {
        title: 'Add Node'
    });
});

/* GET ConfigNode page. */
router.get('/configmarkers/confignode', function(req, res) {
    res.render('confignode', {
        title: 'Config Node'
    });
});

/* GET updatenode page. */
router.get('/configmarkers/confignode/update', function(req, res) {
    res.render('update', {
        title: 'Update Node'
    });
});

/* GET replacenode page. */
router.get('/configmarkers/confignode/replace', function(req, res) {
    res.render('replace', {
        title: 'Replace Node'
    });
});


// GET node/nodelist info, status 1 = active 0 = disable
router.get('/getinfo', async function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    if (req.query.id) {
        var data = await node.getNodeInfoByID(req.query.id);
    } else if (req.query.phone) {
        var data = await node.getNodeInfoByPhone(req.query.phone);
    } else if (req.query.list) {
        let status = parseInt(req.query.status)
        var data = await node.getNodeList(status);
    }
    res.send(data);
});

router.get('/getdata', async function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    if (req.query.id) {
        var data = await node.getNodeDataByID(req.query.id);
    }
    res.send(data);
});

//------------------------

// router.get('/getalldata', function(req,res){
//     console.log(req.query);
//     var data = await node.getAllNodeInfo();
//     res.send(data);
// })

router.get('/initnew', async function(req, res, next) {
    // TODO : change get to post method, discuss about using device or web/app to config this
    var lat = parseFloat(req.query.lat);
    var lng = parseFloat(req.query.lng);
    let data = {
        node_id: req.query.node,
        location: {
            lat: lat,
            lng: lng
        },
        phone: req.query.phone,
        status: 0
    };
    let result = await node.addNode(data);
    // res.send(result);
    res.redirect('/home');
})

router.get('/updatenode', async function(req, res, next) {
    if (req.query.node) {
        var lat = parseFloat(req.query.lat);
        var lng = parseFloat(req.query.lng);
        let data = {
            node_id: req.query.node,
            location: {
                lat: lat,
                lng: lng
            },
            phone: req.query.phone
        }
        let result = await node.updateNode(data);
        // res.send('result');
        res.redirect('/configmarkers/confignode');
    } else
        res.send('error');
});

router.get('/replace', async function(req, res, next) {
    if (req.query.node && req.query.node_new) {
        var result = await node.replaceNode(req.query.node_new, req.query.node);
    }
    res.redirect('/configmarkers/confignode');
});
// GET add node data /add?node=[node]&s1=[sensor1]&s2=[sensor2]&s3=[sensor3]
router.get('/add', async function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    let nodeData = {
        "node_id": req.query.node,
        "s1": req.query.s1,
        "s2": req.query.s2,
        "s3": req.query.s3
    };
    res.send(await node.addNodeData(nodeData));
    res.redirect('/home');
});

// Graph with nodeID

router.get('/GraphID', function(req, res) {
    console.log(req.query);
    res.render('test', {
        qs: req.query
    });
})
module.exports = router;
