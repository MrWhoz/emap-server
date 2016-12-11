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
router.get('/isLogged', ensureAuthenticated, function(req, res, next) {

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

router.get('/static', async function(req, res) {

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

router.get('/admin', function(req, res) {
    res.render('admin', {
        title: 'test'
    });
});

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
