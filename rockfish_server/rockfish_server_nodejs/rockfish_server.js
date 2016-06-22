/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
/* filename : rockfish_server.js
/* author 	: devsunset (devsunset@gmail.com)
/* desc   	: rockfish middleware server (http  server)
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

var http = require('http');
var https = require('https');
var fs = require('fs');
var config = require('config.json')('./rockfish_config.json');
var rockfish_logger = require('./rockfish_logger');

//■■■ http server start
function rockfish_http_server_start(rockfish_router_handler,servicemaster) {
  function onHttpRequest(request, response) {
    rockfish_router_handler(request, response, 'HTTP',servicemaster);
  }
  http.createServer(onHttpRequest).listen(config.rockfish_http_port);

  console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
  console.log('■■■ rockfish middleware server ■■■ http port number : ['+config.rockfish_http_port+']');
  console.log('■■■ rockfish middleware server ■■■ mongodb host : ['+config.rockfish_mongodb_host+']');
  console.log('■■■ rockfish middleware server ■■■ mongodb port : ['+config.rockfish_mongodb_port+']');
  console.log('■■■ rockfish middleware server ■■■ started.');
  console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');

  //rockfish_logger.info('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
  //rockfish_logger.info('■■■ rockfish middleware server ■■■ http port number : ['+config.rockfish_http_port+']');
  //rockfish_logger.info('■■■ rockfish middleware server ■■■ mongodb host : ['+config.rockfish_mongodb_host+']');
  //rockfish_logger.info('■■■ rockfish middleware server ■■■ mongodb port : ['+config.rockfish_mongodb_port+']');
  //rockfish_logger.info('■■■ rockfish middleware server ■■■ started.');
  //rockfish_logger.info('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
}

//■■■ https server start
function rockfish_https_server_start(rockfish_router_handler,servicemaster) {
  var options = {
	  key: fs.readFileSync('./cert/key.pem'),
	  cert: fs.readFileSync('./cert/cert.pem')
   };

  function onHttpsRequest(request, response) {
    rockfish_router_handler(request, response, 'HTTPS',servicemaster);
  }
  https.createServer(options, onHttpsRequest).listen(config.rockfish_https_port);

  console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
  console.log('■■■ rockfish middleware server ■■■ https port number : ['+config.rockfish_https_port+']');
  console.log('■■■ rockfish middleware server ■■■ mongodb host : ['+config.rockfish_mongodb_host+']');
  console.log('■■■ rockfish middleware server ■■■ mongodb port : ['+config.rockfish_mongodb_port+']');
  console.log('■■■ rockfish middleware server ■■■ started.');
  console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');

  //rockfish_logger.info('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
  //rockfish_logger.info('■■■ rockfish middleware server ■■■ https port number : ['+config.rockfish_https_port+']');
  //rockfish_logger.info('■■■ rockfish middleware server ■■■ mongodb host : ['+config.rockfish_mongodb_host+']');
  //rockfish_logger.info('■■■ rockfish middleware server ■■■ mongodb port : ['+config.rockfish_mongodb_port+']');
  //rockfish_logger.info('■■■ rockfish middleware server ■■■ started.');
  //rockfish_logger.info('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
}

exports.rockfish_http_server_start = rockfish_http_server_start;
exports.rockfish_https_server_start = rockfish_https_server_start;