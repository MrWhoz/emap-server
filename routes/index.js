var express = require('express');
var router = express.Router();
var node = require('../models/node.js');

//https://api.thingspeak.com/update?api_key=G1JJIY5JTMO7MLXE&field3=10&field1=10&field2=16

router.get('/', function(req,res,next){
  res.render('index');
  node.connect();
})
router.get('/add', function(req,res,next){
  res.render('index');
  console.log(req.query.node);
  node.add();
})
module.exports = router;
