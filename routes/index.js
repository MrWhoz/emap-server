var express = require('express');
var sockio = require("socket.io");
var sess;
// -----
var router = express.Router();
var node = require('../models/node.js');
var logger = require('../libs/winston.js');
var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");

var smtpTransport = nodemailer.createTransport(smtpTransport({
    host: "smtp.gmail.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: "manhcuong3010a9@gmail.com",
        pass: "manhcuong1"
    }
}));
// ============SESSION ===========
router.get('/isLogged', ensureAuthenticated, function(req,res,next) {

});

function ensureAuthenticated(req, res, next) {
    if (req.session.passport) {
      res.header("Access-Control-Allow-Origin", "*");
        res.send({
            username: req.session.passport.user.username,
            name: req.session.passport.user.fullname
        });
        console.log('ensureAuthenticated');
        return next();
    } else {
        res.send({
            message: 'not authenticate',
            code: -1
        });
        console.log('no ensureAuthenticated');
        return next();
    }
}

router.get('/', function(req, res) {
    res.render('index');
    logger.info("IP:" + req.clientIP + " GET /route");
});

router.get('/home', function(req, res) {
    res.render('index');
    logger.info("IP:" + req.clientIP + " GET /home route");
});

router.get('/static', function(req, res) {
    res.render('static');
    logger.info("IP:" + req.clientIP + " GET /static route");
});

//------------
router.get('/contact', function(req, res) {
    res.render('contact');

    logger.info("IP:" + req.clientIP + " GET /contact route");
});
//-----Graph session
router.get('/graph', function(req, res) {
    res.render('graph', {
        qs: req.query
    });
    logger.info("IP:" + req.clientIP + " GET /graph route");
});

/* GET ConfigMarkers page. */ //TODO :move all node function to route node
router.get('/configmarkers', function(req, res) {
    if (req.session.hasOwnProperty('passport')) {
        res.render('configmarkers', {
            username: req.session.passport.user.username,
            name: req.session.passport.user.fullname,
            qs: req.query
        });
    } else res.render('configmarkers', {
        username: null,
        name: null,
        qs: req.query
    });
});

/* GET Add Node page. */ //TODO :move all node function to route node
router.get('/configmarkers/addnode', function(req, res) {
    res.render('addnode', {
        qs: req.query
    });
});

/* GET ConfigNode page. */ //TODO :move all node function to route node
router.get('/configmarkers/confignode', function(req, res) {
    res.render('confignode', {
        qs: req.query
    });
});

/* GET updatenode page. */ //TODO :move all node function to route node
router.get('/configmarkers/confignode/update', function(req, res) {
    if (req.session.hasOwnProperty('passport')) {
        res.render('update', {
            username: req.session.passport.user.username,
            name: req.session.passport.user.fullname,
            qs: req.query
        });
    } else res.render('update', {
        username: null,
        name: null,
        qs: req.query
    });

});

/* GET replacenode page. */ //TODO :move all node function to route node
router.get('/configmarkers/confignode/replace', function(req, res) {
    if (req.session.hasOwnProperty('passport')) {
        res.render('replace', {
            username: req.session.passport.user.username,
            name: req.session.passport.user.fullname,
            qs: req.query
        });
    } else res.render('replace', {
        username: null,
        name: null,
        qs: req.query
    });
});

router.get('/admin', function(req, res) {
    res.render('admin', {
        title: 'test'
    });
});


// GET node/nodelist info, status 1 = active 0 = disable
router.get('/getinfo', async function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    if (req.query.id) {
        var data = await node.getNodeInfoByID(req.query.id);
        logger.info("IP:" + req.clientIP + " GET /getinfo: get node info by id:", req.query.id, data);
    } else if (req.query.phone) {
        var data = await node.getNodeInfoByPhone(req.query.phone);
        logger.info("IP:" + req.clientIP + " GET /getinfo: get node info by phone:", req.query.id, data);
    } else if (req.query.list) {
        let status = parseInt(req.query.status)
        var data = await node.getNodeList(status);
        logger.info("IP:" + req.clientIP + " GET /getinfo: get list node info - number of nodes", data.length);
    }
    res.send(data);
});

router.get('/getdata', async function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    if (req.query.id) {
        var data = await node.getNodeDataByID(req.query.id);
    }
    logger.info("IP:" + req.clientIP + " GET /getdata: Node data ID", req.query.id, 'number of records: ', data.length);
    res.send(data);
});

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
    logger.info("IP:" + req.clientIP + " GET /initnew: Node data", data);
    let result = await node.addNode(data);
    // res.send(result);
    logger.info("IP:" + req.clientIP + " GET /initnew: status init new node is ", result);
    if (result == 'duplicated') {
        res.send({
            status: 'duplicated'
        });
    } else {
        res.send({
            status: 'success'
        });
    }
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
        logger.info("IP:" + req.clientIP + " GET /updatenode: Node data", data);
        res.send({
            status: result
        })
    }
});

router.get('/replace', async function(req, res, next) {
    if (req.query.node && req.query.node_new) {
        var result = await node.replaceNode(req.query.node_new, req.query.node);
    }
    res.redirect('/configmarkers/confignode');
});
// GET add node data /add?node=[node]&s1=[sensor1]&s2=[sensor2]&s3=[sensor3]

//TODO s4
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
    logger.info("IP:" + req.clientIP + " GET /add: Node data", nodeData);
    res.send(await node.addNodeData(nodeData));

});

// Graph with nodeID

router.get('/send', function(req, res) {
    var mailOptions = {
        to: 'manhcuong3010a9@gmail.com',
        subject: req.query.subject,
        text: req.query.text
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
});

module.exports = router;
