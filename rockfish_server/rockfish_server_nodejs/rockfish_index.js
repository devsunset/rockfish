/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
/* filename : rockfish_index.js
/* author 	: devsunset (devsunset@gmail.com)
/* desc   	: rockfish middleware server index file
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

var cluster = require('cluster');
var rockfish_server = require('./rockfish_server');
var rockfish_router_handler = require('./rockfish_router_handler');
var config = require('config.json')('./rockfish_config.json');
var rockfish_logger = require('./rockfish_logger');
var numCPUs = require('os').cpus().length;

rockfish_server.rockfish_service_master_setting();

//■■■ cluster scheduling Round-Robin  [cluster.SCHED_NONE : OS ]
cluster.schedulingPolicy = cluster.SCHED_RR;

if (cluster.isMaster) {
	rockfish_logger.info('■■■■■■ ROCKFISH_SERVER_NODEJS MASTER worker [' + process.pid + '] started.');
	for (var i = 0; i < numCPUs; i++) {
	  cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {
	  rockfish_logger.info('■■■■■■ ROCKFISH_SERVER_NODEJS worker [' + worker.process.pid + '] died.');
	  cluster.fork();
	});
} else {
	rockfish_logger.info('■■■■■■ ROCKFISH_SERVER_NODEJS SLAVE worker [' + process.pid + '] started.');

	if(config.rockfish_http_https == "HTTP"){
		rockfish_server.rockfish_http_server_start(rockfish_router_handler.rockfish_router_handler);
	}else if(config.rockfish_http_https == "HTTPS"){
		rockfish_server.rockfish_https_server_start(rockfish_router_handler.rockfish_router_handler);
	}else{
		rockfish_server.rockfish_http_server_start(rockfish_router_handler.rockfish_router_handler);
		rockfish_server.rockfish_https_server_start(rockfish_router_handler.rockfish_router_handler);
	}
}