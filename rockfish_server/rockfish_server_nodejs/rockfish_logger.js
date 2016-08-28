/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
/* filename : rockfish_logger.js
/* author   : devsunset (devsunset@gmail.com)
/* desc     : rockfish middleware server (logger)
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

var winston = require('winston');
var moment = require('moment');
var config = require('config.json')('./rockfish_config.json');

rockfish_logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            timestamp: function(){
              return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
            }
        }),
        new winston.transports.File({
            level: config.rockfish_server_log_level,
            filename: config.rockfish_server_log_path_file,
            handleExceptions: true,
            json: true,
            maxsize: config.rockfish_server_log_maxsize,
            maxFiles: config.rockfish_server_log_maxfiles,
            colorize: false,
            timestamp: function(){
              return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
            }
        })
    ]
});

module.exports = rockfish_logger;