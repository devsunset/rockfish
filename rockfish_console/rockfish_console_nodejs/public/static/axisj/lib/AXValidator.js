﻿/**
 * AXValidator
 * @class AXValidator
 * @extends AXJ
 * @version v1.53
 * @author tom@axisj.com, hwshin@superjump.co.kr
 * @logs
 "2013-07-18 오전 12:05:00",
 "2013-07-18 오후 12:31:04 - tom",
 "2013-07-19 오후 19:37:04 - shin : message[validateKey], errElement 추가",
 "2013-07-24 오후 19:24:00 - shin : displayFormatter 추가 keyup event phone '-' add",
 "2013-10-15 오후 13:10:00 - shin : del 기능 추가",
 "2013-11-06 오후 12:41:17 - tom : 버그패치",
 "2013-11-08 오전 11:08:17 - shin : messageConvert 예외 처리",
 "2013-11-08 오전 11:41:18 - tom : onBlur 버그패치, earlierThan, laterThan 키 추가",
 "2014-04-04 오전 10:33:08 - tom : validate(filterOption:JSObject) 옵션 추가",
 "2014-04-30 오후 1:30:11 - tom : validate date bug fix "
 "2014-07-09 tom : support radio & checkbox validate "
 "2014-07-10 tom : checkbox, radio item label property collect "
 "2014-08-27 tom : 주민번호 검사 로직 구현 option residentno "
 "2014-09-17 tom : 사업자등록번호 검사 로직 구현 option bizno "
 "2015-06-23 tom : AXConfig.AXValidator 변수 추가"
 *
 * @description
 * axisj form validator
 * @example
```js
var myValidator = new AXValidator();
myValidator.setConfig({
	targetFormName : "myForm"   //{String} - validate를 수행하려는 form "name", ID가 아닙니다.
});
```
 */

