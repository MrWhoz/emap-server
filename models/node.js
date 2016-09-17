var r = require('rethinkdb');
var config = require('../config');
var dbName = config.rethinkdb.db;
var connection = null;

function connect() {
    r.connect(config.rethinkdb, function(err, conn) {
        if (err) throw err;
        connection = conn;
        console.log('connected');
    });
    return connection;
};

function addNodeData(nodeData) {

    r.table('authors').filter(r.row("name").eq("Jean-Luc Picard")).
    update({
        posts: r.row("posts").append({
            title: "Shakespeare",
            content: "What a piece of work is man..."
        })
    }).run(connection, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    });
    r.db(dbName).table('nodeData').insert([{
        name: "William Adama",
        tv_show: "Battlestar Galactica",
        posts: [{
            title: "Decommissioning speech",
            content: "The Cylon War is long over..."
        }, {
            title: "We are at war",
            content: "Moments ago, this ship received word..."
        }, {
            title: "The new Earth",
            content: "The discoveries of the past few days..."
        }]
    }, {
        name: "Laura Roslin",
        tv_show: "Battlestar Galactica",
        posts: [{
            title: "The oath of office",
            content: "I, Laura Roslin, ..."
        }, {
            title: "They look like us",
            content: "The Cylons have the ability..."
        }]
    }, {
        name: "Jean-Luc Picard",
        tv_show: "Star Trek TNG",
        posts: [{
            title: "Civil rights",
            content: "There are some words I've known since..."
        }]
    }]).run(connection, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    });
}

async function getNodeNodeId(id) {
   var connection = await connect();
    var node = await r.db(dbName).table("nodeList").filter({
        nodeId: id
    }).run(connection);
    node = await node.toArray();
    await console.log(node[0]);
    return node[0] || false;
}

module.exports = {
    connect,
    addNodeData,
    getNodeNodeId
};
