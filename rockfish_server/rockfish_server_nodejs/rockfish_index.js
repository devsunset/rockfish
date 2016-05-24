/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
/* filename : rockfish_index.js
/* author 	: devsunset (devsunset@gmail.com)
/* desc   	: rockfish middleware server index file
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

//■■■ require http(http module)
var cluster = require('cluster');

//■■■ require rockfish_server(http server)
var rockfish_server = require('./rockfish_server');

//■■■ require rockfish_router(http request router and handler)
var rockfish_router_handler = require('./rockfish_router_handler');

//■■■ require config.json (config module)
var config = require('config.json')('./rockfish_config.json');

//■■■ require rofish_logger (logger module)
var rockfish_logger = require('./rockfish_logger');

//■■■ get cpu counter
var numCPUs = require('os').cpus().length;

//■■■ cluster scheduling Round-Robin  [cluster.SCHED_NONE : OS ]
cluster.schedulingPolicy = cluster.SCHED_RR;

if (cluster.isMaster) {		
	for (var i = 0; i < numCPUs; i++) {
	  cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {	  
	  rockfish_logger.info('ROCKFISH_SERVER_NODEJS worker [' + worker.process.pid + '] died.');
	  cluster.fork();
	});
} else {	
	rockfish_logger.info('ROCKFISH_SERVER_NODEJS worker [' + process.pid + '] started.');		

	if(config.rockfish_http_https == "HTTP"){
		//■■■ http server start		
		rockfish_server.rockfish_http_server_start(rockfish_router_handler.rockfish_router_handler);
	}else if(config.rockfish_http_https == "HTTPS"){
		//■■■ https server start		
		rockfish_server.rockfish_https_server_start(rockfish_router_handler.rockfish_router_handler);
	}else{		
		//■■■ http server start
		rockfish_server.rockfish_http_server_start(rockfish_router_handler.rockfish_router_handler);
		
		//■■■ https server start
		rockfish_server.rockfish_https_server_start(rockfish_router_handler.rockfish_router_handler);
	}		
}