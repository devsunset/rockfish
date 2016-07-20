//############################################################################################
//  INIT 
//############################################################################################
var express = require('express');
var router = express.Router();

var fs = require('fs');
var constants = require('constants');
var crypto = require('crypto');
var privateKey = fs.readFileSync('./cert/privkey.pem', 'utf8');
var publicKey  = fs.readFileSync('./cert/pubkey.pem', 'utf8');

var monk = require('monk');
var db = monk('rockfish:rockfish@localhost:27017/rockfish');

var ALGORITHM = 'aes-256-ctr';
var PASSWORD = 'rockfish';

var RESULT_SUCCESS_CODE = 'S';
var RESULT_FAIL_CODE = 'E';
var RESULT_SETTION_INVALID_CODE = 'X';
var SERVER_ERROR = 'SERVER PROCESS ERROR';

//############################################################################################
// LOGIN ,LOGOUT , SESSION CHECK PROCESS
//############################################################################################

// session check process
router.post('/sessionCheck', function(req, res, next) {
	var resData = new Object();
	if(req.session.user_id !== null && req.session.user_id !== undefined 
		&& req.session.user_id !== ""){
		 resData.rockfish_result_code = RESULT_SUCCESS_CODE;
		 var sessionData = new Object();
		 sessionData.user_id =  req.session.user_id;
		 sessionData.user_name =  req.session.user_name;
		 resData.rockfish_result_data = sessionData;
		 res.json(resData);
	}else{
		resData.rockfish_result_code = RESULT_FAIL_CODE;
		res.json(resData);
	}
});

// login process
router.post('/login', function(req, res, next) {
	var resData = new Object();	
	var params = getParams(req);
	if(params.ID !== undefined && params.ID.trim() !=="" 
		&& params.PASSWORD !== undefined && params.PASSWORD.trim() !==""  ){
		var collection = db.get('rockfish_admin_master'); 
	    collection.find({ID : decryptStringWithRsaPrivateKey(params.ID)
	    	,PASSWORD : encryptAesHex(decryptStringWithRsaPrivateKey(params.PASSWORD)),STATUS : 'Y'}
	    	,"ID NAME", function(err, data){
	        if (err){		 
	        	console.error(SERVER_ERROR, err.stack);   
	        	resData.rockfish_result_code = RESULT_FAIL_CODE;
				resData.rockfish_result_msg = err;
				res.json(resData);
	        }else{	
	        	if(data !== null && data.length > 0 && data[0].ID !== undefined 
	        		&& data[0].ID == decryptStringWithRsaPrivateKey(params.ID)){
	        		// session create
					req.session.user_id = data[0].ID,     // ID
					req.session.user_name = data[0].NAME, // NAME

			        resData.rockfish_result_code = RESULT_SUCCESS_CODE;
					resData.rockfish_result_msg = 'login success.';
			      	res.json(resData);
	        	}else{
	        		resData.rockfish_result_code = RESULT_FAIL_CODE;
					resData.rockfish_result_msg = 'login fail.';
			      	res.json(resData);
	        	}
	        }
	    });
	}else{
		resData.rockfish_result_code = RESULT_FAIL_CODE;
		resData.rockfish_result_msg = 'id or password value is empty.';
		res.json(resData);
	}
});

// logout  process
router.post('/logout', function(req, res, next) {
	var resData = new Object();
	 //req.session.destory();  // 세션 삭제
	 req.session.destroy(function(err) {
     	// cannot access session here
  	 });
	 res.clearCookie('rockfish_session_key'); // 세션 쿠키 삭제

	 resData.rockfish_result_code = RESULT_SUCCESS_CODE;
	 res.json(resData);
});

//############################################################################################
// LOG PROCESS
//############################################################################################

