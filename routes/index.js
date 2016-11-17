var express = require('express');
var session = require('express-session');
var sockio = require("socket.io");
var sess;
// -----
var router = express.Router();
var node = require('../models/node.js');

router.use(session({
    secret: 'ssshhhh'
}));

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


var sess;
var checksess;

router.get('/', function(req, res) {
    // sess=req.session;
    if (checksess) {
        res.render('home', {
            title: 'test',
            temp: checksess
        });
    } else {
        res.render('home', {
            title: 'test',
            temp: 'nouser'
        });
    }
});

router.post('/login', function(req, res) {
    sess = req.session;
    sess.email = req.body.username;
    res.end('done');
});

router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/home');
        }
    })
});

router.get('/check', function(req, res) {
    sess = req.session;

    if (sess.email) {
        res.redirect('/admin');
    } else {
        res.render('check');
    }
});

router.get('/home', function(req, res) {
    // sess=req.session;
    sess = req.session;
    checksess = sess.email;
    if (checksess) {
        res.render('home', {
            title: 'test',
            temp: checksess
        });


    } else {
        res.render('home', {
            title: 'test',
            temp: 'nouser'
        });

    }
});
router.get('/stastic', function(req, res) {
    if (checksess) {
        res.render('stastic', {
            title: 'test',
            temp: checksess
        });
        app.get('/contact', function(req, res) {
            if (sess.email) {
                res.render('contact', {
                    title: 'contact',
                    temp: checksess
                })
            }
        });


    } else {
        res.render('stastic', {
            title: 'test',
            temp: 'nouser'
        });

    }
});

//------------
router.get('/contact', function(req, res) {
    // sess=req.session;
    if (checksess) {
        res.render('contact', {
            title: 'test',
            temp: checksess
        });


    } else {
        res.render('contact', {
            title: 'test',
            temp: 'nouser'
        });

    }
});
//-----Graph session
router.get('/graph', function(req, res) {
    // sess=req.session;
    if (checksess) {
        res.render('graph', {
            title: 'test',
            qs: req.query,
            temp: checksess
        });


    } else {
        res.render('graph', {
            title: 'test',
            temp: 'nouser',
            qs: req.query
        });

    }
});

/* GET ConfigMarkers page. */ //TODO :move all node function to route node
router.get('/configmarkers', function(req, res) {
    res.render('configmarkers', {
        title: 'Config'
    });
});

/* GET Add Node page. */ //TODO :move all node function to route node
router.get('/configmarkers/addnode', function(req, res) {
    res.render('addnode', {
        title: 'Add Node'
    });
});

/* GET ConfigNode page. */ //TODO :move all node function to route node
router.get('/configmarkers/confignode', function(req, res) {
    res.render('confignode', {
        title: 'Config Node'
    });
});

/* GET updatenode page. */ //TODO :move all node function to route node
router.get('/configmarkers/confignode/update', function(req, res) {
    res.render('update', {
        title: 'Update Node'
    });
});

/* GET replacenode page. */ //TODO :move all node function to route node
router.get('/configmarkers/confignode/replace', function(req, res) {
    res.render('replace', {
        title: 'Replace Node'
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
    let result = await node.addNode(data);
    // res.send(result);
    if (result == 'duplicated') {
        res.send({
            status: 'duplicated'
        });
    } else {
        res.send({
            status: 'sucess'
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
        // res.send('result');
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
    res.send(await node.addNodeData(nodeData));

});

// Graph with nodeID

// router.get('/GraphID', function(req, res) {
//     console.log(req.query);
//     res.render('test', {
//         qs: req.query
//     });
// })

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
