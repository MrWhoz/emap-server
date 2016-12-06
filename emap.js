var app = require('./app');
var config = require('./config');
var dbName = config.rethinkdb.db;
var debug = require('debug')('http'),
    http = require('http'),
    name = 'My App';
r = require('rethinkdb');
// PORT SETUP
var port = normalizePort(config.app.port || '8888');
app.set('port', port);
var server = http.createServer(app);
server.listen(port);

var io = require('socket.io')(server);
io.on('connection', function(socket) {
    console.log('new socketio connection');
});
server.on('listening', onListening);

function sendSocket() {

}

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    };
    if (port >= 0) {
        return port;
    }
    return false;
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe' + addr :
        'port' + addr.port;
    debug('Listening on ' + bind);
    console.log('Listening on ' + bind);
};
var connection = null;

r.connect({
    host: 'localhost',
    port: 28015
}, function(err, conn) {
    if (err) throw err;
    connection = conn;
    r.db(dbName).table('nodeData').filter({}).changes().run(connection).then(function(cursor) {
        cursor.each(function(err, item) {
            io.sockets.emit('rdata', item);
            console.log('update');
        });
    });
})