// log search list process
router.post('/logSearchList', function(req, res, next) {
	var resData = new Object();
	if(req.session.user_id !== null && req.session.user_id !== undefined 
		&& req.session.user_id !== ""){
		var collection = db.get('rockfish_service_log'); 
		var params = getParams(req);

		var paraCondition = {};

		if(params.APP !=''){
			paraCondition["ACCESS.ROCKFISH_CLIENT_APP"]  = new RegExp(params.APP, 'i');
		}

		if(params.ROCKFISH_RESULT !=''){
			paraCondition["RESPONSE.ROCKFISH_RESULT_CODE"]  = params.ROCKFISH_RESULT;
		}
		
		if(params.ROCKFISH_ENCRYPT_PARAMETER !=''){
			if(params.ROCKFISH_ENCRYPT_PARAMETER =="Y"){
				paraCondition["ACCESS.ROCKFISH_ENCRYPT_PARAMETER"]  = {$ne : ""};
			}else{
				paraCondition["ACCESS.ROCKFISH_ENCRYPT_PARAMETER"]  = "";
			}			
		}	

		if(params.ROCKFISH_ACCESS_ID !=''){
			paraCondition["ACCESS.ROCKFISH_ACCESS_ID"]  = new RegExp(params.ROCKFISH_ACCESS_ID, 'i');
		}

		if(params.ROCKFISH_DEVICE !=''){
			paraCondition["ACCESS.ROCKFISH_DEVICE"]  = new RegExp(params.ROCKFISH_DEVICE, 'i');
		}

		if(params.ROCKFISH_OS !=''){
			paraCondition["ACCESS.ROCKFISH_OS"]  = new RegExp(params.ROCKFISH_OS, 'i');
		}

		if(params.ROCKFISH_OS_VERSION !=''){
			paraCondition["ACCESS.ROCKFISH_OS_VERSION"]  = new RegExp(params.ROCKFISH_OS_VERSION, 'i');
		}

		if(params.ROCKFISH_OS_VERSION_DESC !=''){
			paraCondition["ACCESS.ROCKFISH_OS_VERSION_DESC"]  = new RegExp(params.ROCKFISH_OS_VERSION_DESC, 'i');
		}


		if(params.TARGET_SERVICE !=''){
			paraCondition["TARGET_SERVICE"] = new RegExp(params.TARGET_SERVICE, 'i');
		}

		if(params.SERVICE_METHOD !=''){
			paraCondition["SERVICE_METHOD"] = params.SERVICE_METHOD;
		}

		if(params.SEND_TYPE !=''){
			paraCondition["SEND_TYPE"] = params.SEND_TYPE;
		}

		if(params.REQUEST_TIME1 !='' && params.REQUEST_TIME2 !=''){
			var sDate = getDateObj(params.REQUEST_TIME1);
			var eDate = getDateObj(params.REQUEST_TIME2);
			paraCondition["REQUEST_TIME"] =  {"$gte": new Date(sDate.YYYY, sDate.MM, sDate.DD)
									   ,"$lt": new Date(eDate.YYYY, eDate.MM, eDate.DD)};
		}
		
		var NUMBER_OF_ITEMS = 500;
		var SKIP_COUNT = 0;

		if(parseInt(params.PAGE_NUMBER) > 0){
			SKIP_COUNT = (NUMBER_OF_ITEMS * (parseInt(params.PAGE_NUMBER) - 1));
		}

		collection.find(
			 paraCondition
	    	,{sort: {REQUEST_TIME: -1},skip: SKIP_COUNT , limit: NUMBER_OF_ITEMS}
	    	,function(err, data){
	        if (err){		 
	        	console.error(SERVER_ERROR, err.stack);   
	        	resData.rockfish_result_code = RESULT_FAIL_CODE;
				resData.rockfish_result_msg = SERVER_ERROR;
				res.json(resData);
	        }else{	
	        	resData.rockfish_result_code = RESULT_SUCCESS_CODE;
		        
		        var dataArray = new Array();
		        for(var i=0;i<data.length;i++){
					var json = new Object();
					json._id = data[i]._id;
					json.ROCKFISH_CLIENT_APP = data[i].ACCESS.ROCKFISH_CLIENT_APP;
                    json.ROCKFISH_CLIENT_APP_VERSION = data[i].ACCESS.ROCKFISH_CLIENT_APP_VERSION;
                    json.TARGET_SERVICE = data[i].TARGET_SERVICE;
                    if(data[i].SEND_TYPE == "G"){
                    	json.SEND_TYPE = "General";
                    }else if(data[i].RESPONSE.ROCKFISH_RESULT_CODE == "M"){
                    	json.SEND_TYPE = "Multipart";
                    }else{
                    	json.SEND_TYPE = "Download";
                    }
                    
                    if(data[i].ACCESS.ROCKFISH_ENCRYPT_PARAMETER == "" || data[i].ACCESS.ROCKFISH_ENCRYPT_PARAMETER === undefined ){
                    	json.ROCKFISH_ENCRYPT_PARAMETER = "N";
                    }else{
                    	json.ROCKFISH_ENCRYPT_PARAMETER = "Y";
                    }
                    json.REQUEST_TIME = data[i].REQUEST_TIME;
                    json.RESPONSE_TIME = data[i].RESPONSE_TIME;
                    json.ROCKFISH_ACCESS_ID = data[i].ACCESS.ROCKFISH_ACCESS_ID;
                    json.ROCKFISH_DEVICE = data[i].ACCESS.ROCKFISH_DEVICE;
                    json.ROCKFISH_OS = data[i].ACCESS.ROCKFISH_OS;
                    json.ROCKFISH_OS_VERSION = data[i].ACCESS.ROCKFISH_OS_VERSION;
                    json.ROCKFISH_OS_VERSION_DESC = data[i].ACCESS.ROCKFISH_OS_VERSION_DESC;
                    json.SERVICE_METHOD = data[i].SERVICE_METHOD;

                    if(data[i].RESPONSE.ROCKFISH_RESULT_CODE == "S"){
                    	json.ROCKFISH_RESULT = "Success";
                    }else{
                    	json.ROCKFISH_RESULT = "Fail";
                    }
                    dataArray.push(json);
				}
		        resData.list = dataArray;

		        var pageObj = new Object();
		        if(parseInt(params.PAGE_NUMBER) == 0){
					pageObj.pageNo = 1;
					pageObj.pageCount = 2;
				}else{
					pageObj.pageNo = params.PAGE_NUMBER;
					pageObj.pageCount = parseInt(params.PAGE_NUMBER)+1;
				}
		        
		        pageObj.listCount = dataArray.length;
		        resData.page = pageObj;
		      	res.json(resData);
	        }
	    });
	}else{
		resData.rockfish_result_code = RESULT_SETTION_INVALID_CODE;
		res.json(resData);
	}
});

