/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
/* filename : rockfish_client_web.js
/* author 	: devsunset (devsunset@gmail.com)
/* desc   	: rockfish client web (ajax module)
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

// PARAMETER 평문 설정
var ROCKFISH_PARAMETER_PLAIN = "ROCKFISH_PARAMETER_PLAIN";

// PARAMETER 암호화 설정
var ROCKFISH_PARAMETER_ENCRYPT = "ROCKFISH_PARAMETER_ENCRYPT";

// RSA 암호화 공개 키  ■■■ TO-DO set up 한 공개 key 값 으로 치환 필요
var ROCKFISH_RSA_PUBLIC_KEY_VALUE = '-----BEGIN RSA PRIVATE KEY-----';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='MIIEpAIBAAKCAQEA11iUtP4coVGcrLKryIkgIwt3qS4yR9F963ockxfvwUsjKsEB';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='QdOc6Ef79LWK3qAFiFkM/h+rk19UQYe/iBKrYPggFX+/eRT5Ubkd2Pgfje1L4g2/';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='hJZ53n95e/pGFwjMpGBWvvnE0EoLR8RjX/5SqLVZpFGZEvAnevwua5igi2Mn0y9S';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='x0z+8tUKaAAM7p7VlbxhdbDra9/nC8fWaHVyPKs0TmxQcolaPMQwdtJTCrSCs8nx';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='/aAxsWhzuc/mXDChBemAhpfBS94/mAdkKdU8746z3axU06umIxJU44jPwGiG4M8H';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='ofnTkDfpfKIrat8St/lc9Lp0ulDm82CdR/ddCwIDAQABAoIBAHAI9dT0H5EOFKUE';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='j7rVHJMe9DJghmg25XwNG7CrU2EM5k7n+u90WL3ANaUqjgUk27wEGG5dq7YQcpVl';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='OpBgpijc7lRBEiy8bLnHxW+MJ15/hmslG+6vGthXGa0WmECDo3QhawAQkgSLgTLl';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='SY43kmmTb/+9NBZWOzQQ31W7IkthZlecDz40QkGpeD7SMbMY4IIjwZQ1FxLkPjCj';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='uVx5Db6Y//ZH8+8FM9/NknIG3nS72clYw0J0wDj6+HNixKCfmrMHF3ZiibbpG+B+';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='VZmwVir5s3h1335vnERyWCyB2mmhSDSDtk9qvyCFsZ/vX9CtDcCBTYpfnL+FrgaJ';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='IrvjJAECgYEA9aKjZ7fKtil38Ob/qCBsONRLFPbB7A0iwVz8NJWpeAIW3ht7G9PF';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='7Xb5LqvjgX5y7r27ch0WKNyTaZ8wHO4+u+dH2u2OM/LcWt33fEwEYqRP6Qr4DDIA';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='T+zBuRPd6VLWWeiv6OsQUTa7pLm/nJZfp8yz6Z4xFfAEHHzfWx56mOECgYEA4G7B';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='r4S7Gl8UWIK5oemg3an8JI1rXnRHDMdoctm/C/NpOGlsJLXhUN1T8J3vDiCKgkNI';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='MCVQeLDUMBPuxeuSELUkguYWKknZgiWfiYDKIF2gWcNgnM+vs4YXsRVEvIk7yZO4';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='7VEnJcOGdrGUHS918GdBBTXDGZneaJWQr5BlV2sCgYEAy+agAj7c9O3jdIQsgOG5';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='NEt1sAdN3qbgzOZlLTl3HfmOBf2F6gmXaZGzM3zYM+xFd8zjxsxCUtUXQTw1ci6K';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='wOwyB5fezVyycnODNxjbIw8GjorecTEodTAxd3L4aPCsoqG3NH+8Yc4vYYQXfOKO';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='sPoJ9smsMWu13fgCaN8aIcECgYA+brEUmXDPEjn/sUXgg7RLVXkd1fVTTjdhl6s3';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='n9kkgu73UWRTBgGK1DcAjX6tyGGfgQX41rh/CnnMcg8PIcv9N9bTTxxFYUvPh5XM';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='03Xm8QSlU9Nxa9jtsNSwX0FCzU5DcgOUiOnB+JVUOWwBfm1pld+himYeng4fu9OG';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='8z0txwKBgQCI8NWsMsOEJFgPGy6m1z1xTUdoojMxtDeqnbiv64EZ7GETMDUZOvPL';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='2rR2TvNG9lZ9BuETnm4sYoaIktix+PsQEM9QhLibUi1LaQ0VfSb5eq2gzAiQcwrK';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='/y8wk2fq02LnbRmLH3Qrqr36FBv8ePcxODAI5ZTkS9IEriUqdnCWeg==';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='-----END RSA PRIVATE KEY-----';

var ROCKFISH_RSA_JSENCRYPT = new JSEncrypt();
    ROCKFISH_RSA_JSENCRYPT.setPublicKey(ROCKFISH_RSA_PUBLIC_KEY_VALUE);

/**
 * <pre>
 * rockfish ajax Common call function
 * </pre>
 * @param service : 호출 service target
 * @param data : 호출 parameter
 * @param encdata : 암호화 설정 값
 *					 ROCKFISH_PARAMETER_PLAIN (전체 평문)
 *					 ROCKFISH_PARAMETER_ENCRYPT (전체 암호화)
 *					 Array() field value (암호화 하고자 하는 field)
 * @param callback : success callback 함수
 * @param errorcallback : error callback 함수
 * @param loadingbar : 공통으로 progress bar 등을 사용하는 경우 호출 Action에 따라 표시 유무 설정
 * @param async : 동기화 여부 설정 기본은 true
 * @param attachField : 첨부파일 Array Field
 * @param attachFile : 첨부파일 Array Object
 *
 * ■■■ TO-DO 표시 항목에 대해서는 사용자가 요건에 맞게 정의 하여 사용 ■■■
 *
 */
