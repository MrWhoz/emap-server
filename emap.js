var app = require('./app');
var config = require('./config')
var debug = require('debug')('http')
  , http = require('http')
  , name = 'My App';


var port = normalizePort(config.app.port || '8888');
app.set('port',port);
var server = http.createServer(app);
server.listen(port);
//server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val){
  var port = parseInt(val,10);

  if(isNaN(port)){
    return val;
  };
  if(port >= 0){
    return port;
  }
  return false;
}

function onListening(){
  var addr = server.address();
  var bind = typeof addr === 'string' ?
  'pipe' + addr:
  'port' + addr.port;
  debug('Listening on ' + bind);
}