// log info process
router.post('/logInfo', function(req, res, next) {
	var resData = new Object();
	if(req.session.user_id !== null && req.session.user_id !== undefined 
		&& req.session.user_id !== ""){
		var collection = db.get('rockfish_service_log'); 
		var params = getParams(req);
		var paraCondition = new Object();
		paraCondition._id = params.logInfoId;
		collection.find(
			 paraCondition
	    	,function(err, data){
	        if (err){		 
	        	console.error(SERVER_ERROR, err.stack);   
	        	resData.rockfish_result_code = RESULT_FAIL_CODE;
				resData.rockfish_result_msg = SERVER_ERROR;
				res.json(resData);
	        }else{	
		        resData.rockfish_result_code = RESULT_SUCCESS_CODE;
		        resData.list = data;
		      	res.json(resData);
	        }
	    });
	}else{
		resData.rockfish_result_code = RESULT_SETTION_INVALID_CODE;
		res.json(resData);
	}
});

//############################################################################################
// SERVICE PROCESS
//############################################################################################

// service search list process
router.post('/serviceSearchList', function(req, res, next) {
	var resData = new Object();
	if(req.session.user_id !== null && req.session.user_id !== undefined 
		&& req.session.user_id !== ""){
		var collection = db.get('rockfish_service_master'); 
		var params = getParams(req);

		var paraCondition = new Object();
		paraCondition.SERVICE_APP = new RegExp(params.SERVICE_APP, 'i');
		paraCondition.SERVICE = new RegExp(params.SERVICE, 'i');
		paraCondition.SERVICE_TITLE = new RegExp(params.SERVICE_TITLE, 'i');
		paraCondition.SERVICE_DESC = new RegExp(params.SERVICE_DESC, 'i');
		paraCondition.SERVICE_URL = new RegExp(params.SERVICE_URL, 'i');
		
		if(params.SERVICE_TYPE !=''){
			paraCondition.SERVICE_TYPE = params.SERVICE_TYPE;
		}

		if(params.SERVICE_STATUS !=''){
			paraCondition.SERVICE_STATUS = params.SERVICE_STATUS;
		}

		if(params.SERVICE_PROTOCOL !=''){
			paraCondition.SERVICE_PROTOCOL = params.SERVICE_PROTOCOL;
		}

		if(params.SERVICE_METHOD !=''){
			paraCondition.SERVICE_METHOD = params.SERVICE_METHOD;
		}

		if(params.REG_DATE1 !='' && params.REG_DATE2 !=''){
			var sDate = getDateObj(params.REG_DATE1);
			var eDate = getDateObj(params.REG_DATE2);
			paraCondition.REG_DATE =  {"$gte": new Date(sDate.YYYY, sDate.MM, sDate.DD)
									   ,"$lt": new Date(eDate.YYYY, eDate.MM, eDate.DD)};
		}

		if(params.MOD_DATE1 !='' && params.MOD_DATE2 !=''){
			var sDate = getDateObj(params.MOD_DATE1);
			var eDate = getDateObj(params.MOD_DATE2);
			paraCondition.MOD_DATE =  {"$gte": new Date(sDate.YYYY, sDate.MM, sDate.DD)
									  ,"$lt": new Date(eDate.YYYY, eDate.MM, eDate.DD)};
		}

		collection.find(
			 paraCondition
	    	,{sort: {MOD_DATE: -1}}
	    	,function(err, data){
	        if (err){		 
	        	console.error(SERVER_ERROR, err.stack);   
	        	resData.rockfish_result_code = RESULT_FAIL_CODE;
				resData.rockfish_result_msg = SERVER_ERROR;
				res.json(resData);
	        }else{	
		        resData.rockfish_result_code = RESULT_SUCCESS_CODE;
		        resData.list = data;
		      	res.json(resData);
	        }
	    });
	}else{
		resData.rockfish_result_code = RESULT_SETTION_INVALID_CODE;
		res.json(resData);
	}
});

