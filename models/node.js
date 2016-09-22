var r = require('rethinkdb');
var config = require('../config');
var dbName = config.rethinkdb.db;
var connection = null;
var uuid = require('node-uuid');

async function connect() {
    connection = await r.connect(config.rethinkdb);
    return connection;
};

async function addNode(data) {
    var connection = await connect();
    var duuid = uuid.v4();
    var data = {
        node_id: data.node_id,
        time: new Date(),
        location: data.location,
        phone: data.phone,
        data_id: duuid,
        status :0
    }
    console.log('db', data);
    let result = await r.db(dbName).table("nodeList").insert(data).run(connection);
}

async function addNodeData(nodeData) {
    var connection = await connect();
    let nodeinfo = await getNodeInfoByID(nodeData.node_id);
    var data = {
        data_id: nodeinfo.data_id,
        time: new Date(),
        data: {
            co: nodeData.s1,
            temp: nodeData.s2,
            dust: nodeData.s3
        }
    }
    let result = await r.db(dbName).table("nodeData").insert(data).run(connection);
}

async function getNodeInfoByID(id) {
    var connection = await connect();
    console.log('this is ID :', id);
    var node = await r.db(dbName).table("nodeList").filter({
        node_id: id
    }).run(connection);
    node = await node.toArray();
    return node[0] || false;
}

async function getNodeInfoByPhone(phone) {
    var connection = await connect();
    var node = await r.db(dbName).table("nodeList").filter({
        phone: phone
    }).run(connection);
    node = await node.toArray();
    return node[0] || false;
}

async function getdataIDByNodeID(node_id){
  let nodeinfo = await getNodeInfoByID(node_id);
  return nodeinfo.data_id;
}
/// get data by node_id not data_id

async function getNodeDataByID(node_id) {
    var connection = await connect();
    let data_id = await getdataIDByNodeID(node_id);
    var node = await r.db(dbName).table("nodeData").filter({
        data_id: data_id
    }).run(connection);
    node = await node.toArray();
    return node || false;
}

module.exports = {
    connect,
    addNodeData,
    getNodeInfoByID,
    getNodeInfoByPhone,
    getNodeDataByID,
    addNode
};
