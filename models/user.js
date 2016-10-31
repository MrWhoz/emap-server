var r = require('rethinkdb');
var config = require('../config');
var dbName = config.rethinkdb.db;
var connection = null;

async function connect() {
    connection = await r.connect(config.rethinkdb);
    return connection;
};