// service info process
router.post('/serviceInfo', function(req, res, next) {
	var resData = new Object();
	if(req.session.user_id !== null && req.session.user_id !== undefined 
		&& req.session.user_id !== ""){
		var collection = db.get('rockfish_service_master'); 
		var params = getParams(req);
		var paraCondition = new Object();
		paraCondition._id = params.serviceInfoId;
		collection.find(
			 paraCondition
	    	,function(err, data){
	        if (err){		 
	        	console.error(SERVER_ERROR, err.stack);   
	        	resData.rockfish_result_code = RESULT_FAIL_CODE;
				resData.rockfish_result_msg = SERVER_ERROR;
				res.json(resData);
	        }else{	
		        resData.rockfish_result_code = RESULT_SUCCESS_CODE;
		        resData.list = data;
		      	res.json(resData);
	        }
	    });
	}else{
		resData.rockfish_result_code = RESULT_SETTION_INVALID_CODE;
		res.json(resData);
	}
});

// service save process
router.post('/serviceSave', function(req, res, next) {
	var resData = new Object();
	if(req.session.user_id !== null && req.session.user_id !== undefined 
		&& req.session.user_id !== ""){
		var collection = db.get('rockfish_service_master'); 
		var params = getParams(req);
		//modify
		if(params.serviceInfoId !=null && params.serviceInfoId !== undefined
		 && params.serviceInfoId !="" && params.saveMode == "M"){
			// No update field is SERVICE_APP , SERVICE
			collection.update({
	        _id: params.serviceInfoId
		    },{$set : { 'SERVICE_TYPE' : params.SERVICE_TYPE
		    	       ,'SERVICE_TITLE' : params.SERVICE_TITLE
		    		   ,'SERVICE_STATUS' : params.SERVICE_STATUS
		    		   ,'SERVICE_PROTOCOL' : params.SERVICE_PROTOCOL
		    		   ,'SERVICE_METHOD' : params.SERVICE_METHOD
		    		   ,'SERVICE_URL' : params.SERVICE_URL
		    		   ,'SERVICE_DESC' : params.SERVICE_DESC
		    		   ,'MOD_DATE' : new Date()
		    		  }
	    		  }, function(err, data){
	      			if (err){		 
			        	console.error(SERVER_ERROR, err.stack);   
			        	resData.rockfish_result_code = RESULT_FAIL_CODE;
						resData.rockfish_result_msg = SERVER_ERROR;
						res.json(resData);
			        }else{	
				        resData.rockfish_result_code = RESULT_SUCCESS_CODE;
				      	res.json(resData);
			      }
		    });
		}else{
		//create
			var paraCondition = new Object();
			paraCondition.SERVICE = params.SERVICE;
			collection.find(
				 paraCondition
		    	,function(err, data){
			        if (err){		 
			        	console.error(SERVER_ERROR, err.stack);   
			        	resData.rockfish_result_code = RESULT_FAIL_CODE;
						resData.rockfish_result_msg = SERVER_ERROR;
						res.json(resData);
			        }else{	
			        	if(data !=null && data != undefined && data.length > 0  ){
			        		resData.rockfish_result_code = "D";
			        		resData.rockfish_result_msg = "SERVICE value is duplicate.";
							res.json(resData);
			        	}else{
			        		collection.insert({
						    	'SERVICE_APP' : params.SERVICE_APP
						       ,'SERVICE' : params.SERVICE
				    	       ,'SERVICE_TITLE' : params.SERVICE_TITLE
				    		   ,'SERVICE_TYPE' : params.SERVICE_TYPE
				    		   ,'SERVICE_STATUS' : params.SERVICE_STATUS
				    		   ,'SERVICE_PROTOCOL' : params.SERVICE_PROTOCOL
				    		   ,'SERVICE_METHOD' : params.SERVICE_METHOD
				    		   ,'SERVICE_URL' : params.SERVICE_URL
				    		   ,'SERVICE_DESC' : params.SERVICE_DESC
				    		   ,'REG_DATE' : new Date()
				    		   ,'MOD_DATE' : new Date()
						   	}, function(err, data){
						   		if (err){		 
						        	console.error(SERVER_ERROR, err.stack);   
						        	resData.rockfish_result_code = RESULT_FAIL_CODE;
									resData.rockfish_result_msg = SERVER_ERROR;
									res.json(resData);
						        }else{	
							   		resData.rockfish_result_code = RESULT_SUCCESS_CODE;
							      	res.json(resData);
							    }
						    });
			        	}
			        }
		    });
		}
	}else{
		resData.rockfish_result_code = RESULT_SETTION_INVALID_CODE;
		res.json(resData);
	}
});

