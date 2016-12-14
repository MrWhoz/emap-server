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
    if (data.data_id == null) {
        var node = await r.db(dbName).table('nodeList').filter({
            node_id: data.node_id,
        }).run(connection);
        node = await node.toArray();
        if (node[0]) return {
            code: 0,
            message: 'Node duplicated'
        };
    }
    if (data.data_id) {
        duuid = data.data_id;
    } else duuid = uuid.v4();
    var data = {
        node_id: data.node_id,
        time: new Date(),
        location: {
            lat: data.location.lat,
            lng: data.location.lng
        },
        phone: data.phone,
        data_id: duuid,
        status: 1
    };
    console.log('add node', data);
    let result = await r.db(dbName).table('nodeList').insert(data).run(connection);
    if (result) return {
        code: 1,
        message: 'Add node successful'
    }
    else return {
        code: 0,
        message: 'Add node failure'
    };
};

async function replaceNode(node_id_new, node_id_old) {
    var node_old = await getNodeInfoByID(node_id_old);
    var node = await getNodeInfoByID(node_id_new);
    if (node_old) {
        await changeNodeStatus(node_id_old, 0);
        if (node.status)
            await changeNodeStatus(node_id_new, 0);
        //
        let data = {
            node_id: node.node_id,
            phone: node.phone,
            location: {
                lat: node_old.location.lat,
                lng: node_old.location.lng
            },
            status: 1,
            data_id: node_old.data_id
        };
        let result = await addNode(data);
        if (result) return {
            code: 1,
            message: 'Replace node successful'
        }; else return{
          code:0,
          message: 'Replace node failure'
        }
    } else return {
        code: 0,
        message: 'Node not found'
    };
}

async function addNodeData(nodeData) {
    let node_info = await getNodeInfoByID(nodeData.node_id);
    var data = {
        data_id: node_info.data_id,
        time: new Date(),
        data: {
            co: nodeData.s1,
            temp: nodeData.s2,
            dust: nodeData.s3,
            gas: nodeData.s4,
            bat: nodeData.s5
        }
    }
    let result = await r.db(dbName).table('nodeData').insert(data).run(connection);
    if (result) return {
        code: 1,
        message: 'Add node data successful'
    }
    else return {
        code: 0,
        message: 'Add node data failure'
    };
}

async function updateNode(data) {
    var node = await getNodeInfoByID(data.node_id);
    if (node) {
        var sResult = await changeNodeStatus(data.node_id, 0);
        if (sResult) {
            data.data_id = node.data_id;
            console.log(data);
            var nNode = await addNode(data);
            if (nNode) return {
                code: 1,
                message: 'Update node successful'
            };
        } else return {
            code: 0,
            message: 'Update node failure'
        };
    }
    return {
        code: 0,
        message: 'Node not found'
    }
};

async function changeNodeStatus(node_id, status) {
    var result = await r.db(dbName).table('nodeList').filter({
        node_id: node_id
    }).update({
        status: status
    }).run(connection);
    if (result) {
        return {
            code: 1,
            message: 'Change node status node successful'
        };
    } else return {
        code: 0,
        message: 'Change node status node successful'
    };
}

async function getNodeInfoByID(node_id) {
    var connection = await connect();
    var node = await r.db(dbName).table('nodeList').filter({
        node_id: node_id,
        status: 1
    }).run(connection);
    node = await node.toArray();
    return node[0] || false;
}
async function getNodeList(status) {
    var connection = await connect();
    var node = await r.db(dbName).table('nodeList').filter({
        status: status
    }).run(connection);
    node = await node.toArray();
    return node || false;
}
async function getNodeByIDStatus(node_id, status) {
    // TODO get lastest node
    var connection = await connect();
    console.log('this is ID :', node_id);
    var node = await r.db(dbName).table('nodeList').filter({
        node_id: node_id,
        status: status
    }).run(connection);
    node = await node.toArray();
    return node[0] || false;
}
async function getNodeInfoByPhone(phone) {
    var connection = await connect();
    var node = await r.db(dbName).table('nodeList').filter({
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
    var data = await r.db(dbName).table('nodeData').filter({
        data_id: data_id
    }).orderBy('time').run(connection);
    data = await data.toArray();
    return data || false;
}

async function getRecordCount() {
    console.log('getRecordCount');
    var connection = await connect();
    console.log('getRecordCount 2');
    var data = await r.db(dbName).table('nodeData').group(
        [r.row('time').year(), r.row('time').month()]
    ).count().run(connection);
    console.log('getRecordCount 3');
    data = await data.toArray();
    return data || false;
}

async function getNodeCount() {
    var connection = await connect();
    console.log('getNodeCount');
    var node = await r.db(dbName).table('nodeList').filter({
        status: 1
    }).group(
        [r.row('time').year(), r.row('time').month()]
    ).count().run(connection);
    console.log('getNodeCount', node);
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
    getNodeList,
    getRecordCount,
    getNodeCount
};
