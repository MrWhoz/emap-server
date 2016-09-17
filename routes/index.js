var express = require('express');
var router = express.Router();
var node = require('../models/node.js');

//https://api.thingspeak.com/update?api_key=G1JJIY5JTMO7MLXE&field3=10&field1=10&field2=16

router.get('/', function(req,res,next){
  res.render('index');
  var n1 = node.getNodeNodeId(2);
})
router.get('/add', function(req,res,next){
  res.render('index');
  var nodeData ={
    "nodeID" : req.query.node,
    "s1" : req.query.s1,
    "s2" : req.query.s2,
    "s3" : req.query.s3
  };
  console.log(req.query.node);
  node.addNodeData(nodeData);
})
module.exports = router;
