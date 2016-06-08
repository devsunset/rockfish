/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
/* filename : rockfish_logger.js
/* author   : devsunset (devsunset@gmail.com)
/* desc     : rockfish middleware server (logger)
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

//■■■ require winston(winston module)
var winston = require('winston');

//■■■ require moment(moment module)
var moment = require('moment');

//■■■ require config.json (config module)
var config = require('config.json')('./rockfish_config.json');

//■■■ rockfish logger
rockfish_logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            timestamp: function(){
              return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
            }
        }),
        new winston.transports.File({
            level: config.rockfish_file_log_level,
            filename: config.rockfish_file_log_path_file,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 10,
            colorize: false
        })
    ]
});

//■■■ exports rockfish_logger
module.exports = rockfish_logger;