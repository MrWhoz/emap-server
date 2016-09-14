var express = require('express');
var router = express.Router();
var node = require('../models/node.js');
router.get('/', function(req,res,next){
  res.render('index');
  node.connect();
})

module.exports = router;