// service delete process
router.post('/serviceDelete', function(req, res, next) {
	var resData = new Object();
	if(req.session.user_id !== null && req.session.user_id !== undefined 
		&& req.session.user_id !== ""){
		var collection = db.get('rockfish_service_master'); 
		var params = getParams(req);
		var _ids = params.serviceOpenIds.split("|");
		collection.remove(
			  { _id: { $in: _ids } }
	    	,function(err, data){
	        if (err){		 
	        	console.error(SERVER_ERROR, err.stack);   
	        	resData.rockfish_result_code = RESULT_FAIL_CODE;
				resData.rockfish_result_msg = SERVER_ERROR;
				res.json(resData);
	        }else{	
		        resData.rockfish_result_code = RESULT_SUCCESS_CODE;
		      	res.json(resData);
	        }
	    });
	}else{
		resData.rockfish_result_code = RESULT_SETTION_INVALID_CODE;
		res.json(resData);
	}
});

//############################################################################################
// ADMIN PROCESS
//############################################################################################

// admin search list process
router.post('/adminSearchList', function(req, res, next) {
	var resData = new Object();
	if(req.session.user_id !== null && req.session.user_id !== undefined 
		&& req.session.user_id !== ""){
		var collection = db.get('rockfish_admin_master'); 
		var params = getParams(req);

		var paraCondition = new Object();
		paraCondition.ID = new RegExp(params.ID, 'i');
		paraCondition.NAME = new RegExp(params.NAME, 'i');
		paraCondition.DESC = new RegExp(params.DESC, 'i');
		
		if(params.STATUS !=''){
			paraCondition.STATUS = params.STATUS;
		}

		if(params.REG_DATE1 !='' && params.REG_DATE2 !=''){
			var sDate = getDateObj(params.REG_DATE1);
			var eDate = getDateObj(params.REG_DATE2);
			paraCondition.REG_DATE =  {"$gte": new Date(sDate.YYYY, sDate.MM, sDate.DD)
									   ,"$lt": new Date(eDate.YYYY, eDate.MM, eDate.DD)};
		}

		if(params.MOD_DATE1 !='' && params.MOD_DATE2 !=''){
			var sDate = getDateObj(params.MOD_DATE1);
			var eDate = getDateObj(params.MOD_DATE2);
			paraCondition.MOD_DATE =  {"$gte": new Date(sDate.YYYY, sDate.MM, sDate.DD)
									  ,"$lt": new Date(eDate.YYYY, eDate.MM, eDate.DD)};
		}

		collection.find(
			 paraCondition
	    	,{PASSWORD:false,sort: {MOD_DATE: -1}}
	    	,function(err, data){
	        if (err){		 
	        	console.error(SERVER_ERROR, err.stack);   
	        	resData.rockfish_result_code = RESULT_FAIL_CODE;
				resData.rockfish_result_msg = SERVER_ERROR;
				res.json(resData);
	        }else{	
		        resData.rockfish_result_code = RESULT_SUCCESS_CODE;
		        resData.list = data;
		      	res.json(resData);
	        }
	    });
	}else{
		resData.rockfish_result_code = RESULT_SETTION_INVALID_CODE;
		res.json(resData);
	}
});

