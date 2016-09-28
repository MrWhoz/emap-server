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
    var duuid;

    if (data.data_id) {
        duuid = data.data_id;
    } else duuid = uuid.v4();

    var data = {
        node_id: data.node_id,
        time: new Date(),
        location: data.location,
        phone: data.phone,
        data_id: duuid,
        status: 1
    }
    console.log('add node', data);
    let result = await r.db(dbName).table("nodeList").insert(data).run(connection);
    if (result) return result;
}

async function replaceNode(node_id_new, node_id_old) {
    var node_old = await getNodeInfoByID(node_id_old);
    var node = await getNodeInfoByID(node_id_new);
    if (node_old) {
        await changeNodeStatus(node_id_old, 0);
        if (node.status)
            await changeNodeStatus(node_id_new, 0);
        //
        console.log('this is node old', node_old);
        let data = {
            node_id: node.node_id,
            phone: node.phone,
            location: node_old.location,
            status: 1,
            data_id: node_old.data_id
        }
        console.log(data);
        let result = await addNode(data);
        return 'ok';
    } else return 'error';
}

async function addNodeData(nodeData) {
    let node_info = await getNodeInfoByID(nodeData.node_id);
    var data = {
        data_id: node_info.data_id,
        time: new Date(),
        data: {
            co: nodeData.s1,
            temp: nodeData.s2,
            dust: nodeData.s3
        }
    }
    let result = await r.db(dbName).table("nodeData").insert(data).run(connection);
    if (result) return result;
}

async function updateNode(data) {
    var node = await getNodeInfoByID(data.node_id);
    if (node) {
        var sResult = await changeNodeStatus(data.node_id, 0);
        if (sResult) {
            var nNode = await addNode(data);
            if (nNode) return 'ok';
        } else {
            return 0;
        }
    }
};

async function changeNodeStatus(node_id, status) {
    var result = await r.db(dbName).table("nodeList").filter({
        node_id: node_id
    }).update({
        status: status
    }).run(connection);
    if (result) {
        return 1;
    } else return 0;
}

async function getNodeInfoByID(id) {
    var connection = await connect();
    var node = await r.db(dbName).table("nodeList").filter({
        node_id: id,
        status: 1
    }).run(connection);
    node = await node.toArray();
    return node[0] || false;
}
async function getNodeList(status) {
    var connection = await connect();
    var node = await r.db(dbName).table("nodeList").filter({
        status: status
    }).run(connection);
    node = await node.toArray();
    return node || false;
}
async function getNodeByIDStatus(id, status) {
    // TODO get lastest node
    var connection = await connect();
    console.log('this is ID :', id);
    var node = await r.db(dbName).table("nodeList").filter({
        node_id: id,
        status: status
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

async function getdataIDByNodeID(node_id) {
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
    addNode,
    updateNode,
    replaceNode,
    changeNodeStatus,
    getNodeByIDStatus,
    getNodeList
};
