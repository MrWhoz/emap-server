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
    let existmId = await getUserById(user.mail);
    if (existId) {
        return {
            code: -1,
            message: "Username existed",
            data: existId
        };
    };
    if (existmId) {
        return {
            code: -2,
            message: "Mail is used",
            data: existmId
        };
    };
    var data = {
        username: user.id,
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

async function update(user) {
    let connection = await connect();
    let existId = await getUserById(user.id);
    if (existId) {
        var update = await r.db(dbName).table('user').get(user.id).update({
            password: user.password,
            role: user.role,
            full_name: user.name,
            status: user.status,
            mail: user.mail,
        }).run(connection);
        return {
            code: 1,
            message: 'success',
            data: update
        }
    } else return {
        code: -1,
        message: "Account couldn't be found"
    }
};

async function login(user) {
    let connection = await connect();
    let existUser = await getUserById(user.id);
};

async function getUserById(id) {
    var connection = await connect();
    var user = await r.db(dbName).table("user").filter({
        username: id
    }).run(connection);
    user = await user.toArray();
    return user[0] || false;
};

async function getUserByMail(mail) {
    var connection = await connect();
    var user = await r.db(dbName).table("user").filter({
        'mail': mail
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
    getUserList,
    update
}
