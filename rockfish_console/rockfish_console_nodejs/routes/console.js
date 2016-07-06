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
var SERVER_ERROR = 'SERVER PROCESS ERROR';

var resData = new Object();
resData.rockfish_result_code = RESULT_FAIL_CODE;
resData.rockfish_result_msg = '';

//■■■ Login Process
router.post('/login', function(req, res, next) {
	var params = getParams(req);
	if(params.ID !== undefined && params.ID.trim() !=="" 
		&& params.PASSWORD !== undefined && params.PASSWORD.trim() !==""  ){
		var collection = db.get('rockfish_admin_master'); 
	    collection.find({ID : decryptStringWithRsaPrivateKey(params.ID),PASSWORD : encrypt(decryptStringWithRsaPrivateKey(params.PASSWORD)),STATUS : 'Y'}
	    	,"ID NAME", function(err, data){
	        if (err){		 
	        	console.error(SERVER_ERROR, err.stack);   
	        	resData.rockfish_result_code = RESULT_FAIL_CODE;
				resData.rockfish_result_msg = err;
				res.json(resData);
	        }else{	
	        	if(data !== null && data.length > 0 && data[0].ID !== undefined && data[0].ID == decryptStringWithRsaPrivateKey(params.ID)){
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

//■■■ Logout  Process
router.post('/logout', function(req, res, next) {
	 //req.session.destory();  // 세션 삭제
	 req.session.destroy(function(err) {
     	// cannot access session here
  	 });
	 res.clearCookie('rockfish_session_key'); // 세션 쿠키 삭제

	 resData.rockfish_result_code = RESULT_SUCCESS_CODE;
	 res.json(resData);
});

//■■■ Session Check Process
router.post('/sessionCheck', function(req, res, next) {
	if(req.session.user_id !== null && req.session.user_id !== undefined && req.session.user_id !== ""){
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


//■■■ request get parameter
function getParams(req){
	var params = req.query;
	params = jsonConcat(params,req.params);
	params = jsonConcat(params,req.body);
	return params;
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
function encrypt(text){
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
function decrypt(text){
	if(text === null || text === '' || text === undefined){
	  	return '';
	}else{
		var decipher = crypto.createDecipher(ALGORITHM,PASSWORD)
		var dec = decipher.update(text,'hex','utf8')
		dec += decipher.final('utf8');
		return dec;
	}
}

module.exports = router;
