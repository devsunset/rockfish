/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
/* filename : rockfish_router_handler.js
/* author 	: devsunset (devsunset@gmail.com)
/* desc   	: rockfish middleware server (http  router handler)
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

//■■■ require url(querystring module)
var qs = require('querystring');

//■■■ require url(url module)
var url = require('url');

//■■■ require url(request module)
var requestServiceCall = require('request');

//■■■ require url(formidable module)
var formidable = require('formidable');

//■■■ require config.json (config module)
var config = require('config.json')('./rockfish_config.json');

//■■■ require url(mongo db module)
var monk = require('monk');
var db = monk(config.rockfish_mongodb_host+':'+config.rockfish_mongodb_port+'/rockfish');
var collection = db.get('rockfish_service_log');

/*
	var db = monk('rockfish:rockfish@localhost:27017/rockfish');
	var db = monk('localhost:27017/rockfish', {
	  username : 'rockfish',
	  password : 'rockfish'
	});
*/

//■■■ require url(file module)
var fs = require('fs');

//■■■ require rofish_logger (logger module)
var rockfish_logger = require('./rockfish_logger');

//■■■ require constants (constants module)
var constants = require('constants');

//■■■ require crypto (crypto module)
var crypto = require('crypto');

//■■■ require fs (fs module)
var fs = require('fs');

//■■■ rsa private & public key
var privateKey = fs.readFileSync('./cert/privkey.pem', 'utf8');
var publicKey  = fs.readFileSync('./cert/pubkey.pem', 'utf8');

//■■■ https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
/*
	1 Informational 1xx
	2 Successful 2xx
	3 Redirection 3xx
	4 Client Error 4xx
	5 Server Error 5xx
*/
//■■■ [Status Code Definitions]
var statusMap = {};
statusMap[100] = 'Continue';
statusMap[200] = 'OK';
statusMap[201] = 'Created';
statusMap[202] = 'Accepted';
statusMap[203] = 'Non-Authoritative Information';
statusMap[204] = 'No Content';
statusMap[205] = 'Reset Content';
statusMap[206] = 'Partial Content';
statusMap[300] = 'Multiple Choices';
statusMap[301] = 'Moved Permanently';
statusMap[302] = 'Found';
statusMap[303] = 'See Other';
statusMap[304] = 'Not Modified';
statusMap[305] = 'Use Proxy';
statusMap[306] = '(Unused)';
statusMap[307] = 'Temporary Redirect';
statusMap[400] = 'Bad Request';
statusMap[401] = 'Unauthorized';
statusMap[402] = 'Payment Required';
statusMap[403] = 'Forbidden';
statusMap[404] = 'Not Found';
statusMap[405] = 'Method Not Allowed';
statusMap[406] = 'Not Acceptable';
statusMap[407] = 'Proxy Authentication Required';
statusMap[408] = 'Request Timeout';
statusMap[409] = 'Conflict';
statusMap[410] = 'Gone';
statusMap[411] = 'Length Required';
statusMap[412] = 'Precondition Failed';
statusMap[413] = 'Request Entity Too Large';
statusMap[414] = 'Request-URI Too Long';
statusMap[415] = 'Unsupported Media Type';
statusMap[416] = 'Requested Range Not Satisfiable';
statusMap[417] = 'Expectation Failed';
statusMap[500] = 'Internal Server Error';
statusMap[501] = 'Not Implemented';
statusMap[502] = 'Bad Gateway';
statusMap[503] = 'Service Unavailable';
statusMap[504] = 'Gateway Timeout';
statusMap[505] = 'HTTP Version Not Supported';

//■■■ set header to handle the CORS
var headers = {};
headers['Access-Control-Allow-Origin'] = '*';
var access_control_allow_headers =  'Content-Type';
	access_control_allow_headers += ',Content-Length';
	access_control_allow_headers += ',Authorization';
	access_control_allow_headers += ',Accept';
	access_control_allow_headers += ',X-Requested-With';
	access_control_allow_headers += ',X-Forwarded-For';
	access_control_allow_headers += ',rockfish_access_id';
	access_control_allow_headers += ',rockfish_ip';
	access_control_allow_headers += ',rockfish_mac';
	access_control_allow_headers += ',rockfish_phone';
	access_control_allow_headers += ',rockfish_os';
	access_control_allow_headers += ',rockfish_os_version';
	access_control_allow_headers += ',rockfish_os_version_desc';
	access_control_allow_headers += ',rockfish_target_service';
	access_control_allow_headers += ',rockfish_client_app';
	access_control_allow_headers += ',rockfish_client_app_version';
	access_control_allow_headers += ',rockfish_multipart';
	access_control_allow_headers += ',rockfish_encrypt_parameter';