// admin info process
router.post('/adminInfo', function(req, res, next) {
	var resData = new Object();
	if(req.session.user_id !== null && req.session.user_id !== undefined 
		&& req.session.user_id !== ""){
		var collection = db.get('rockfish_admin_master'); 
		var params = getParams(req);
		var paraCondition = new Object();
		paraCondition._id = params.idInfoId;
		collection.find(
			 paraCondition
			,{PASSWORD:false}
	    	,function(err, data){
	        if (err){		 
	        	console.error(SERVER_ERROR, err.stack);   
	        	resData.rockfish_result_code = RESULT_FAIL_CODE;
				resData.rockfish_result_msg = SERVER_ERROR;
				res.json(resData);
	        }else{	
		        resData.rockfish_result_code = RESULT_SUCCESS_CODE;
		        resData.list = data;
		      	res.json(resData);
	        }
	    });
	}else{
		resData.rockfish_result_code = RESULT_SETTION_INVALID_CODE;
		res.json(resData);
	}
});

// admin save process
router.post('/adminSave', function(req, res, next) {
	var resData = new Object();
	if(req.session.user_id !== null && req.session.user_id !== undefined 
		&& req.session.user_id !== ""){
		var collection = db.get('rockfish_admin_master'); 
		var params = getParams(req);
		//modify
		if(params.idInfoId !=null && params.idInfoId !== undefined
		 && params.idInfoId !="" && params.saveMode == "M"){
			// No update field is ID
			collection.update({
	        _id: params.idInfoId
		    },{$set : { 'NAME' : params.NAME
		    	       ,'DESC' : params.DESC
		    		   ,'STATUS' : params.STATUS
		    		   ,'MOD_DATE' : new Date()
		    		  }
	    		  }, function(err, data){
	      			if (err){		 
			        	console.error(SERVER_ERROR, err.stack);   
			        	resData.rockfish_result_code = RESULT_FAIL_CODE;
						resData.rockfish_result_msg = SERVER_ERROR;
						res.json(resData);
			        }else{	
				        resData.rockfish_result_code = RESULT_SUCCESS_CODE;
				      	res.json(resData);
			      }
		    });
		}else{
		//create
			var paraCondition = new Object();
			paraCondition.ID = params.ID;
			collection.find(
				 paraCondition
		    	,function(err, data){
			        if (err){		 
			        	console.error(SERVER_ERROR, err.stack);   
			        	resData.rockfish_result_code = RESULT_FAIL_CODE;
						resData.rockfish_result_msg = SERVER_ERROR;
						res.json(resData);
			        }else{	
			        	if(data !=null && data != undefined && data.length > 0  ){
			        		resData.rockfish_result_code = "D";
			        		resData.rockfish_result_msg = "ID value is duplicate.";
							res.json(resData);
			        	}else{
			        		collection.insert({
						    	'ID' : params.ID
						       ,'PASSWORD' : encryptAesHex(decryptStringWithRsaPrivateKey(params.PASSWORD))
						       ,'NAME' : params.NAME
				    	       ,'DESC' : params.DESC
				    		   ,'STATUS' : params.STATUS
				    		   ,'REG_DATE' : new Date()
				    		   ,'MOD_DATE' : new Date()
						   	}, function(err, data){
						   		if (err){		 
						        	console.error(SERVER_ERROR, err.stack);   
						        	resData.rockfish_result_code = RESULT_FAIL_CODE;
									resData.rockfish_result_msg = SERVER_ERROR;
									res.json(resData);
						        }else{	
							   		resData.rockfish_result_code = RESULT_SUCCESS_CODE;
							      	res.json(resData);
							    }
						    });
			        	}
			        }
		    });
		}
	}else{
		resData.rockfish_result_code = RESULT_SETTION_INVALID_CODE;
		res.json(resData);
	}
});

