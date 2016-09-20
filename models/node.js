var r = require('rethinkdb');
var config = require('../config');
var dbName = config.rethinkdb.db;
var connection = null;

async function connect() {
    connection = await r.connect(config.rethinkdb);
    console.log('connected');
    return connection;
};

async function addNodeData(nodeData) {
    console.log(nodeData);
    var connection = await connect();
    var data = {
        id: nodeData.nodeID,
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

async function getNodeDataByID(id) {
    var connection = await connect();
    var node = await r.db(dbName).table("nodeData").filter({
        nodeID: id
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
};