headers['Access-Control-Allow-Headers'] = access_control_allow_headers;
headers['Access-Contrl-Allow-Methods'] = 'POST,OPTIONS';
headers['Access-Control-Max-Age'] = '86400';
headers['Content-Type'] = 'application/json; charset=utf8';

//■■■ http router and handler
function rockfish_router_handler(request, response, serviceMethod) {
  // Process
  dynamicExecute(function(drequest, dresponse, dserviceMethod){

	// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
	// TO-DO : session create  & auth check
	// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

	try{

		if(drequest.method == 'OPTIONS') {
				var resultObj = {
					 ROCKFISH_RESULT_CODE : 'S'
					,ROCKFISH_RESULT_MESSAGE : '[SKIP] [rockfish] set header to handle the CORS.'
					,ROCKFISH_HTTP_STATUS_CODE : 200
					,ROCKFISH_HTTP_STATUS_MESSAGE : '[SKIP] [rockfish] set header to handle the CORS.'
				};

				dresponse.writeHead(200, headers);
				dresponse.write(JSON.stringify(resultObj));
				dresponse.end();
		}else{

			var url_partsCheck = url.parse(drequest.url,true);

			if(url_partsCheck.pathname === config.rockfish_http_path){
				var access = {
					 ROCKFISH_ACCESS_ID : decryptStringWithRsaPrivateKey(drequest.headers.rockfish_access_id)
					,ROCKFISH_IP : decryptStringWithRsaPrivateKey(drequest.headers.rockfish_ip)
					,ROCKFISH_MAC : decryptStringWithRsaPrivateKey(drequest.headers.rockfish_mac)
					,ROCKFISH_PHONE : decryptStringWithRsaPrivateKey(drequest.headers.rockfish_phone)
					,ROCKFISH_OS : decryptStringWithRsaPrivateKey(drequest.headers.rockfish_os)
					,ROCKFISH_OS_VERSION : decryptStringWithRsaPrivateKey(drequest.headers.rockfish_os_version)
					,ROCKFISH_OS_VERSION_DESC : decryptStringWithRsaPrivateKey(drequest.headers.rockfish_os_version_desc)
					,ROCKFISH_TARGET_SERVICE : decryptStringWithRsaPrivateKey(drequest.headers.rockfish_target_service)
					,ROCKFISH_CLIENT_APP : decryptStringWithRsaPrivateKey(drequest.headers.rockfish_client_app)
					,ROCKFISH_CLIENT_APP_VERSION : decryptStringWithRsaPrivateKey(drequest.headers.rockfish_client_app_version)
					,ROCKFISH_MULTIPART : decryptStringWithRsaPrivateKey(drequest.headers.rockfish_multipart)
					,ROCKFISH_ENCRYPT_PARAMETER : decryptStringWithRsaPrivateKey(drequest.headers.rockfish_encrypt_parameter)
				};

				collection.insert({
			    	 'ACCESS' : access
			    	,'REQUEST' : ''
			    	,'RESPONSE' : ''
			    	,'SERVICE_METHOD' : dserviceMethod
			    	,'TARGET_SERVICE' : decryptStringWithRsaPrivateKey(drequest.headers.rockfish_target_service)
			    	,'REQUEST_TIME' : new Date()
			    	,'RESPONSE_TIME' : ''
			   	}, function(err, rockfishLog){
			   		if (err) rockfish_logger.error(err);

			   		// REQUEST METHOD
					if(drequest.method == 'POST') {

						// General Send
						if("G" == decryptStringWithRsaPrivateKey(drequest.headers.rockfish_multipart)){
							var reqbody='';

				            drequest.on('data', function (data) {
				                reqbody += data;
				            });
				            drequest.on('end',function(){
			            			var POST =  qs.parse(reqbody);
					                var url_parts = url.parse(drequest.url,true);

					                if(POST ==='' || POST === null){
					                	POST = {};
					                	POST = jsonConcat(POST, url_parts.query);
					                }else{
					                	POST = jsonConcat(POST, url_parts.query);
					                }

					                var encryptParameterArray = decryptStringWithRsaPrivateKey(drequest.headers.rockfish_encrypt_parameter).split('|^|');

									if(encryptParameterArray !==null && encryptParameterArray !=='' && encryptParameterArray.length > 0){
					                	for(key in POST) {
						                	if(inArray(key,encryptParameterArray)){
						                		if( Object.prototype.toString.call( POST[key] ) === '[object Array]' ) {
						                			for(var x=0;x < POST[key].length;x++){
						                				POST[key][x] = decryptStringWithRsaPrivateKey(POST[key][x]);
						                			}
						                		}else{
						                			POST[key] = decryptStringWithRsaPrivateKey(POST[key]);
						                		}
						                	}
										}
					                }

					                if(config.rockfish_request_logging_use == 'Y'){
										collection.update({
								        _id: rockfishLog._id
									    },{$set : {'REQUEST' : POST}}, function(err, rockfishRequest){
									        if (err) rockfish_logger.error(err);
									    });
									}

									var access_ip = drequest.headers['X-Forwarded-For'] || drequest.connection.remoteAddress;

					                // target service call
									requestServiceCall({
											url: config.rockfish_target_service_http_url, //URL
											method: 'POST',
											headers: {
												 'ROCKFISH_SERVER': 'ROCKFISH-NODEJS'
												,'ROCKFISH_ACCESS_INFO' : JSON.stringify(access)
												,'ROCKFISH_ACCESS_IP': access_ip
												,'Content-Type': 'application/json; charset=utf-8'
												,'Content-Length': POST.length
												,'Cache-Control' : 'max-age=0'
											},
											encoding:'utf8',
											form: POST
										 }
										, function (error, sresponse, body) {
										// response
										if (!error){
											if(sresponse.statusCode >= 200 && sresponse.statusCode < 400 ){
												var resultObj = {
													 ROCKFISH_RESULT_CODE : 'S'
													,ROCKFISH_RESULT_MESSAGE : statusMap[sresponse.statusCode]
													,ROCKFISH_HTTP_STATUS_CODE : sresponse.statusCode
													,ROCKFISH_HTTP_STATUS_MESSAGE : statusMap[sresponse.statusCode]
												};

												if(config.rockfish_response_logging_use !== 'Y'){
													collection.update({
												        _id: rockfishLog._id
												    },{$set : {'RESPONSE' : resultObj,'RESPONSE_TIME' : new Date()}}, function(err, rockfishResponse){
												        if (err) rockfish_logger.error(err);
												    });
											    }

												resultObj.ROCKFISH_RESULT_JSON = body;

												if(config.rockfish_response_logging_use == 'Y'){
													collection.update({
												        _id: rockfishLog._id
												    },{$set : {'RESPONSE' : resultObj,'RESPONSE_TIME' : new Date()}}, function(err, rockfishResponse){
												        if (err) rockfish_logger.error(err);
												    });
											    }

												dresponse.writeHead(sresponse.statusCode, headers);
												dresponse.write(JSON.stringify(resultObj));
												dresponse.end();
											}else{
												var resultObj = {
													 ROCKFISH_RESULT_CODE : 'E'
													,ROCKFISH_RESULT_MESSAGE : statusMap[sresponse.statusCode]
													,ROCKFISH_HTTP_STATUS_CODE : sresponse.statusCode
													,ROCKFISH_HTTP_STATUS_MESSAGE : statusMap[sresponse.statusCode]
												};

												collection.update({
										        _id: rockfishLog._id
											    },{$set : {'RESPONSE' : resultObj,'RESPONSE_TIME' : new Date()}}, function(err, rockfishResponse){
											        if (err) rockfish_logger.error(err);
											    });

												dresponse.writeHead(sresponse.statusCode, headers);
												dresponse.write(JSON.stringify(resultObj));
												dresponse.end();
											}
										}else{
											error.ROCKFISH_RESULT_CODE = 'E';
											error.ROCKFISH_RESULT_MESSAGE = '[rockfish] target service process error';
											error.ROCKFISH_HTTP_STATUS_CODE = 500;
											error.ROCKFISH_HTTP_STATUS_MESSAGE = 'Internal Server Error';

											collection.update({
									        _id: rockfishLog._id
										    },{$set : {'RESPONSE' : error,'RESPONSE_TIME' : new Date()}}, function(err, rockfishResponse){
										        if (err) rockfish_logger.error(err);
										    });

											dresponse.writeHead(500, headers);
											dresponse.write(JSON.stringify(error));
											dresponse.end();
										}
									});
				            });
						}else{ // Multipart Send

							var form = new formidable.IncomingForm();
							var fields = [];
						    var files = [];

						    form.multiples = true;
						    form.keepExtensions = true;
						    form.uploadDir = config.rockfish_file_upload_temp_path;
						    form.maxFieldsSize = parseInt(config.rockfish_file_upload_max_field_size) * 1024 * 1024;
						    var limitTotalFilesSize = parseInt(config.rockfish_file_upload_limit_total_files_size) * 1024 * 1024;


						    var allowFileType = config.rockfish_file_upload_allow_file_type;
						    var allowFileTypeArray = null;

						    if(allowFileType != '*'){
						    	allowFileTypeArray = allowFileType.toLowerCase().split(",");
						    }

						    form
						      .on('field', function(field, value) {
						        fields.push([field, value]);
						      })
						      .on('file', function(field, file) {
						        files.push([field, file]);
						      })
						      .on('fileBegin', function(name,file) {


						      	   if(allowFileTypeArray !== null && allowFileTypeArray.length > 0){

						      	   		if(!(inArray(getFileType(file.name),allowFileTypeArray))){
						      	   			//throw new Error('Not allow Upload File type');

							      	   		//////////////////////////////////////////////////////////////////////
							      	   		var resultObj = {
												 ROCKFISH_RESULT_CODE : 'E'
												,ROCKFISH_RESULT_MESSAGE : '[rockfish] Not allow Upload File type.'
												,ROCKFISH_HTTP_STATUS_CODE : 500
												,ROCKFISH_HTTP_STATUS_MESSAGE : 'Internal Server Error'
											};

											collection.update({
									        _id: rockfishLog._id
										    },{$set : {'RESPONSE' : resultObj,'RESPONSE_TIME' : new Date()}}, function(err, rockfishResponse){
										        if (err) rockfish_logger.error(err);
										    });

											dresponse.writeHead(500, headers);
											dresponse.write(JSON.stringify(resultObj));
											dresponse.end();
											//////////////////////////////////////////////////////////////////////

											//TO-DO Temp File Delete
						      	   		}
						      	   }

						      	   if(limitTotalFilesSize < form.bytesExpected){
						      	   		//throw new Error('Upload File Size Limit');

						      	   		//////////////////////////////////////////////////////////////////////
						      	   		var resultObj = {
											 ROCKFISH_RESULT_CODE : 'E'
											,ROCKFISH_RESULT_MESSAGE : '[rockfish] Upload File Size Limit.'
											,ROCKFISH_HTTP_STATUS_CODE : 500
											,ROCKFISH_HTTP_STATUS_MESSAGE : 'Internal Server Error'
										};

										collection.update({
								        _id: rockfishLog._id
									    },{$set : {'RESPONSE' : resultObj,'RESPONSE_TIME' : new Date()}}, function(err, rockfishResponse){
									        if (err) rockfish_logger.error(err);
									    });

										dresponse.writeHead(500, headers);
										dresponse.write(JSON.stringify(resultObj));
										dresponse.end();
										//////////////////////////////////////////////////////////////////////

										//TO-DO Temp File Delete
						      	   }
							  })
						      .on('end', function() {

						      	var encryptParameterArray = decryptStringWithRsaPrivateKey(drequest.headers.rockfish_encrypt_parameter).split('|^|');

								if(encryptParameterArray !==null && encryptParameterArray !=='' && encryptParameterArray.length > 0){
									if(fields !=null && fields != undefined && fields.length > 0){
										for(var fix = 0;fix < fields.length;fix++){
											if(inArray(fields[fix][0],encryptParameterArray)){
						                		fields[fix][1] = decryptStringWithRsaPrivateKey(fields[fix][1]);
					                		}
										}
									}
				                }

								if(config.rockfish_request_logging_use == 'Y'){
									collection.update({
							        _id: rockfishLog._id
								    },{$set : {'REQUEST' : JSON.stringify(fields) }}, function(err, rockfishRequest){
								        if (err) rockfish_logger.error(err);
								    });
								}

								var access_ip = drequest.headers['X-Forwarded-For'] || drequest.connection.remoteAddress;

								// target service call
								var reqMulti = requestServiceCall({
										url: config.rockfish_target_service_http_url_multipart, //URL
										method: 'POST',
										headers: {
											 'ROCKFISH_SERVER': 'ROCKFISH-NODEJS'
											,'ROCKFISH_ACCESS_INFO' : JSON.stringify(access)
											,'ROCKFISH_ACCESS_IP': access_ip
											,'Content-Type': false
											,'Cache-Control' : 'max-age=0'
										}
									 }
									, function (error, sresponse, body) {
									// response
									if (!error){
										if(sresponse.statusCode >= 200 && sresponse.statusCode < 400 ){
											var resultObj = {
												 ROCKFISH_RESULT_CODE : 'S'
												,ROCKFISH_RESULT_MESSAGE : statusMap[sresponse.statusCode]
												,ROCKFISH_HTTP_STATUS_CODE : sresponse.statusCode
												,ROCKFISH_HTTP_STATUS_MESSAGE : statusMap[sresponse.statusCode]
											};

											if(config.rockfish_response_logging_use !== 'Y'){
												collection.update({
											        _id: rockfishLog._id
											    },{$set : {'RESPONSE' : resultObj,'RESPONSE_TIME' : new Date()}}, function(err, rockfishResponse){
											        if (err) rockfish_logger.error(err);
											    });
										    }

											resultObj.ROCKFISH_RESULT_JSON = body;

											if(config.rockfish_response_logging_use == 'Y'){
												collection.update({
											        _id: rockfishLog._id
											    },{$set : {'RESPONSE' : resultObj,'RESPONSE_TIME' : new Date()}}, function(err, rockfishResponse){
											        if (err) rockfish_logger.error(err);
											    });
										    }

											dresponse.writeHead(sresponse.statusCode, headers);
											dresponse.write(JSON.stringify(resultObj));
											dresponse.end();
										}else{
											var resultObj = {
												 ROCKFISH_RESULT_CODE : 'E'
												,ROCKFISH_RESULT_MESSAGE : statusMap[sresponse.statusCode]
												,ROCKFISH_HTTP_STATUS_CODE : sresponse.statusCode
												,ROCKFISH_HTTP_STATUS_MESSAGE : statusMap[sresponse.statusCode]
											};

											collection.update({
									        _id: rockfishLog._id
										    },{$set : {'RESPONSE' : resultObj,'RESPONSE_TIME' : new Date()}}, function(err, rockfishResponse){
										        if (err) rockfish_logger.error(err);
										    });

											dresponse.writeHead(sresponse.statusCode, headers);
											dresponse.write(JSON.stringify(resultObj));
											dresponse.end();
										}
									}else{
										error.ROCKFISH_RESULT_CODE = 'E';
										error.ROCKFISH_RESULT_MESSAGE = '[rockfish] target service process error';
										error.ROCKFISH_HTTP_STATUS_CODE = 500;
										error.ROCKFISH_HTTP_STATUS_MESSAGE = 'Internal Server Error';

										collection.update({
								        _id: rockfishLog._id
									    },{$set : {'RESPONSE' : error,'RESPONSE_TIME' : new Date()}}, function(err, rockfishResponse){
									        if (err) rockfish_logger.error(err);
									    });

										dresponse.writeHead(500, headers);
										dresponse.write(JSON.stringify(error));
										dresponse.end();
									}

									if(files !=null && files != undefined && files.length > 0){
										for(var fix = 0;fix < files.length;fix++){
											fs.unlink((files[fix][1]).path, function (err) {
											  if (err)  rockfish_logger.error('upload temp file delete Exception : '+err);
											});
										}
									}
								});

								var form = reqMulti.form();
								// Field Append
								if(fields !=null && fields != undefined && fields.length > 0){
									for(var fix = 0;fix < fields.length;fix++){
										form.append(fields[fix][0], fields[fix][1]);
									}
								}

								// File Append
								if(files !=null && files != undefined && files.length > 0){
									for(var fix = 0;fix < files.length;fix++){
										try {
										      form.append(files[fix][0], fs.createReadStream((files[fix][1]).path), {
											  filename: (files[fix][1]).name,
											  contentType: (files[fix][1]).type
											});
										}catch(err) {
										    rockfish_logger.error('upload file read Exception : '+err);
										}
									}
								}

						      });
						    form.parse(drequest);
						}
				    }else{
						var resultObj = {
							 ROCKFISH_RESULT_CODE : 'E'
							,ROCKFISH_RESULT_MESSAGE : '[rockfish] Only support mehtod is post.'
							,ROCKFISH_HTTP_STATUS_CODE : 405
							,ROCKFISH_HTTP_STATUS_MESSAGE : 'Method Not Allowed'
						};

						collection.update({
				        _id: rockfishLog._id
					    },{$set : {'RESPONSE' : resultObj,'RESPONSE_TIME' : new Date()}}, function(err, rockfishResponse){
					        if (err) rockfish_logger.error(err);
					    });

						dresponse.writeHead(405, headers);
						dresponse.write(JSON.stringify(resultObj));
						dresponse.end();
					}
			    });
			}else{
				var resultObj = {
					 ROCKFISH_RESULT_CODE : 'E'
					,ROCKFISH_RESULT_MESSAGE : '[rockfish] Service is not found.'
					,ROCKFISH_HTTP_STATUS_CODE : 404
					,ROCKFISH_HTTP_STATUS_MESSAGE : 'Not Found'
				};

				dresponse.writeHead(200, headers);
				dresponse.write(resultObj);
				dresponse.end();
			}
		}
	}catch(exception){
  		rockfish_logger.error('dynamicExecute Exception : '+exception);
  	}

  }, request, response, serviceMethod); // end of dynamicExecute(function(drequest, dresponse, dserviceMethod){

} // end of function rockfish_router_handler(request, response, serviceMethod) {