// admin delete process
router.post('/adminDelete', function(req, res, next) {
	var resData = new Object();
	if(req.session.user_id !== null && req.session.user_id !== undefined 
		&& req.session.user_id !== ""){
		var collection = db.get('rockfish_admin_master'); 
		var params = getParams(req);
		var _ids = params.idOpenIds.split("|");
		collection.remove(
			  { _id: { $in: _ids } }
	    	,function(err, data){
	        if (err){		 
	        	console.error(SERVER_ERROR, err.stack);   
	        	resData.rockfish_result_code = RESULT_FAIL_CODE;
				resData.rockfish_result_msg = SERVER_ERROR;
				res.json(resData);
	        }else{	
		        resData.rockfish_result_code = RESULT_SUCCESS_CODE;
		      	res.json(resData);
	        }
	    });
	}else{
		resData.rockfish_result_code = RESULT_SETTION_INVALID_CODE;
		res.json(resData);
	}
});

//############################################################################################
// COMMON FUNCTION
//############################################################################################

//■■■ request get parameter
function getParams(req){
	var params = req.query;
	params = jsonConcat(params,req.params);
	params = jsonConcat(params,req.body);
	return params;
}

//■■■ get Date
function getDateObj(dateStr){
	var dateObj = new Object();
	dateObj.YYYY = '';
	dateObj.MM = '';
	dateObj.DD = '';
	if(dateStr !='' && dateStr.length == 10 ){
		dateObj.YYYY = dateStr.substring(0,4);
		dateObj.MM = dateStr.substring(5,7)-1;
		dateObj.DD = dateStr.substring(8,10);
	}
	return dateObj;
}

//■■■ json object concat
function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
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
  	console.error(SERVER_ERROR, exception.stack);   
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
  	console.error(SERVER_ERROR, exception.stack);   
  }
};

//■■■ encrypt
function encryptAesHex(text){
	if(text === null || text === '' || text === undefined){
	  	return '';
	}else{
	  var cipher = crypto.createCipher(ALGORITHM,PASSWORD)
	  var crypted = cipher.update(text,'utf8','hex')
	  crypted += cipher.final('hex');
	  return crypted;
	}
}
 
//■■■ decrypt
function decryptAesHex(text){
	if(text === null || text === '' || text === undefined){
	  	return '';
	}else{
		var decipher = crypto.createDecipher(ALGORITHM,PASSWORD)
		var dec = decipher.update(text,'hex','utf8')
		dec += decipher.final('utf8');
		return dec;
	}
}


//############################################################################################
// MODULE EXPORT
//############################################################################################

module.exports = router;
