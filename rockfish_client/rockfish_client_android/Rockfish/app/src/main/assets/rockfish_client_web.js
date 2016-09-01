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
var ROCKFISH_RSA_PUBLIC_KEY_VALUE = '-----BEGIN PUBLIC KEY-----';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA11iUtP4coVGcrLKryIkg';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='Iwt3qS4yR9F963ockxfvwUsjKsEBQdOc6Ef79LWK3qAFiFkM/h+rk19UQYe/iBKr';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='YPggFX+/eRT5Ubkd2Pgfje1L4g2/hJZ53n95e/pGFwjMpGBWvvnE0EoLR8RjX/5S';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='qLVZpFGZEvAnevwua5igi2Mn0y9Sx0z+8tUKaAAM7p7VlbxhdbDra9/nC8fWaHVy';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='PKs0TmxQcolaPMQwdtJTCrSCs8nx/aAxsWhzuc/mXDChBemAhpfBS94/mAdkKdU8';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='746z3axU06umIxJU44jPwGiG4M8HofnTkDfpfKIrat8St/lc9Lp0ulDm82CdR/dd';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='CwIDAQAB';
  ROCKFISH_RSA_PUBLIC_KEY_VALUE+='-----END PUBLIC KEY-----';

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
 * @param downolad : 다운로드 호출 설정
 *
 * ■■■ TO-DO 표시 항목에 대해서는 사용자가 요건에 맞게 정의 하여 사용 ■■■
 *
 */