var AXValidator = Class.create(AXJ, {
    initialize: function (AXJ_super) {
        AXJ_super();
        this.Observer = null;
        this.form = null;
        this.elements = [];
        this.errElements = [];
        this.errMessagePattern = "[{label}] {message}";
        this.config = {
            targetID: null,
            clazz: "av-"
        };

		if(AXConfig.AXValidator && AXConfig.AXValidator.validateErrMessage){
			this.config.validateErrMessage = AXConfig.AXValidator.validateErrMessage;
		}else{
			this.config.validateErrMessage = {
				/* for element */
				required: "[{label}](은)는 필수입력 사항입니다.",
				requiredstring: "반드시 {required}(으)로 입력하셔야 하는 사항입니다.",
				match: "[{label}](은)는 입력된 내용이 일치하지 않습니다.",
				invalid: "[{label}](은)는 입력된 내용이 올바르지 않습니다.",
				min: "[{label}](은)는 {min} 이상의 값을 입력해주세요.",
				max: "[{label}](은)는 {max} 이하의 값을 입력해주세요.",
				minbyte: "[{label}]의 입력된 내용의 길이가 {minbyte}Byte 이상이어야 합니다.",
				maxbyte: "[{label}]의 입력된 내용의 길이가 {maxbyte}Byte를 초과할 수 없습니다.",
				minlength: "[{label}]의 입력된 내용의 length가 {minlength} 이상이어야 합니다.",
				maxlength: "[{label}]의 입력된 내용의 length가 {maxlength}을 초과할 수 없습니다.",

				/* for format */
				number: "숫자로만 입력하셔야 합니다.",
				email: "이메일 형식이 올바르지 않습니다.",
				hangul: "한글로만 입력하셔야 합니다.",
				engonly: "영문으로만 입력하셔야 합니다.",
				residentno: "주민등록번호 형식이 올바르지 않습니다.",
				foreignerno: "외국인등록번호 형식이 올바르지 않습니다.",
				bizno: "사업자등록번호 형식이 올바르지 않습니다.",
				phone: "전화번호 형식이 올바르지 않습니다.",
				isdate: "날짜 형식이 올바르지 않습니다.",
				zip: "우편번호 형식이 올바르지 않습니다.",
				money: "화폐형식으로만 입력하셔야 합니다.",
				earlierThan: "[{label}] 보다 빠른 날짜를 입력해야 합니다.",
				laterThan: "[{label}] 보다 느린 날짜를 입력해야 합니다.",

				exception: "not found errmessage"
			};
		}

    },
    init: function () {
        var cfg = this.config;
        if (Object.isUndefined(cfg.targetFormName)) {
            trace("need targetID - setConfig({targetFormName:''})");
            return;
        }

        if (!document[cfg.targetFormName]) {
            // 엘리먼트가 존재 하지 않는 경우 예외 처리
            trace("not found form element");
            return;
        }

        this.form = $(document[cfg.targetFormName]);
        this.findElement();
    },
    findElement: function () {
        var cfg = this.config;
        var allElements = this.form.serializeObject();
        var _elements = this.elements;
        var checkClass = this.validateCheckClass;

        axdom.each(allElements, function (eidx, Elem) {
            try {
                var config = {};
                var isValidate = false;
                axdom.each(checkClass, function (k, v) {
                    if (Elem.id) {
                        if (axdom("#" + Elem.id).hasClass(cfg.clazz + k)) {
                            config[k] = v;
                            isValidate = true;
                        }
                    } else if (Elem.name) {
                        if ($(document[cfg.targetFormName][Elem.name]).hasClass(cfg.clazz + k)) {
                            config[k] = v;
                            isValidate = true;
                        }
                    }
                });
                if (isValidate) {
                    delete Elem.value;
                    Elem.config = config;
                    _elements.push(Elem);
                }
            } catch (e) {

            }
        });
	    // checkbox, radio 수집
	    var checkedItems = {};
	    axdom(this.form).find("input[type=checkbox], input[type=radio]").each(function(eidx, Elem){

		    var config = {};
		    var isValidate = false, label = "";
		    axdom.each(checkClass, function (k, v) {
				if (Elem.name) {
				    if ($(document[cfg.targetFormName][Elem.name]).hasClass(cfg.clazz + k)) {
					    config[k] = v;
					    isValidate = true;
					    if(label == "") label = (Elem.title || Elem.placeholder || "");
				    }
			    }
		    });

		    if (isValidate) {
			    if(checkedItems[this.name]){
				    checkedItems[this.name].push({index:0, type:this.type, value:this.value, id:this.id, checked:this.checked, label:label});
			    }else{
				    checkedItems[this.name] = [{index:0, type:this.type, value:this.value, id:this.id,  checked:this.checked, config:config, label:label}];
			    }
		    }
	    });

	    axf.each(checkedItems, function(k, v){
		    var item = {
			    "id":"",
			    "name":k,
			    "type":v[0].type,
			    "label":v[0].label,
			    "multi":true,
			    "config":v[0].config
		    };
		    /*
		    for(var aa=0;aa<v.length;aa++){
			    if(item.id == ""){
				    item.id = v[aa].id;
			    }else{
				    item.id += "," + v[aa].id;
			    }
		    }
		    */
		    _elements.push(item);
	    });
	    
	    //config에 checkCrlf 옵션이 있을 경우
	    if(cfg.checkCrlf){
	    	axdom(this.form).find("textarea[maxlength]").each(function(index, element){
	    		
	    		var item = {
	    			"id":element.id,
	    			"name":element.name,
	    			"type":"textarea",
	    			"value":"",
	    			"label":element.title||element.placeholder||"",
	    			"config":{"maxlength":element.maxLength}
	    		};
	    		
	    		_elements.push(item);
	    	});
	    }

        this.elements = _elements;
    },

/**
 * @method AXValidator.add
 * @param {JSObject} - example code 참고
 * @description
 * validate 대상 아이템을 추가합니다.
 * @example
 ```

var jsObjectSample = {
    id: "userID",           //{string} - 아이템식별자
    label: "아이디",        //{string} - 아이템라벨
    config: {               //필요한 조합을 object로 정의합니다.
        required: true,		//[boolean=true] - 필수입력 체크
        number: true, 		//[boolean=true] - 숫자입력 체크
        email: true, 		//[boolean=true] - 이메일형식 체크
        hangul: true, 		//[boolean=true] - 한글형식 체크
        engonly: true, 		//[boolean=true] - 영문형식 체크
        residentno: true, 	//[boolean=true] - 주민등록번호형식 체크
        foreignerno: true,	//[boolean=true] - 외국인번호형식 체크
        bizno: true, 		//[boolean=true] - 사업자등록번호형식 체크
        phone: true, 		//[boolean=true] - 전화번호형식 체크
        isdate: true, 		//[boolean=true] - 날짜형식 체크
        zip: true, 			//[boolean=true] - 우편번호형식 체크
        money: true, 		//[boolean=true] - 숫자에 , 포함 체크
        earlierThan:{
            id: "targetId",			//{string} - 대상의 아이디. 현재 아이템의 값이 대상보다 커야함
            label:	"targetLabel"	//{string} - 대상의 라벨
        },
        laterThan:{
            id: "targetId",			//{string} - 대상의 아이디. 현재 아이템의 값이 대상보다 작아야함
            label:	"targetLabel"	//{string} - 대상의 라벨
        },
        min: true, 			//[boolean=true] - 최소값
        max: true, 			//[boolean=true] - 최대값
        minbyte: true, 		//[boolean=true] - 최소바이트값
        maxbyte: true, 		//[boolean=true] - 최대바이트값
        minlength: true, 	//[boolean=true] - 최소길이
        maxlength: true 	//[boolean=true] - 최대길이
    },
    realtime:{			    //특정이벤트 발생시 액션정의
        event: "keydown",	//{String} - 발생하는 이벤트 종류
        response: function(){   //{fn} - 정의된 이벤트에 따른 실시간 이벤트 콜백함수
            //trace(this);
        }
    },
    onblur: function(){     //[fn] - 대상 아이템에 블러 이벤트 발생 콜백함수
        //trace(this);
    }
};

var myValidator = new AXValidator();
myValidator.add({
    id: "userID",           //{string} - 아이템식별자
    label: "아이디",        //{string} - 아이템라벨
    config: {
        required: true,     //[boolean=true] - 필수입력 체크
        minbyte:10,         //[boolean=true] - 최소바이트값
        maxbyte:20          //[boolean=true] - 최대바이트값
    },
    realtime: {
        event: "keydown",           //{String} - 발생하는 이벤트 종류
        response: function () {     //{fn} - 정의된 이벤트에 따른 실시간 이벤트 콜백함수
        	if(this.result){
        		$("#userID_realtime").html("OK");
        	}else{
            	$("#userID_realtime").html(this.message);
           }
			if (this.validateKey == "maxbyte" || this.validateKey == "maxlength") {
			    return false; //키 입력 중지
			} else {
			    return true; //키 입력 제어 안함
			}
        }
    },
	onblur: function(){ //[fn] - 대상 아이템에 블러 이벤트 발생 콜백함수
		trace(this);
	}
});

myValidator.add({
	id:"enddate",   //{string} - 아이템 식별자
	label:"종료일",  //{string} - 아이템 라벨
	config:{
	    isdate:true,    //[boolean=true] - 날짜형식 체크
	    laterThan:{
	        id:"regdate",   //{string} - 대상의 아이디. 현재 아이템의 값이 대상보다 작아야함
	        label:"등록일"  //{string} - 대상의 라벨
        }
    },
	onblur: function(){     //[fn] - 대상 아이템에 블러 이벤트 발생 콜백함수
        trace(this);
	}
});

 ```
 */
    add: function (addObj) {
        var cfg = this.config;
        var addedObject;
        var addElement = this.addElement.bind(this);
        var getElement = this.getElement.bind(this);
        var isActiveFormControl = this.isActiveFormControl.bind(this);
        var element = getElement(addObj);
        if (!isActiveFormControl(element)) return false;

        if (addObj.id) {
            var findIndex = null;
            axdom.each(this.elements, function (eidx, elem) {
                if (this.id == addObj.id) {
                    findIndex = eidx;
                    return false;
                }
            });
            if (findIndex != null) {
                addElement(addObj, findIndex);
                addedObject = this.elements[findIndex];
            } else {
                addObj.name = axdom("#" + addObj.id).attr("name");
                this.elements.push(addObj);
                addedObject = this.elements.last();
            }
        } else if (addObj.name) {
            var findIndex = null;
            axdom.each(this.elements, function (eidx, elem) {
                if (this.name == addObj.name) {
                    findIndex = eidx;
                    return false;
                }
            });
            if (findIndex != null) {
                addElement(addObj, findIndex);
                addedObject = this.elements[findIndex];
            } else {
                addObj.id = $(document[cfg.targetFormName][addObj.name]).attr("id");
                this.elements.push(addObj);
                addedObject = this.elements.last();
            }

        }

        var raiseError = this.raiseError.bind(this);
        var validateFormatter = this.validateFormatter.bind(this);
        var targetElem;
        var targetElemForSelect;

        if (addedObject.id) {
            targetElem = axdom("#" + addedObject.id);
            targetElemForSelect = AXgetId(addedObject.id);
        } else if (addedObject.name) {
            targetElem = $(document[cfg.targetFormName][addedObject.name]);
            targetElemForSelect = document[cfg.targetFormName][addedObject.name];
        }
        var Elem = addedObject;
        var displayFormatter = this.displayFormatter.bind(this);

        // realtime 지원 함수 구문 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (addedObject.realtime) {
            //Elem.realtime.validate = Elem.config;

            Elem.needRealtimeCheck = false;
            Elem.realtimeCheck = {};

            axdom.each(Elem.config, function (k, v) {
                if (k == "maxlength" || k == "maxbyte") {
                    Elem.needRealtimeCheck = true;
                    Elem.realtimeCheck[k] = v;
                }
            });

            if (Elem.needRealtimeCheck) {
                targetElem.unbind("keydown.validate");
                targetElem.bind("keydown.validate", function (e) {
                    var event = window.event || e;
                    if (!event.keyCode || event.keyCode == 9 || event.keyCode == 16) return;
                    var _val = this.value;
                    var returnObject = null;
                    var eventBlock = true;

                    if (document.selection && document.selection.createRange) {
                        var range = document.selection.createRange();
                        if (range.text != "") eventBlock = false;
                    } else if (window.getSelection) {

                        if (AXUtil.browser.name == "mozilla") {
                            //trace({ maxlength: Elem.realtimeCheck.maxlength, selectionStart: targetElemForSelect.selectionStart });
                            if (Elem.realtimeCheck.maxlength > targetElemForSelect.selectionStart) {
                                eventBlock = false;
                            }
                        } else {
                            selectedText = window.getSelection().toString();
                            if (selectedText != "") eventBlock = false;
                        }
                    }


                    axdom.each(Elem.realtimeCheck, function (k, v) {
                        var val = targetElem.val() + "A";
                        if (!validateFormatter(Elem, val, k, v, "realtime")) { // 값 검증 처리
                            returnObject = raiseError(Elem, val, k, v);
                            return false;
                        }
                    });

                    var responseResult = true;
                    if (returnObject == null) {
                        Elem.realtime.response.call({ result: true });
                    } else {
                        returnObject.result = false;
                        responseResult = Elem.realtime.response.call(returnObject);
                    }

                    if (responseResult == false) {
                        if (eventBlock) {
                            if (event.keyCode != AXUtil.Event.KEY_DELETE
                                && event.keyCode != AXUtil.Event.KEY_BACKSPACE
                                && event.keyCode != AXUtil.Event.KEY_LEFT
                                && event.keyCode != AXUtil.Event.KEY_RIGHT) {

                                if (event.preventDefault) event.preventDefault();
                                if (event.stopPropagation) event.stopPropagation();
                                event.cancelBubble = true;
                                return false;
                            }
                        }
                    }

                });
            }



            //trace(Elem.config);

            targetElem.unbind("keyup.validate").bind("keyup.validate", function (e) {
                var event = window.event || e;
                // ignore tab & shift key 스킵
                if (!event.keyCode || event.keyCode == 9 || event.keyCode == 16) return;

                var _val = this.value;
                var returnObject = null;
                var vKey;
                axdom.each(Elem.config, function (k, v) {

                    //trace(k);

                    vKey = k;
                    var val = targetElem.val();
                    if (!validateFormatter(Elem, val, k, v, "realtime")) { // 값 검증 처리
                        returnObject = raiseError(Elem, val, k, v);
                        return false;
                    }
                });

                var responseResult = true;
                if (returnObject == null) {
                    Elem.__prevValue = _val;
                    Elem.realtime.response.call({ result: true });
                } else {
                    returnObject.result = false;
                    responseResult = Elem.realtime.response.call(returnObject);
                }



                if (responseResult == false) {
                    if (event.keyCode != AXUtil.Event.KEY_DELETE
                        && event.keyCode != AXUtil.Event.KEY_BACKSPACE
                        && event.keyCode != AXUtil.Event.KEY_LEFT
                        && event.keyCode != AXUtil.Event.KEY_RIGHT
                        ) {

                        if ((Elem.__prevValue || "").length > _val.length) {
                            this.value = "";
                        } else {
                            if (displayFormatter((Elem.__prevValue || ""), vKey) != "") this.value = displayFormatter((Elem.__prevValue || ""), vKey);
                        }

                        if (event.preventDefault) event.preventDefault();
                        if (event.stopPropagation) event.stopPropagation();
                        event.cancelBubble = true;
                        return false;
                    }
                } else {
                    //realtime에서 체크시 백시켜서 오류
                    if (displayFormatter(this.value, vKey) != "") this.value = displayFormatter(this.value, vKey);
                }

            });

        }
        // realtime 지원 함수 구문 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


        //trace(addedObject);

        // blur 지원
        if (addedObject.onblur) {
            targetElem.unbind("blur.validate").bind("blur.validate", function (e) {
                var returnObject = {result:true};
                axdom.each(Elem.config, function (k, v) {
                    var val = targetElem.val();
                    if (!validateFormatter(Elem, val, k, v, "")) {
                        returnObject = raiseError(Elem, val, k, v);
                        returnObject.config = Elem.config;
                        returnObject.result = false;
                        return false;
                    }
                });
                if(returnObject.result){
                    returnObject.element = Elem;
                    returnObject.value = targetElem.val();
                    returnObject.config = Elem.config;
                }
                var responseResult = Elem.onblur.call(returnObject);
            });
        }

    },

/**
 * @method AXValidator.del
 * @param {JSObject} - example code 참고
 * @description
 * validate 대상 아이템을 제거합니다.
 * @example
 ```
 myValidator.del( {id:"userID"});   //아이템식별자

 ```
 */
    del: function (delObj) {
        var cfg = this.config;
        var deledObject;

        var findIndex = null;
        if (delObj.id) {
            $.each(this.elements, function (eidx, elem) {
                if (this.id == delObj.id) {
                    findIndex = eidx;
                    return false;
                }
            });
        } else if (delObj.name) {
            $.each(this.elements, function (eidx, elem) {
                if (this.name == delObj.name) {
                    findIndex = eidx;
                    return false;
                }
            });
        }

        if (findIndex != null) {
            deledObject = this.elements[findIndex];
            $("#" + deledObject.id).unbind("keydown.validate");
            $("#" + deledObject.id).unbind("keyup.validate");
            $("#" + deledObject.id).unbind("blur.validate");
            this.elements.splice(findIndex, 1);
        }

        //trace(this.elements);
    },

    addElement: function (addObj, findIndex) {
        AXUtil.overwriteObject(this.elements[findIndex].config, addObj.config, true);
        if (addObj.onblur) this.elements[findIndex].onblur = addObj.onblur;
        if (addObj.realtime) this.elements[findIndex].realtime = addObj.realtime;
        if (addObj.message) this.elements[findIndex].message = addObj.message;
        if (addObj.label) this.elements[findIndex].label = addObj.label;
    },

/**
 * @method AXValidator.validate
 * @returns {boolean} - 정의된 규칙에 따라 (true|false) 로 결과를 리턴합니다.
 * @description
 * validate 처리결과를 리턴합니다.
 * @example
 ```
var validateResult = myValidator.validate();
 ```
 */
    validate: function (filterOption) {
        var cfg = this.config;
        var raiseError = this.raiseError.bind(this);
        var validateFormatter = this.validateFormatter.bind(this);

        var returnObject = null;
        for (var Elem, eidx= 0, __arr = this.elements; (eidx < __arr.length && (Elem = __arr[eidx])); eidx++) {
            var targetElem;
            if (Elem.id && !Elem.multi) {
                targetElem = axdom("#" + Elem.id);
            } else if (Elem.name) {
                targetElem = axdom( document[cfg.targetFormName][Elem.name] );
            }

	        if(Elem.name == "bizno") {
		        //alert(Elem.name);
		        //alert(document[cfg.targetFormName][Elem.name]);
	        }

            var isCheck = true;
            if(filterOption){
                if(filterOption.filterType == "include"){
                    isCheck = false;
                    for (var f, fidx= 0, __arr2 = filterOption.list; (fidx < __arr2.length && (f = __arr2[fidx])); fidx++) {
                        if(f.id && f.id == Elem.id){
                            isCheck = true;
                            break;
                        }else if(f.name && f.name == Elem.name){
                            isCheck = true;
                            break;
                        }
                    }
                }else{
                    isCheck = true;
                    for (var f, fidx= 0, __arr2 = filterOption.list; (fidx < __arr2.length && (f = __arr2[fidx])); fidx++) {
                        if(f.id && f.id == Elem.id){
                            isCheck = false;
                            break;
                        }else if(f.name && f.name == Elem.name){
                            isCheck = false;
                            break;
                        }
                    }
                }
            }

            if (targetElem && isCheck) {
	            var val = "";
	            if(Elem.type == "radio" || Elem.type == "checkbox"){
		            targetElem.each(function(){
			            if(this.checked){
				            if(val == "") val = this.value;
				            else val += "," + this.value;
			            }
		            });
	            }else{
		            val = targetElem.val();
	            }

                var _end = false;

                axdom.each(Elem.config, function (k, v) {
                    if (!validateFormatter(Elem, val, k, v, "")) { // 값 검증 처리
                        returnObject = raiseError(Elem, val, k, v);
                        _end = true;
                        return false;
                    }
                });
                if (_end) return false;
            }
        };

        if (returnObject == null) {
            this.errElements = [];
            return true;
        } else {
            return false;
        }

    },
    raiseError: function (elem, elemVal, validateKey, validateVal) {
        var messageConvert = this.messageConvert.bind(this);
        var message = messageConvert(elem, validateKey, validateVal);
        var returnObject = {
            element: elem,
            value: elemVal,
            validateKey: validateKey,
            validateVal: validateVal,
            message: message
        };
        this.errElements.push(returnObject);
        return returnObject;
    },
    messageConvert: function (elementObj, validateKey, validateVal) {
        var validateErrMessage = this.config.validateErrMessage;
        var vKey = "exception";
        var vVal = "";
        if (validateKey != undefined) vKey = validateKey;
        if (validateVal != undefined) vVal = validateVal;

        var element = elementObj;
        if (!element) {
            return null;
        }
        var label;
        if (element.label) {
            label = element.label.length > 0 ? element.label : (element.id || element.name);
        } else {
            label = (element.id || element.name);
        }

        if(vKey == "earlierThan" || vKey == "laterThan"){
            label = (validateVal.label||label);
        }

        var errMessage = validateErrMessage[vKey];
        if (element.message == undefined) {
            var typeMessage = errMessage;
        } else {
            var typeMessage = (element.message[vKey] || errMessage);
        }

        if (typeMessage != undefined) {
            var message = typeMessage.replace(/{label}/, label);
            message = message.replace("{" + vKey + "}", vVal);
        } else {
            message = "";
        }
        return message;
    },
    //-------------------- validate check - formatter - message Set [S] ----------------------
    validateCheckClass: {
        // element에서 클래스 검사 항목
        required: true,     //필수
        number: true,        //숫자 형식
        email: true,         //이메일 형식
        hangul: true,        //한글 형식
        engonly: true,       //영문 형식
        residentno: true,    //주민등록 번호 형식
        foreignerno: true,   //외국인 번호 형식
        bizno: true,         //사업자 등록 형식
        phone: true,         //전화번호 형식
        isdate: true,        //날짜 형식
        zip: true,           //우편번호 형식
        money: true          //',' 포함한 숫자
    },
    validateFormatter: function (Elem, ElemValue, validateKey, validateValue, realtime) {
        var cfg = this.config;
        var result = true;
        var lenMargin = 1; // 최소 최대 비교시 하나 커야 함.
        if (realtime == "realtime") lenMargin = 0; // realtime 실행 시는 마진 없음.
        try {

	        if (ElemValue != "" && validateKey == "residentno") {

	        }

            /* for element */
            if (validateKey == "required") {
                result = (ElemValue.trim() != "");
            } else if (ElemValue != "" && validateKey == "min") {
                result = (ElemValue.number() + lenMargin > validateValue);
            } else if (ElemValue != "" && validateKey == "max") {
                result = (ElemValue.number() - lenMargin <= validateValue);
            } else if (ElemValue != "" && validateKey == "minbyte") {
                result = (ElemValue.getByte().number() + lenMargin > validateValue);
            } else if (ElemValue != "" && validateKey == "maxbyte") {
                result = (ElemValue.getByte().number() - lenMargin <= validateValue);
            } else if (ElemValue != "" && validateKey == "minlength") {
                result = (ElemValue.length.number() >= validateValue);
            } else if (ElemValue != "" && validateKey == "maxlength") {
            	var crlfLength = 0;
            	if(cfg.checkCrlf){
            		var __matchedArr = ElemValue.match(/(\r\n|\n|\r)/g);
            		if(__matchedArr){
            			crlfLength = __matchedArr.length * 1;
            			trace(crlfLength);
            		}
            	}
                result = (ElemValue.length.number() + crlfLength <= validateValue);
                /* for format */
            } else if (ElemValue != "" && validateKey == "number") {
                //var pattern = /^[0-9]+$/;
                result = axdom.isNumeric(ElemValue.trim());
            } else if (ElemValue != "" && validateKey == "email") {
                var pattern = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
                result = pattern.test(ElemValue);
            } else if (ElemValue != "" && validateKey == "hangul") {
                var pattern = /^[가-힣0-9]+$/;
                result = pattern.test(ElemValue);
            } else if (ElemValue != "" && validateKey == "engonly") {
                var pattern = /^[a-zA-Z0-9_]+$/;
                result = pattern.test(ElemValue);
            } else if (ElemValue != "" && validateKey == "residentno") {


	            var pattern = /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-?[1-4][0-9]{6}$/;
	            var num = ElemValue;

	            //trace(pattern.test(num), "test");

	            if (!pattern.test(num)){
		            result = false;
	            }

	            function checkJumin(p_juminno) {
		            try {
			            // 파라미터로 전달받은 p_juminno가 공백이거나, 13자리를 넘어가거나, 숫자가 아닐경우 false 리턴
			            if(p_juminno == '' || p_juminno.length != 13 || typeof(Number(p_juminno)) != 'number') {
				            return false;
			            }

			            isKorean = true;
			            // 주민번호 뒷자리 첫번째 수가 4보다 크거나, 9보다 작으면 외국인
			            if(Number(p_juminno.charAt(6)) > 4 && Number(p_juminno.charAt(6)) < 9) {
				            isKorean = false;
			            }

			            // 아래부터는 검증 로직임.
			            var check = 0;
			            for(var i=0; i<12; i++) {
				            if(isKorean) {
					            check = check + ((i % 8 + 2) * Number(p_juminno.charAt(i)));
				            } else {
					            check = check + ((9 - i % 8) * Number(p_juminno.charAt(i)));
				            }
			            }
			            if(isKorean) {
				            check = 11 - (check % 11);
				            check = check % 10;
			            } else {
				            var remainder = check % 11;
				            if(remainder == 0) {
					            check = 1;
				            } else if(remainder==10) {
					            check = 0;
				            } else {
					            check = remainder;
				            }
				            var check2 = check + 2;
				            if(check2 > 9) {
					            check = check2 - 10;
				            } else {
					            check = check2;
				            }
			            }
			            if(check == Number(p_juminno.charAt(12))) {
				            return true;
			            } else {
				            return false;
			            }
		            } catch(e) {
			            alert(e.description);
		            }
	            }
	            if(result != false) {
		            result = checkJumin(num.replace(/\D/g, ""));
	            }
            } else if (ElemValue != "" && validateKey == "foreignerno") {
                var pattern = /^(\d{6})-?(\d{5}[7-9]\d{1})$/;
                var num = ElemValue;

	            if (!pattern.test(num)){
		            result = false;
	            }

	            if(result != false) {
		            num = RegExp.$1 + RegExp.$2;
		            //if ((num[7] * 10 + num[8]) % 2) return "foreignerno";

		            var sum = 0;
		            var last = num.charCodeAt(12) - 0x30;
		            var bases = "234567892345";
		            for (var i = 0; i < 12; i++) {
			            if (isNaN(num.substring(i, i + 1))) return "foreignerno";
			            sum += (num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
		            }
		            var mod = sum % 11;
		            result = ((11 - mod + 2) % 10 == last);
	            }

            } else if (ElemValue != "" && validateKey == "bizno") {
                var pattern = /([0-9]{3})-?([0-9]{2})-?([0-9]{5})/;
                var num = ElemValue;
	            if(num.replace(/\D/g, "").length != 10){
		            result = false;
	            }
	            if (!pattern.test(num)){
		            result = false;
	            }

                num = RegExp.$1 + RegExp.$2 + RegExp.$3;
	            if(result != false) {
		            var vencod = num, sum = 0, getlist = new Array(10), chkvalue = new Array("1", "3", "7", "1", "3", "7", "1", "3", "5");
		            for (var i = 0; i < 10; i++) { getlist[i] = vencod.substring(i, i + 1); }
		            for (var i = 0; i < 9; i++) { sum += getlist[i] * chkvalue[i]; }
		            sum = sum + parseInt((getlist[8] * 5) / 10);
		            sidliy = sum % 10;
		            sidchk = (sidliy != 0) ? 10 - sidliy : 0;
		            result = (sidchk != getlist[9]) ? false : true;
		            /*
		            var cVal = 0;
		            for (var i = 0; i < 8; i++) {
			            var cKeyNum = parseInt(((_tmp = i % 3) == 0) ? 1 : (_tmp == 1) ? 3 : 7);
			            cVal += (parseFloat(num.substring(i, i + 1)) * cKeyNum) % 10;
		            }
		            ;
		            var li_temp = parseFloat(num.substring(i, i + 1)) * 5 + "0";
		            cVal += parseFloat(li_temp.substring(0, 1)) + parseFloat(li_temp.substring(1, 2));
		            result = (parseInt(num.substring(9, 10)) == 10 - (cVal % 10) % 10);
		            */
	            }

            } else if (ElemValue != "" && validateKey == "phone") {
                if (realtime == "realtime") {
                    var pattern = /[\D]+/;
                    var num = ElemValue.replace(/\-/g, "");
                    result = pattern.test(num) ? false : true;
                } else {
                    var pattern = /^(0[2-8][0-5]?|01[01346-9])-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/;
                    var pattern15xx = /^(1544|1566|1577|1588|1644|1688)-?([0-9]{4})$/;
                    var patternHand = /^(01[01346-9])-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/;
                    var num = ElemValue;
                    result = pattern.test(num) || pattern15xx.test(num) || patternHand.test(num) ? true : false;
                }
            } else if (ElemValue != "" && validateKey == "isdate") {
                result = true;

                var iDate = ElemValue.replace(/-/g, "");
                if (iDate.length != 8) {
                    return result = false;
                }

                var oDate = new Date(parseInt(iDate.substr(0, 4), 10), parseInt(iDate.substr(4, 2), 10) - 1, parseInt(iDate.substr(6, 2), 10));
                if (oDate.getFullYear() != parseInt(iDate.substr(0, 4), 10)
                    || oDate.getMonth() != parseInt(iDate.substr(4, 2), 10)-1
                    || oDate.getDate() != parseInt(iDate.substr(6, 2), 10)) {
                    return result = false;
                }else{
                    return result = true;
                }
            } else if (ElemValue != "" && validateKey == "zip") {
                var pattern = /^[0-9]{3}\-[0-9]{3}$/;
                result = pattern.test(ElemValue);
            } else if (ElemValue != "" && validateKey == "money") {
                var value = ElemValue.replace(",").replace(".");
                //실제 money형식
                var pattern = /^\$?[0-9]+(,[0-9]{3})*(\.[0-9]*)?$/;
                //var pattern = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
                result = pattern.test(ElemValue);
            } else if (validateKey == "earlierThan") {
                if(ElemValue == ""){
                    result = true;
                }else{
                    var st_date = ElemValue;
                    var ed_date = axdom("#" + validateValue.id).val().trim();
                    if(ed_date != ""){
                        if (st_date.date().diff(ed_date) < 0) {
                            result = false;
                        }else{
                            result = true;
                        }
                    }else{
                        result = false;
                    }
                }
            } else if (validateKey == "laterThan") {
                if(ElemValue == ""){
                    result = true;
                }else{
                    var ed_date = ElemValue;
                    var st_date = axdom("#" + validateValue.id).val().trim();
                    if(st_date != ""){
                        //trace(st_date, ed_date, st_date.date());
                        if (st_date.date().diff(ed_date) < 0) {
                            result = false;
                        }else{
                            result = true;
                        }
                    }else{
                        result = false;
                    }
                }
            } else {
                if (axdom.isFunction(validateValue)) {
                    result = validateValue.call({
                        Elem: Elem,
                        ElemValue: ElemValue,
                        validateKey: validateKey
                    });
                }
            }
        } catch (e) {
            trace("validateFormatter-catch:662", e);
            result = false;
        }

        return result;
    },
    //-------------------- validate check - formatter - message Set [E] ----------------------
    //-------------------- validate static 지원 함수 Set [S] ---------------------------------
/**
 * @method AXValidator.getErrorMessage
 * @returns {string} - 에러메세지
 * @description
 * 에러메세지를 리턴합니다.
 * @example
 ```
var validateResult = myValidator.validate();
if (!validateResult) {
	var msg = myValidator.getErrorMessage();    //에러메세지를 리턴합니다.
	alert(msg);
	myValidator.getErrorElement().focus();      //에러가 발생된 엘리먼트를 리턴합니다.
	return false;
}else{
	alert( validateResult );
}
 ```
 */
    getErrorMessage: function (errorMessagePattern) {
        if (!this.errElements) {
            return null;
        }
        if (this.errElements.length == 0) {
            return "Err 메세지가 없습니다.";
        }
        var errObj = this.errElements.last();
        var errElement = errObj.element;
        var messageConvert = this.messageConvert.bind(this);
        var message = messageConvert(errElement, errObj.validateKey, errObj.validateVal);

        return message;
    },

/**
 * @method AXValidator.getErrorElement
 * @returns {HTMLElement} - 에러가 발생된 엘리먼트
 * @description
 * 에러가 발생된 엘리먼트를 리텀합니다.
 * @example
 ```
var validateResult = myValidator.validate();
if (!validateResult) {
	var msg = myValidator.getErrorMessage();    //에러메세지를 리턴합니다.
	alert(msg);
	myValidator.getErrorElement().focus();      //에러가 발생된 엘리먼트를 리턴합니다.
	return false;
}else{
	alert( validateResult );
}
 ```
 */
    getErrorElement: function () {
        var cfg = this.config;
        if (!this.errElements) {
            return null;
        }
        if (this.errElements.length == 0) {
            return null;
        }
        var errObj = this.errElements.last();
        var errElement = errObj.element;
        return axdom("#" + errElement.id).length > 0 ? axdom("#" + errElement.id) : axdom(document[cfg.targetFormName][errElement.name]);
    },
    getElement: function (elementObj) {
        var cfg = this.config;
        var element;
        try {
            if (elementObj.id) {
                element = AXgetId(elementObj.id);
            } else {
                element = document[cfg.targetFormName][elementObj.name];
            }
        } catch (e) {
            return false;
        }
        if (element == null) {
            AXUtil.alert((elementObj.id || elementObj.name) + " not found");
            return null;
        } else {
            return element;
        }
    },
    isActiveFormControl: function (element) {
        if (!element) return false;
        if (!(__rinput.test(element.type) || __rselectTextarea.test(element.type)) || element.disabled) return false;
        return true;
    },
    displayFormatter: function (elemValue, validateKey) {
        if (elemValue == "" || elemValue == null) return "";

        var value = elemValue;
        var dataFormat = "";

        if (value != "") {
            if (validateKey == "phone") {
                var pattern = /[^0-9]/g;
                var parintPattern = "";
                value = value.replace(pattern, "");

                //문자열 길이에 따른 값 처리
                if (value.length < 4) return value;
                if (value.length > 3 && value.length < 7) {
                    dataFormat = "$1-$2";
                    parintPattern = /([0-9]{3})([0-9]+)/;
                } else if (value.length == 7) {
                    dataFormat = "$1-$2";
                    parintPattern = /([0-9]{3})([0-9]{4})/;
                } else if (value.length == 9) {
                    dataFormat = "$1-$2-$3";
                    parintPattern = /([0-9]{2})([0-9]{3})([0-9]+)/;
                }
                else if (value.length == 10) {
                    if (value.substring(0, 2) == "02") {
                        dataFormat = "$1-$2-$3";
                        parintPattern = /([0-9]{2})([0-9]{4})([0-9]+)/;
                    } else {
                        dataFormat = "$1-$2-$3";
                        parintPattern = /([0-9]{3})([0-9]{3})([0-9]+)/;
                    }
                } else if (value.length > 10) {
                    dataFormat = "$1-$2-$3";
                    parintPattern = /([0-9]{3})([0-9]{4})([0-9]+)/;
                }
                value = value.replace(parintPattern, dataFormat);

            } else if (validateKey == "isdate") {
                var pattern = /[^0-9]/g;
                var parintPattern = "";

                value = value.replace(pattern, "");
                if (value.length < 4) return value;
                if (value.length > 4 && value.length < 7) {
                    dataFormat = "$1-$2";
                    parintPattern = /([0-9]{4})([0-9]+)/;
                } else if (value.length < 10) {
                    dataFormat = "$1-$2-$3";
                    parintPattern = /([0-9]{4})([0-9]{2})([0-9]+)/;
                }
                value = value.replace(parintPattern, dataFormat);
            }
            else {
                return "";
            }
        }

        return value;
    }
    //-------------------- validate static 지원 함수 Set [E] ---------------------------------
});