var r = require('rethinkdb');
var config = require('../config');
var dbName = config.rethinkdb.db;
var connection = null;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

async function connect() {
    connection = await r.connect(config.rethinkdb);
    return connection;
};

async function register(user) {
    let connection = await connect();
    // Check if user exist
    let existId = await getUserById(user.id);
    if (existId) {
        return {
            code: -1,
            message: "Username existed",
            data: existId
        };
    };
    var data = {
        user_id: user.id,
        password: user.password,
        role: user.role,
        full_name: user.name,
        status: user.status,
        mail: user.mail,
        created_time: new Date()
    };
    console.log('Add user function', data);
    let result = await r.db(dbName).table("user").insert(data).run(connection);
    if (result) return {
        code: 1,
        message: "Account created successful",
        data: result
    };
};

async function login(user) {
    let connection = await connect();
    let existUser = await getUserById(user.id);
};

async function getUserById(id) {
    var connection = await connect();
    var user = await r.db(dbName).table("user").filter({
        user_id: id
    }).run(connection);
    user = await user.toArray();
    return user[0] || false;
};

async function getUserList(status) {
    var connection = await connect();
    var user = await r.db(dbName).table("user").filter({
        status: status
    }).run(connection);
    user = await user.toArray();
    return user || false;
};

module.exports = {
    register,
    getUserById,
    getUserList
}