function rockfishAjax(service, data, encdata, callback, errorcallback, loadingbar, async, attachField , attachFile){
	if(service === undefined || service === null || service.trim() == ""){
		alert("error : service value is empty");
		return;
	}

	// TO-DO  ROCKFISH URL (http,https  - https://localhost:9999)
	// HTTPS 사용시 self-sign에 따른 오류 발생 - 공인 인증서 사용하면 HTTPS 사용 가능
	//var url = "https://localhost:9999/rockfishController";
	var url = "http://localhost:8888/rockfishController";

	if(typeof async === undefined){
		async = true;
	}

	var paramData = null;
	var encryptParameter = "";
    if(ROCKFISH_PARAMETER_PLAIN === encdata){
		paramData = data;
    }else if (ROCKFISH_PARAMETER_ENCRYPT === encdata){
    	if(data !== null && data !== undefined){
    		for(var fidx = 0;fidx <data.length;fidx++){
    			encryptParameter += data[fidx].name +"|^|";
    			data[fidx].value = rockfishRsaEncrypt(data[fidx].value);
    		}
    		paramData = data;
    	}
    }else{
    	if( Object.prototype.toString.call( encdata ) === '[object Array]' ) {
    	    if(encdata !==null && encdata.length > 0){
	    	    for(var fidx = 0;fidx <data.length;fidx++){
	    	    	if($.inArray(data[fidx].name, encdata) != -1){
	    	    		encryptParameter += data[fidx].name +"|^|";
	    				data[fidx].value = rockfishRsaEncrypt(data[fidx].value);
	    	    	}
	    		}
	    		paramData = data;
		    }else{
		    	paramData = data;
		    }
		}else{
			paramData = data;
		}
    }

    var generalRockfishSend = true;


    if(attachField !== null && typeof attachField !== "undefined"
    	&& attachFile !== null && typeof attachFile !== "undefined"
    	&& attachField.length == attachFile.length){

    	generalRockfishSend = false;

    	if (window.File && window.FileList && window.Blob && window.FileReader && window.FormData) {
		    var formData = new FormData();
		    if(paramData !=null && paramData.length > 0){
		    	for(var fidx = 0;fidx <paramData.length;fidx++){
		    		formData.append(paramData[fidx].name,paramData[fidx].value);
		    	}
		    }

		   for(var fileIdx = 0 ;fileIdx < attachFile.length; fileIdx++){
		   		if( Object.prototype.toString.call(attachFile[fileIdx]) === '[object File]' ){
		   			formData.append(attachField[fileIdx],attachFile[fileIdx]);
		   		}else{
		   			alert("object is not file object");
		   			return;
		   		}
		   }
		   paramData = formData;
		} else {
		    alert("browser doesn't supports File API");
		    return;
		}
    }


    if(generalRockfishSend){
    	$.ajax({
			type : "POST",
			url : url,
			async : async,
			cache : false,
		    data : paramData,
			crossDomain : true,
		    contentType: "application/json; charset=utf-8",
		    success : function(response, status, request) {
		    	callback(response);
		    },
		    beforeSend: function(xhr) {
		    	/* ROCKFISH CUSTMOMER HEADER*/
		    	xhr.setRequestHeader("rockfish_access_id", rockfishGetCookie("rockfish_access_id"));
		    	xhr.setRequestHeader("rockfish_ip", rockfishRsaEncrypt("-"));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_mac", rockfishRsaEncrypt("-"));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_phone", rockfishRsaEncrypt("-"));					// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_os", rockfishRsaEncrypt("BROWSER"));
		    	xhr.setRequestHeader("rockfish_os_version", rockfishRsaEncrypt(navigator.appName));
		    	xhr.setRequestHeader("rockfish_os_version_desc", rockfishRsaEncrypt(navigator.userAgent));
		    	xhr.setRequestHeader("rockfish_target_service", rockfishRsaEncrypt(service));
		    	xhr.setRequestHeader("rockfish_client_app", rockfishRsaEncrypt("rockfish")); 		 // TO-DO	Client App
		    	xhr.setRequestHeader("rockfish_client_app_version", rockfishRsaEncrypt("v.0.0.1"));  // TO-DO	Client App Version
		    	xhr.setRequestHeader("rockfish_multipart", rockfishRsaEncrypt("G"));
		    	xhr.setRequestHeader("rockfish_encrypt_parameter", rockfishRsaEncrypt(encryptParameter));

		    	// TO-DO COMMON PROGRESS START (EX : PROGRESSING BAR LOADING)  loadingbar true : false
		    },
		    complete: function() {
		    	// TO-DO COMMON PROGRESS END (EX : PROGRESSING BAR CLOASE) loadingbar true : false
		    },
		    error : function(request, status, error) {
		    	if(errorcallback !== null && typeof errorcallback !== "undefined"){
		    		errorcallback(status,error);
		    	}else{
		    		// TO-DO  customer define
			    	var errorMsg = 'status(code) : ' + request.status + '\n';
				    errorMsg += 'statusText : ' + request.statusText + '\n';
				    errorMsg += 'responseText : ' + request.responseText + '\n';
				    errorMsg += 'textStatus : ' + status + '\n';
				    errorMsg += 'errorThrown : ' + error;
				    alert(errorMsg);
		    	}
		    }
		});
    }else{
    	$.ajax({
			type : "POST",
			url : url,
			async : async,
			cache : false,
			processData : false,
		    data : paramData,
			crossDomain : true,
		    contentType: false,
		    success : function(response, status, request) {
		    	callback(response);
		    },
		    beforeSend: function(xhr) {
		    	/* ROCKFISH CUSTMOMER HEADER*/
		    	xhr.setRequestHeader("rockfish_access_id", rockfishGetCookie("rockfish_access_id"));
		    	xhr.setRequestHeader("rockfish_ip", rockfishRsaEncrypt("-"));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_mac", rockfishRsaEncrypt("-"));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_phone", rockfishRsaEncrypt("-"));					// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_os", rockfishRsaEncrypt("BROWSER"));
		    	xhr.setRequestHeader("rockfish_os_version", rockfishRsaEncrypt(navigator.appName));
		    	xhr.setRequestHeader("rockfish_os_version_desc", rockfishRsaEncrypt(navigator.userAgent));
		    	xhr.setRequestHeader("rockfish_target_service", rockfishRsaEncrypt(service));
		    	xhr.setRequestHeader("rockfish_client_app", rockfishRsaEncrypt("rockfish")); 		 // TO-DO	Client App
		    	xhr.setRequestHeader("rockfish_client_app_version", rockfishRsaEncrypt("v.0.0.1"));  // TO-DO	Client App Version
		    	xhr.setRequestHeader("rockfish_multipart", rockfishRsaEncrypt("M"));
		    	xhr.setRequestHeader("rockfish_encrypt_parameter", rockfishRsaEncrypt(encryptParameter));

		    	// TO-DO COMMON PROGRESS START (EX : PROGRESSING BAR LOADING)  loadingbar true : false
		    },
		    complete: function() {
		    	// TO-DO COMMON PROGRESS END (EX : PROGRESSING BAR CLOASE) loadingbar true : false
		    },
		    error : function(request, status, error) {
		    	if(errorcallback !== null && typeof errorcallback !== "undefined"){
		    		errorcallback(status,error);
		    	}else{
		    		// TO-DO  customer define
			    	var errorMsg = 'status(code) : ' + request.status + '\n';
				    errorMsg += 'statusText : ' + request.statusText + '\n';
				    errorMsg += 'responseText : ' + request.responseText + '\n';
				    errorMsg += 'textStatus : ' + status + '\n';
				    errorMsg += 'errorThrown : ' + error;
				    alert(errorMsg);
		    	}
		    }
		});

    }
};

/**
 * <pre>
 * rsa encrypt
 * </pre>
 * @param toEncrypt : encrypt value
 *
 */
function rockfishRsaEncrypt(toEncrypt){
  if(toEncrypt === null || toEncrypt === "" || toEncrypt === undefined){
  	  return "";
  }else{
	  return ROCKFISH_RSA_JSENCRYPT.encrypt(toEncrypt);
  }
}

/**
 * <pre>
 * set cookie
 * </pre>
 * @param cName : cookie name
 * @param cValue : cookie value
 * @param cDay : expires day
 *
 */
function rockfishSetCookie(cName, cValue){
    cookies = cName + '=' + escape(cValue) + '; path=/ ';
    document.cookie = cookies;
}

/**
 * <pre>
 * set cookie
 * </pre>
 * @param cName : cookie name
 * @param cValue : cookie value
 * @param cDay : expires day
 *
 */
function rockfishSetCookieExpires(cName, cValue, cDay){
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + '=' + escape(cValue) + '; path=/ ';
    if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}

/**
 * <pre>
 * get cookie
 * </pre>
 * @param cName : cookie name
 *
 */
function rockfishGetCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if(start != -1){
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}