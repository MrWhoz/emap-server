var express = require('express');
var router = express.Router();
var node = require('../models/node.js');
router.get('/', function(req,res,next){
  res.render('index');
  node.connect();
})
router.get('/add', function(req,res,next){
  res.render('index');
  node.add();
})
module.exports = router;
