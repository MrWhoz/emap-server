var r = require('rethinkdb');
var config = require('../config');
var dbName = config.rethinkdb.db;
var connection = null;

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
      message: "Username đã tồn tại, vui lòng chọn username khác",
      data: existId
    };
  };

  var data = {
    user_id: user.id,
    password: user.password,
    role: user.role,
    full_naem: user.name,
    created_time: new Date()
  };
}

async function getUserById(id) {
	var connection = await connect();
	var user = await r.db(dbName).table("user").filter({user_id:id}).run(connection);
  user = await user.toArray();
  return user[0] || false;
}

async function getUserList(status) {
    var connection = await connect();
    var user = await r.db(dbName).table("user").filter({
        status: status
    }).run(connection);
    user = await user.toArray();
    return user || false;
}

module.exports = {
	register,
  getUserById,
  getUserList
}
