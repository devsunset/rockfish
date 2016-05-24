/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
/* filename : rockfish_server.js
/* author 	: devsunset (devsunset@gmail.com)
/* desc   	: rockfish middleware server (http  server)
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

//■■■ require http(http module)
var http = require('http');

//■■■ require config.json (config module)
var https = require('https');

//■■■ require config.json (config module)
var fs = require('fs');

//■■■ require config.json (config module)
var config = require('config.json')('./rockfish_config.json');

//■■■ require rofish_logger (logger module)
var rockfish_logger = require('./rockfish_logger');

//■■■ http server start
function rockfish_http_server_start(rockfish_router_handler) {
  // http process
  function onHttpRequest(request, response) {
    rockfish_router_handler(request, response, 'HTTP');
  }
  http.createServer(onHttpRequest).listen(config.rockfish_http_port);

  rockfish_logger.info('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
  rockfish_logger.info('■■■ rockfish middleware server ■■■ http port number : ['+config.rockfish_http_port+']');
  rockfish_logger.info('■■■ rockfish middleware server ■■■ mongodb host : ['+config.rockfish_mongodb_host+']');
  rockfish_logger.info('■■■ rockfish middleware server ■■■ mongodb port : ['+config.rockfish_mongodb_port+']');
  rockfish_logger.info('■■■ rockfish middleware server ■■■ started.');
  rockfish_logger.info('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
}

//■■■ https server start
function rockfish_https_server_start(rockfish_router_handler) {
  var options = {
	  key: fs.readFileSync('./cert/key.pem'),
	  cert: fs.readFileSync('./cert/cert.pem')
   };

  // https process
  function onHttpsRequest(request, response) {    
    rockfish_router_handler(request, response, 'HTTPS');
  }
  https.createServer(options, onHttpsRequest).listen(config.rockfish_https_port);

  rockfish_logger.info('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
  rockfish_logger.info('■■■ rockfish middleware server ■■■ https port number : ['+config.rockfish_https_port+']');
  rockfish_logger.info('■■■ rockfish middleware server ■■■ mongodb host : ['+config.rockfish_mongodb_host+']');
  rockfish_logger.info('■■■ rockfish middleware server ■■■ mongodb port : ['+config.rockfish_mongodb_port+']');
  rockfish_logger.info('■■■ rockfish middleware server ■■■ started.');
  rockfish_logger.info('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
}

//■■■ exports rockfish_http_server_start
exports.rockfish_http_server_start = rockfish_http_server_start;

//■■■ exports rockfish_https_server_start
exports.rockfish_https_server_start = rockfish_https_server_start;