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

var monk = require('monk');
var db = monk(config.rockfish_mongodb_username+':'+config.rockfish_mongodb_password+'@localhost:27017/rockfish');
var collection = db.get('rockfish_service_master');

var SERVICE_MST = null;

//■■■ http server start
function rockfish_http_server_start(rockfish_router_handler) {
  function onHttpRequest(request, response) {
    rockfish_router_handler(request, response, 'HTTP',SERVICE_MST);
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
function rockfish_https_server_start(rockfish_router_handler) {
  var options = {
	  key: fs.readFileSync('./cert/key.pem'),
	  cert: fs.readFileSync('./cert/cert.pem')
   };

  function onHttpsRequest(request, response) {
    rockfish_router_handler(request, response, 'HTTPS',SERVICE_MST);
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

//■■■ rockfish service master setting
function rockfish_service_master_setting() {
  collection.find({SERVICE_STATUS: 'Y'},"SERVICE_APP SERVICE SERVICE_URL SERVICE_TYPE SERVICE_PROTOCOL SERVICE_METHOD SERVICE_LOGIN_CHECK", function(err, servicemaster) {
        SERVICE_MST = servicemaster;
  });

  // Lazy change data  15 Secend apply
  setInterval(function() {
    collection.find({SERVICE_STATUS: 'Y'},"SERVICE_APP SERVICE SERVICE_URL SERVICE_TYPE SERVICE_PROTOCOL SERVICE_METHOD SERVICE_LOGIN_CHECK", function(err, servicemaster) {
        SERVICE_MST = servicemaster;
    });
  }, config.rockfish_service_master_change_apply_time);
}
exports.rockfish_service_master_setting = rockfish_service_master_setting;
exports.rockfish_http_server_start = rockfish_http_server_start;
exports.rockfish_https_server_start = rockfish_https_server_start;