function rockfishAjax(service, data, encdata, callback, errorcallback, loadingbar, async, attachField , attachFile, downolad){
	if(service === undefined || service === null || service.trim() == ""){
		alert("error : service value is empty");
		return;
	}

	// TO-DO  ROCKFISH URL (http,https  - https://localhost:9999)
	// HTTPS 사용시 self-sign에 따른 오류 발생 - 공인 인증서 사용하면 HTTPS 사용 가능
	//var url = "https://localhost:9999/rockfishController";
	//var url = "http://localhost:8888/rockfishController";
	//var downloadurl = "http://localhost:8888/rockfishDownloadController";

    // TEST용 (서버 IP 동적 설정)
	var url = "http://"+$("#IPPORT").val()+"/rockfishController";
    var downloadurl = "http://"+$("#IPPORT").val()+"/rockfishDownloadController";

	var rockfishSendType = "G";   // G : General  M : Multipart D : Download


	if(typeof async === undefined){
		async = true;
	}

	if(typeof downolad === undefined){
		downolad = false;
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

    if(attachField !== null && typeof attachField !== 'undefined'
    	&& attachFile !== null && typeof attachFile !== 'undefined'
    	&& attachField.length == attachFile.length){

    	rockfishSendType = "M";

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

    if(downolad){
    	rockfishSendType = "D";
    }

		
    if(rockfishSendType == "G"){
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
		    	xhr.setRequestHeader("rockfish_session_key", rockfishGetStorge("rockfish_session_key"));
		    	xhr.setRequestHeader("rockfish_access_id", rockfishGetStorge("rockfish_access_id"));
		    	xhr.setRequestHeader("rockfish_ip", rockfishRsaEncrypt(""));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_mac", rockfishRsaEncrypt(""));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_phone", rockfishRsaEncrypt(""));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_device", rockfishRsaEncrypt(""));					// Ignore Web Client
				xhr.setRequestHeader("rockfish_imei", rockfishRsaEncrypt(""));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_os", "BROWSER");
		    	xhr.setRequestHeader("rockfish_os_version", navigator.appName);
		    	xhr.setRequestHeader("rockfish_os_version_desc", navigator.userAgent);
		    	xhr.setRequestHeader("rockfish_target_service", service);
		    	xhr.setRequestHeader("rockfish_client_app", "Rockfish"); 		 // TO-DO	Client App
		    	xhr.setRequestHeader("rockfish_client_app_version", "1.0.0");  // TO-DO	Client App Version
		    	xhr.setRequestHeader("rockfish_send_type", "G");
		    	xhr.setRequestHeader("rockfish_encrypt_parameter", encryptParameter);

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
    }else if(rockfishSendType == "M"){
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
		    	xhr.setRequestHeader("rockfish_session_key", rockfishGetStorge("rockfish_session_key"));
		    	xhr.setRequestHeader("rockfish_access_id", rockfishGetStorge("rockfish_access_id"));
		    	xhr.setRequestHeader("rockfish_ip", rockfishRsaEncrypt(""));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_mac", rockfishRsaEncrypt(""));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_phone", rockfishRsaEncrypt(""));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_device", rockfishRsaEncrypt(""));					// Ignore Web Client
				xhr.setRequestHeader("rockfish_imei", rockfishRsaEncrypt(""));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_os", "BROWSER");
		    	xhr.setRequestHeader("rockfish_os_version", navigator.appName);
		    	xhr.setRequestHeader("rockfish_os_version_desc", navigator.userAgent);
		    	xhr.setRequestHeader("rockfish_target_service", service);
		    	xhr.setRequestHeader("rockfish_client_app", "Rockfish"); 		 // TO-DO	Client App
		    	xhr.setRequestHeader("rockfish_client_app_version", "1.0.0");  // TO-DO	Client App Version
		    	xhr.setRequestHeader("rockfish_send_type", "M");
		    	xhr.setRequestHeader("rockfish_encrypt_parameter", encryptParameter);

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
		    data : paramData,
			crossDomain : true,
		    success : function(response, status, request) {
		    	rockfishAjaxDownload(downloadurl,response.ROCKFISH_RESULT_JSON);
		    	/*
		    	var contTypeDisposition = request.getResponseHeader ("Content-Disposition");
		    	if (contTypeDisposition && contTypeDisposition.indexOf("=") !== -1) {
		    		var filename = contTypeDisposition.substring(contTypeDisposition.indexOf("=")+1,contTypeDisposition.length);
		    		var blob = new Blob([response], {type: "octet/stream"});
		    		var link=document.createElement('a');
		            link.href=window.URL.createObjectURL(blob);
		            link.download=filename;
		            link.click();
	            }
	            */
		    },
		    beforeSend: function(xhr) {
		    	/* ROCKFISH CUSTMOMER HEADER*/
		    	xhr.setRequestHeader("rockfish_session_key", rockfishGetStorge("rockfish_session_key"));
		    	xhr.setRequestHeader("rockfish_access_id", rockfishGetStorge("rockfish_access_id"));
		    	xhr.setRequestHeader("rockfish_ip", rockfishRsaEncrypt(""));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_mac", rockfishRsaEncrypt(""));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_phone", rockfishRsaEncrypt(""));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_device", rockfishRsaEncrypt(""));					// Ignore Web Client
				xhr.setRequestHeader("rockfish_imei", rockfishRsaEncrypt(""));						// Ignore Web Client
		    	xhr.setRequestHeader("rockfish_os", "BROWSER");
		    	xhr.setRequestHeader("rockfish_os_version", navigator.appName);
		    	xhr.setRequestHeader("rockfish_os_version_desc", navigator.userAgent);
		    	xhr.setRequestHeader("rockfish_target_service", service);
		    	xhr.setRequestHeader("rockfish_client_app", "Rockfish"); 		 // TO-DO	Client App
		    	xhr.setRequestHeader("rockfish_client_app_version", "1.0.0");  // TO-DO	Client App Version
		    	xhr.setRequestHeader("rockfish_send_type", "D");
		    	xhr.setRequestHeader("rockfish_encrypt_parameter", encryptParameter);

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
 * set localStorge
 * </pre>
 * @param cName : storge key 
 * @param cValue : storge value
 *
 */
function rockfishSetStorge(cName, cValue){
    if( ('localStorage' in window) && window['localStorage'] !== null) {
	    localStorage.setItem(cName, cValue);
	}else{
	    alert("현재 브라우저는 WebStorage를 지원하지 않습니다")
	}
}

/**
 * <pre>
 * set localStorge
 * </pre>
 * @param cName : storge key 
 * @param cValue : storge value
 *
 */
function rockfishSetEncryptStorge(cName, cValue){
    if( ('localStorage' in window) && window['localStorage'] !== null) {
	    localStorage.setItem(cName, rockfishRsaEncrypt(cValue));
	}else{
	    alert("현재 브라우저는 WebStorage를 지원하지 않습니다")
	}
}


/**
 * <pre>
 * localStorge clear
 * </pre>
 *
 */
function rockfishClearStorge(){
    if( ('localStorage' in window) && window['localStorage'] !== null) {
	    localStorage.clear();
	}else{
	    alert("현재 브라우저는 WebStorage를 지원하지 않습니다")
	}
}

/**
 * <pre>
 * get localStorge
 * </pre>
 * @param cName : storge key 
 *
 */
function rockfishGetStorge(cName) {
	if( ('localStorage' in window) && window['localStorage'] !== null) {
		if(localStorage.getItem(cName) == null){
			return "";
		}else{
			return localStorage.getItem(cName);	
		}
	}else{
	    alert("현재 브라우저는 WebStorage를 지원하지 않습니다")
	    return "";
	}
}

/**
 * <pre>
 * download action
 * </pre>
 * @param url : download url
 * @param data : json object
 *
 */
function rockfishAjaxDownload(url, data) {		
    location.href = url+"?ROCKFISH_TEMP_FILE="+encodeURIComponent(rockfishRsaEncrypt(data.ROCKFISH_TEMP_FILE))+"&ROCKFISH_REAL_FILE="+encodeURIComponent(rockfishRsaEncrypt(data.ROCKFISH_REAL_FILE));

    /*
	var agent = navigator.userAgent.toLowerCase();

 	if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
		 var url= url+"?ROCKFISH_TEMP_FILE="+encodeURIComponent(rockfishRsaEncrypt(data.ROCKFISH_TEMP_FILE))+"&ROCKFISH_REAL_FILE="+encodeURIComponent(rockfishRsaEncrypt(data.ROCKFISH_REAL_FILE));
		 var $form = $('<form></form>');
		 $form.attr('action', url);
		 $form.attr('method', 'POST');
		 $form.attr('target', '_blank');
		 $form.appendTo('body');   
		 $form.submit();
	}else{

		var $iframe;
		var iframe_doc;
		var iframe_html;

		if (($iframe = $('#download_iframe')).length === 0) {
			$iframe = $("<iframe id='download_iframe'" +
						" style='display: none' src='about:blank'></iframe>"
					   ).appendTo("body");
		}

		iframe_doc = $iframe[0].contentWindow || $iframe[0].contentDocument;
		if (iframe_doc.document) {
			iframe_doc = iframe_doc.document;
		}

		iframe_html = "<html><head></head><body><form method='POST' action='" + url +"'>";

		Object.keys(data).forEach(function(key){
			iframe_html += "<input type='hidden' name='"+key+"' value='"+rockfishRsaEncrypt(data[key])+"'>";
		});

		iframe_html +="</form></body></html>";

		iframe_doc.open();
		iframe_doc.write(iframe_html);
		$(iframe_doc).find('form').submit();
	}
	*/
}