//■■■ json object concat
function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}

//■■■ array contains
function inArray(needle, haystack) {
	var length = haystack.length;
	for(var i = 0; i < length; i++) {
	    if(haystack[i] == needle){
	        return true;
	    }
	}
	return false;
}

//■■■ rsa encrypt
function encryptStringWithRsaPublicKey(toEncrypt) {
   try{
	 if(toEncrypt === null || toEncrypt === '' || toEncrypt === undefined){
	  	  return '';
	  }else{
		  var buffer = new Buffer(toEncrypt);
		  var encrypted = crypto.publicEncrypt({'key':publicKey,padding:constants.RSA_PKCS1_PADDING}, buffer);
		  return encrypted.toString('base64');
	  }
  }catch(exception){
  	rockfish_logger.error('encryptStringWithRsaPublicKey Exception : '+exception);
  }
};

//■■■ rsa decrypt
function decryptStringWithRsaPrivateKey(toDecrypt) {
  try{
	 if(toDecrypt === null || toDecrypt === '' || toDecrypt === undefined){
	  	 return '';
	  }else{
		 var buffer = new Buffer(toDecrypt, 'base64');
	  	 var decrypted = crypto.privateDecrypt({'key':privateKey,padding:constants.RSA_PKCS1_PADDING}, buffer);
	  	 return decrypted.toString('utf8');
	  }
  }catch(exception){
  	rockfish_logger.error('decryptStringWithRsaPrivateKey Exception : '+exception);
  }
};

//■■■ get file extension
function getFileType(filePath){
	var index = -1;
		index = filePath.lastIndexOf('.');

	var type = "";

	if(index != -1){
		type = filePath.substring(index+1, filePath.len).toLowerCase();
	}else {
		type = "";
	}
	return type;
}

//■■■ dynamic template function call (Non-Blocking process)
function dynamicExecute(dynmaicFunction, request, response, serviceMethod) {
  dynmaicFunction(request, response, serviceMethod);
}

//■■■ exports rockfish_router_handler
exports.rockfish_router_handler = rockfish_router_handler;