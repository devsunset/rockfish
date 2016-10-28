﻿/**
 * AXSearch
 * @class AXSearch
 * @extends AXJ
 * @version v1.30
 * @author tom@axisj.com
 * @logs
 "2013-06-04 오후 2:00:44 - tom@axisj.com",
 "2013-07-29 오전 9:35:19 - expandToggle 버그픽스 - tom",
 "2013-09-16 오후 9:59:52 - inputBox 의 경우 엔터 작동 - tom",
 "2013-11-12 오후 6:13:03 - tom : setItemValue bugFix",
 "2013-12-27 오후 4:55:15 - tom : Checkbox, radio onchange 버그픽스",
 "2014-05-21 - tom : mobile view mode 추가"
 "2014-10-20 - tom : tagBind event(keydown, keyup, change) 함수 연결기능 추가"
 "2014-10-30 - tom : type:button tag변경"
 "2014-11-11 - root : axdom 독립 우회 코드 변경"
 "2014-12-23 tom : 메소드 reset 추가"
 "2015-04-09 tom : AXSearch.setItemValue("selectbox", "open") 처럼 selectbox에 값을 부여 했을 때 버그 픽스"
 "2015-04-22 root : getItemHtml중 inputText, selectBox에 사용자 정의속성 추가할수 있게 수정 "
 "2015-05-03 tom : button 에 tag입력시 버그 픽스"
 "2015-05-26 root : inputText 타입에 사용자 클래스 추가 버그 픽스"
 "2015-05-26 root : inputText 타입에 onFocus event 추가"
 "2015-06-01 tom : submit 메소드 추가"
 "2015-07-22 tom : inputText onkeyup, onkeydown event 추가"
 *
 * @description
 *
 * ```js
 * var mySearch = new AXSearch();
 * myTree.setConfig(classConfig:JSObject);
 * ```
 */

/**
 * @method AXSearch.setConfig
 * @param {Object} config - searchConfig
 * @description
 * 선언된 클래스를 사용하기 위해 속성을 정의합니다.
 * @example
 * ```js
 * var mySearch = new AXSearch();
 * mySearch.setConfig({
 *     targetID:"AXSearchTarget",  //{string} - AXSearch 클래스 코딩이 처리될 HTML 엘리먼트 타겟아이디
 *     theme : "AXSearch",         //[string = "AXSearch"] - AXSearch 에 적용될 CSS Class 이름
 *     onsubmit: function(){       //[fn] - Function AXSearch 가 onsubmit 이벤트 발생되었을 때 연결되는 콜백함수
 *         fnObj.search1(); // 버튼이 선언되지 않았거나 submit 개체가 있는 경우 발동 합니다.
 *     },
 *     rows:[  //AXSearch 의 각 row는 배열로 정의합니다.
 *         {
 *             display:true,       //[boolean=true] - 해당 줄의 노출 여부. 숨겨진 row의 경우 사용자의 선택으로 활성화 처리할 수 있습니다.
 *             addClass:"gray",    //[string] - row에 추가될 CSS 클래스
 *             style:"",           //[string] - row에 추가될 CSS style
 *             list:[
 *                 {
 *                     label:"공개설정",   //[string] - 아이템 라벨
 *                     labelWidth:"100",   //[number] - 라벨너비
 *                     type:"link",        //[string] - 아이템 타입 ( link | checkBox | radioBox | selectBox | inputText | button | submit )
 *                     width:"",           //[number] - 아이템 너비
 *                     key:"openType",     //[string] - 아이템 유니크 키
 *                     addClass:"",        //[string] - 아이템 엘리먼트에 추가될 CSS 클래스
 *                     valueBoxStyle:"",   //[string] - 아이템 엘리먼트에 추가될 CSS style
 *                     value:"open",       //[string] - 아이템 value ( options 가 정의되는 아이템 link | checkBox | radioBox | selectBox 에는 정의할 수 없습니다 )
 *                     options:[       //select options
 *                         {optionValue:"all", optionText:"전체보기"},
 *                         {optionValue:"open", optionText:"공개"},
 *                         {optionValue:"close", optionText:"비공개"},
 *                         {optionValue:"close2", optionText:"비공개2", display:false},
 *                         {optionValue:"close3", optionText:"비공개3", display:false},
 *                         {optionValue:"close4", optionText:"비공개4", display:false}
 *                     ],
 *                     onChange: function(selectedObject, value){  //[fn] - onchange 이벤트 바인드
 *                     },
 *                     onClcik: function(selectedObject, value){  //[fn] - onclick 이벤트 바인드
 *                     }
 *                 }
 *             ]
 *         }
 *     ]
 * });
 * ```
 */

var AXSearch = Class.create(AXJ, {
    initialize: function(AXJ_super) {
        AXJ_super();
        this.formbindMethod = "script";
        this.config.theme = "AXSearch";
        this.config.viewMode = "dx";
    },
    init: function() {
        var cfg = this.config;
        if(Object.isUndefined(cfg.targetID)){
            trace("need targetID - setConfig({targetID:''})");
            return;
        }

        if (cfg.mediaQuery) {
            var _viewMode = "", clientWidth = axf.clientWidth();
            axf.each(cfg.mediaQuery, function (k, v) {
                if (Object.isObject(v)) {

                    if(v.min != undefined && v.max != undefined){
                        if (v.min <= clientWidth && clientWidth <= v.max) {
                            _viewMode = (k == "dx") ? "dx" : "mx";
                            return false;
                        }
                    }else{
                        if (v.min <= clientWidth) {
                            _viewMode = (k == "dx") ? "dx" : "mx";
                            return false;
                        }
                    }
                }
            });
            if (_viewMode != "") {
                cfg.viewMode = _viewMode;
            }
        }

        this.target = axdom("#"+cfg.targetID);

        // 스크립트 바인드 방식
        if(cfg.rows)
        {
            this.formbindMethod = "script";
            this.setBody();
            axdom(window).bind("resize", this.windowResize.bind(this));
        }

        // tagBind 방식
        else
        if(this.target.get(0).tagName.lcase() == "form")
        {
            this.formbindMethod = "tag";
            this.target.bind("submit", function(event){
                cfg.onsubmit();
                return false;
            });

            if(cfg.onkeydown) {
                if(cfg.keydown_check_classname){
                    this.target.find("."+cfg.keydown_check_classname).bind("keydown.axsearch", function (event) {
                        cfg.onkeydown(event);
                    });
                }
                else
                {
                    this.target.bind("keydown", function (event) {
                        cfg.onkeydown(event);
                    });
                }
            }
            if(cfg.onkeyup) {
                if(cfg.keyup_check_classname){
                    this.target.find("."+cfg.keyup_check_classname).bind("keyup.axsearch", function (event) {
                        cfg.onkeyup(event);
                    });
                }
                else
                {
                    this.target.bind("keyup", function (event) {
                        cfg.onkeyup(event);
                    });
                }
            }
            if(cfg.onreturn) {
                if(cfg.return_check_classname){
                    this.target.find("."+cfg.return_check_classname).bind("keydown.axsearch", function (event) {
                        if(event.keyCode == axf.Event.KEY_RETURN) cfg.onreturn(event);
                    });
                }
                else
                {
                    this.target.bind("keydown", function (event) {
                        if(event.keyCode == axf.Event.KEY_RETURN) cfg.onreturn(event);
                    });
                }
            }
            // onchange 연결
            if(cfg.onchange){
                if(cfg.change_check_classname){
                    this.target.find("."+cfg.change_check_classname).bind("change.axsearch", function (event) {
                        cfg.onchange(event);
                    });
                }
                else
                {
                    this.target.find("input, select, textarea").bind("change.axsearch", function(event){
                        cfg.onchange(event);
                    });
                }
            }
            // onfocus 연결
            if(cfg.onfocus){
                if(cfg.focus_check_classname){
                    this.target.find("."+cfg.focus_check_classname).bind("focus.axsearch", function (event) {
                        cfg.onfocus(event);
                    });
                }
                else
                {
                    this.target.find("input, select, textarea").bind("focus.axsearch", function(event){
                        cfg.onfocus(event);
                    });
                }
            }
        }
    },
    windowResizeApply: function () {
        var cfg = this.config;

        if (cfg.mediaQuery) {
            var _viewMode = "", clientWidth = axf.clientWidth();
            axf.each(cfg.mediaQuery, function (k, v) {
                if (Object.isObject(v)) {

                    if(v.min != undefined && v.max != undefined){
                        if (v.min <= clientWidth && clientWidth <= v.max) {
                            _viewMode = (k == "dx") ? "dx" : "mx";
                            return false;
                        }
                    }else{
                        if (v.min <= clientWidth) {
                            _viewMode = (k == "dx") ? "dx" : "mx";
                            return false;
                        }
                    }
                }
            });
            if (_viewMode != "") {
                cfg.viewMode = _viewMode;
            }
        }
        this.target.find("."+cfg.theme).removeClass("dx");
        this.target.find("."+cfg.theme).removeClass("mx");
        this.target.find("."+cfg.theme).addClass(cfg.viewMode);
    },
    getItemHtml: function(gr, itemIndex, item){
        var cfg = this.config;
        var po = [];
        var itemAddClass = [];
        var itemAddStyles = [];
        var poAttr = [];
        if(item.addClass) itemAddClass.push(item.addClass);
        if(item.style) itemAddStyles.push(item.style);
        if(item.addAttr){
            axdom.each(item.addAttr, function(idx, attr){
                poAttr.push(attr.attrKey + "=" + attr.attrValue);
            });
        }
        if(item.type == "label"){

            po.push("<div class=\"searchItem searchLabel ", itemAddClass.join(" "),"\" style=\"width:", (item.width||""),"px;text-align:", (item.align||"center"),";", itemAddStyles.join(''),"\">");
            po.push(item.value);
            po.push("</div>");

        }
        else
        if(item.type == "link"){

            po.push("<div class=\"searchItem searchLink ", itemAddClass.join(" "),"\" style=\"width:", (item.width||""),"px;text-align:", (item.align||"center"),";", itemAddStyles.join(''),"\">");
            po.push("<input type=\"hidden\" name=\"", item.key,"\" id=\"", cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key, "\" value=\"", item.value,"\" />");
            po.push("<label class=\"itemTable\">");
            if(item.label) {
                po.push("<span class=\"th\" style=\"min-width:", (item.labelWidth || 100), "px;\">");
                po.push(item.label);
                po.push("</span>");
            }else{
                //po.push("<span class=\"th none\">&nbsp;</span>");
            }
            po.push("<span class=\"td\" style=\"",(item.valueBoxStyle||""),"\" title=\"", (item.title||""),"\">");
            axdom.each(item.options, function(idx, Opt){
                if(idx > 0) po.push(" | ");
                var classOn = "";
                if(item.value == Opt.optionValue){
                    classOn = " on";
                    item.selectedIndex = idx;
                }
                po.push("<a href=\"#Axexec\" class=\"searchLinkItem", classOn, "\" id=\"", cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key + "_AX_" + idx, "\" title=\"", (Opt.title||""),"\">", Opt.optionText,"</a>");
            });
            po.push("</span>");
            po.push("</label>");
            po.push("</div>");

        }
        else
        if(item.type == "checkBox"){

            po.push("<div class=\"searchItem searchCheckbox ", itemAddClass.join(" "),"\" style=\"width:", (item.width||""),"px;text-align:", (item.align||"center"),";", itemAddStyles.join(''),"\">");
            po.push("<span class=\"itemTable\">");
            if(item.label) {
                po.push("<span class=\"th\" style=\"min-width:", (item.labelWidth || 100), "px;\">");
                po.push(item.label);
                po.push("</span>");
            }else{
                //po.push("<span class=\"th none\">&nbsp;</span>");
            }
            po.push("<span class=\"td\" style=\"",(item.valueBoxStyle||""),"\" title=\"", (item.title||""),"\">");

            var values = item.value.split(/,/g);
            axdom.each(item.options, function(idx, Opt){
                var isCheck = false;
                axdom.each(values, function(){
                    if(this == Opt.optionValue){
                        isCheck = true;
                        return false;
                    }
                });
                po.push("<input type=\"checkbox\" class=\"searchCheckboxItem ", itemAddClass.join(" "),"\" name=\"", item.key,"\" id=\"", cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key,"_AX_", idx, "\" title=\"", (Opt.title||""),"\" value=\"", Opt.optionValue,"\" ");
                if(isCheck) po.push(" checked=\"checked\" ");
                po.push(">");
                po.push("<label for=\"", cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key,"_AX_", idx, "\">", Opt.optionText," </label>");
            });

            po.push("</span>");
            po.push("</span>");
            po.push("</div>");

        }
        else
        if(item.type == "radioBox"){

            po.push("<div class=\"searchItem searchCheckbox ", itemAddClass.join(" "),"\" style=\"width:", (item.width||""),"px;text-align:", (item.align||"center"),";", itemAddStyles.join(''),"\">");
            po.push("<label class=\"itemTable\">");
            if(item.label) {
                po.push("<span class=\"th\" style=\"min-width:", (item.labelWidth || 100), "px;\">");
                po.push(item.label);
                po.push("</span>");
            }else{
                //po.push("<span class=\"th none\">&nbsp;</span>");
            }
            po.push("<span class=\"td\" style=\"",(item.valueBoxStyle||""),"\" title=\"", (item.title||""),"\">");

            var values = item.value.split(/,/g);
            axdom.each(item.options, function(idx, Opt){
                var isCheck = false;
                axdom.each(values, function(){
                    if(this == Opt.optionValue){
                        isCheck = true;
                        return false;
                    }
                });
                po.push("<input type=\"radio\" class=\"searchCheckboxItem ", itemAddClass.join(" "),"\" name=\"", item.key,"\" id=\"", cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key,"_AX_", idx,"\" title=\"", (item.title||""),"\" value=\"", Opt.optionValue,"\" ");
                if(isCheck) po.push(" checked=\"checked\" ");
                po.push(">");
                po.push("<label for=\"", cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key,"_AX_", idx,"\">", Opt.optionText," </label>");
            });

            po.push("</span>");
            po.push("</label>");
            po.push("</div>");

        }else if(item.type == "selectBox"){

            po.push("<div class=\"searchItem searchSelectbox ", itemAddClass.join(" "),"\" style=\"text-align:", (item.align||"center"),";", itemAddStyles.join(''),"\">");
            po.push("<label class=\"itemTable\">");
            if(item.label) {
                po.push("<span class=\"th\" style=\"min-width:", (item.labelWidth || 100), "px;\">");
                po.push(item.label);
                po.push("</span>");
            }else{
                //po.push("<span class=\"th none\">&nbsp;</span>");
            }
            po.push("<span class=\"td selectBox\" style=\"",(item.valueBoxStyle||""),"\" title=\"", (item.title||""),"\">");
            var selectWidth = (item.width) ? item.width+"px" : "auto";
            po.push("	<select name=\"", item.key,"\" id=\"", cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key, "\" title=\"", (item.title||""),"\" class=\"AXSelect searchSelectboxItem ", itemAddClass.join(" "),"\" style=\"width:", selectWidth,";\" "+poAttr.join(' ')+" >");

            var values = item.value.split(/,/g);
            axdom.each(item.options, function(idx, Opt){
                var isCheck = false;
                axdom.each(values, function(){
                    if(this == Opt.optionValue){
                        isCheck = true;
                        return false;
                    }
                });

                po.push("<option value=\"", Opt.optionValue,"\"");
                if(isCheck) po.push(" selected=\"selected\"");
                po.push(">", Opt.optionText, "</option>");
            });
            po.push("	</select>");
            po.push("</span>");
            po.push("</label>");
            po.push("</div>");

        }else if(item.type == "inputText"){

            po.push("<div class=\"searchItem ", itemAddClass.join(" "),"\" style=\"text-align:", (item.align||"center"),";", itemAddStyles.join(''),"\">");
            po.push("<label class=\"itemTable\">");
            if(item.label) {
                po.push("<span class=\"th\" style=\"min-width:", (item.labelWidth || 100), "px;\">");
                po.push(item.label);
                po.push("</span>");
            }else{
                //po.push("<span class=\"th none\">&nbsp;</span>");
            }
            po.push("<span class=\"td inputText\" style=\"",(item.valueBoxStyle||""),"\" title=\"", (item.title||""),"\">");
            var inputWidth = (item.width||100).number();
            po.push("				<input type=\"text\" name=\"", item.key,"\" id=\"", cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key, "\" title=\"", (item.title||""),"\" placeholder=\""+ (item.placeholder||"") +"\" value=\"", item.value,"\" class=\"AXInput searchInputTextItem ", itemAddClass.join(" "),"\" style=\"width:", inputWidth,"px;\" "+poAttr.join(' ')+" />");
            po.push("</span>");
            po.push("</label>");
            po.push("</div>");

        }else if(item.type == "hidden"){
            po.push("<input type=\"hidden\" name=\"", item.key,"\" id=\"", cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key, "\" value=\"", item.value,"\" />");
        }else if(item.type == "button" || item.type == "submit"){
            po.push("<div class=\"searchItem ", itemAddClass.join(" "),"\" style=\"text-align:", (item.align||"center"),";", itemAddStyles.join(''),"\">");
            po.push("<label class=\"itemTable\">");
            if(item.label) {
                po.push("<span class=\"th\" style=\"min-width:", (item.labelWidth || 100), "px;\">");
                po.push(item.label);
                po.push("</span>");
            }else{
                //po.push("<span class=\"th none\">&nbsp;</span>");
            }
            po.push("<span class=\"td button\" style=\"",(item.valueBoxStyle||""),"\" title=\"", (item.title||""),"\">");
            var inputWidth = (item.width||100).number();
            po.push("<button type=\""+ item.type +"\" id=\"", cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key, "\" title=\"", (item.title||""),"\" placeholder=\"", (item.placeholder||""),"\" style=\"width:", inputWidth,"px;\" class=\"AXButton searchButtonItem ", itemAddClass.join(" "),"\">", item.value,"</button>");
            po.push("</span>");
            po.push("</label>");
            po.push("</div>");
        }
        return po.join('');
    },
    setBody: function(){
        var cfg = this.config;
        var getItemHtml = this.getItemHtml.bind(this);
        var po = [];
        var AXBinds = [];

        po.push("<div class=\"" + cfg.theme + " " + cfg.viewMode + "\">");
        po.push("<form name=\"", cfg.targetID+"_AX_form", "\" onsubmit=\"return false;\">");
        var gr = 0;
        var hasHide = false;
        for(;gr<cfg.rows.length;){
            var styles = [];
            var classs = [];
            if(!cfg.rows[gr].display){
                styles.push("display:none;");
                classs.push("expandGroup");
                hasHide = true;
            }
            if(cfg.rows[gr].addClass) classs.push(cfg.rows[gr].addClass);
            po.push("<div class=\"searchGroup ", classs.join(" "),"\" style=\"", styles.join(";"),"\">");
            axdom.each(cfg.rows[gr].list, function(itemIndex, item){
                po.push(getItemHtml(gr, itemIndex, item));
                if(item.AXBind){
                    AXBinds.push({display:cfg.rows[gr].display, gr:gr, itemIndex:itemIndex, item:item});
                }
                po.push("<div class=\"itemClear\"></div>");
            });
            po.push("<div class=\"groupClear\"></div>");
            po.push("</div>");
            gr++;
        }
        if(hasHide){
            po.push("<a href=\"#axexec\" class=\"expandHandle\" id=\"",cfg.targetID,"_AX_expandHandle\">");
            po.push("상세검색");
            po.push("</a>");
        }
        po.push("</form>");
        po.push("</div>");

        this.target.html(po.join(''));

        if(cfg.onsubmit){
            document[cfg.targetID+"_AX_form"].onsubmit = function(){
                cfg.onsubmit();
                return false;
            };
        }

        axdom("#"+cfg.targetID+"_AX_expandHandle").bind("click", this.expandToggle.bind(this));
        this.target.find(".searchLinkItem").bind("click", this.onclickLinkItem.bind(this));
        this.target.find(".searchCheckboxItem").bind("click", this.onclickCheckboxItem.bind(this));
        this.target.find(".searchSelectboxItem").bind("change", this.onChangeSelect.bind(this));
        this.target.find(".searchInputTextItem").bind("change", this.onChangeInput.bind(this));
        this.target.find(".searchButtonItem").bind("click", this.onclickButton.bind(this));

        this.target.find(".searchInputTextItem").bind("focus", this.onFocusInput.bind(this));
	    this.target.find(".searchInputTextItem").bind("keydown", this.onKeyDownInput.bind(this));
	    this.target.find(".searchInputTextItem").bind("keyup", this.onKeyUpInput.bind(this));

        this.AXBinds = AXBinds;

        var _this = this;
        setTimeout(function(){
            _this.AXBindItems();
        }, 10);
    },
    AXBindItems: function(){
        var cfg = this.config;
        axdom.each(this.AXBinds, function(){
            var gr = this.gr, itemIndex = this.itemIndex, item = this.item;
            var display = this.display;
            var itemID = cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key;

            if(display){
                if(item.AXBind.type == "selector"){
                    axdom("#"+itemID).bindSelector(item.AXBind.config);
                }else if(item.AXBind.type == "select"){
                    try{
                        axdom("#"+itemID).bindSelect(item.AXBind.config);
                    }catch(e){
                    }
                }else if(item.AXBind.type == "date"){
                    axdom("#"+itemID).bindDate(item.AXBind.config);
                }else if(item.AXBind.type == "twinDate"){
                    var startTargetID = item.AXBind.config.startTargetID;
                    var findItemID = "";
                    axdom.each(cfg.rows, function(gidx, G){
                        axdom.each(this.list, function(itemIndex, item){
                            if(item.key == startTargetID){
                                findItemID = cfg.targetID + "_AX_" + gidx + "_AX_" + itemIndex + "_AX_" + item.key;
                            }
                        });
                    });
                    item.AXBind.config.startTargetID = findItemID;
                    axdom("#"+itemID).bindTwinDate(item.AXBind.config);
                }
            }
        });
    },
    expandToggle: function(){
        var cfg = this.config;
        if(this.expanded){
            axdom("#"+cfg.targetID+"_AX_expandHandle").html("상세검색");
            this.target.find(".expandGroup").hide();
            this.expanded = false;
        }else{
            axdom("#"+cfg.targetID+"_AX_expandHandle").html("상세검색창 닫기");
            this.target.find(".expandGroup").show();
            this.expanded = true;

            axdom.each(this.AXBinds, function(){
                var gr = this.gr, itemIndex = this.itemIndex, item = this.item;
                var display = this.display;
                var itemID = cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key;
                if(!display){
                    if(item.AXBind.type == "selector"){
                        axdom("#"+itemID).bindSelector(item.AXBind.config);
                    }else if(item.AXBind.type == "select"){
                        axdom("#"+itemID).bindSelect(item.AXBind.config);
                    }else if(item.AXBind.type == "date"){
                        axdom("#"+itemID).bindDate(item.AXBind.config);
                    }else if(item.AXBind.type == "twinDate"){

                        var startTargetID = item.AXBind.config.startTargetID.split(/_AX_/g).last();
                        var findItemID = "";
                        axdom.each(cfg.rows, function(gidx, G){
                            axdom.each(this.list, function(itemIndex, item){
                                if(item.key == startTargetID){
                                    findItemID = cfg.targetID + "_AX_" + gidx + "_AX_" + itemIndex + "_AX_" + item.key;
                                }
                            });
                        });

                        item.AXBind.config.startTargetID = findItemID;
                        axdom("#"+itemID).bindTwinDate(item.AXBind.config);

                    }
                }
            });

        }
    },
    onclickLinkItem: function(event){
        var cfg = this.config;
        var ids = (event.target.id).split(/_AX_/g);
        var index = ids.pop();
        var gr = ids[ids.length-3];
        var itemIndex = ids[ids.length-2];
        var item = cfg.rows[gr].list[itemIndex];
        //trace({itemIndex:itemIndex, item:item});

        var targetID = "";
        axdom.each(ids, function(ii, io){
            if(ii > 0) targetID += "_AX_";
            targetID += this;
        });
        //trace(item.options[index].optionValue);

        if(item.selectedIndex != undefined){
            axdom("#"+targetID+"_AX_"+item.selectedIndex).removeClass("on");
        }

        item.selectedIndex = index;
        item.value = item.options[index].optionValue;
        axdom("#"+targetID+"_AX_"+index).addClass("on");
        axdom("#"+targetID).val(item.options[index].optionValue);

        if(item.onChange){
            item.onChange.call(item, item.options[index], item.options[index].optionValue);
        }
    },
    onclickCheckboxItem: function(event){
        var cfg = this.config;
        var ids = (event.target.id).split(/_AX_/g);
        var index = ids.pop();
        var gr = ids[ids.length-3];
        var itemIndex = ids[ids.length-2];
        var item = cfg.rows[gr].list[itemIndex];

        var frm = document[cfg.targetID+"_AX_form"];
        var selectedIndex = 0;
        var selectedValue = "";

        if(isNaN(frm[item.key].length)){
            if(frm[item.key].checked){
                selectedValue = frm[item.key].value;
            }
        }else{
            for(var i=0;i<frm[item.key].length;i++){
                if(frm[item.key][i].checked){
                    selectedValue += (selectedValue == "") ? frm[item.key][i].value : "," + frm[item.key][i].value;
                }
            }
        }

        item.selectedIndex = index;
        item.value = selectedValue;

        if(item.onChange){
            item.onChange.call(item, item.options[index], selectedValue);
        }
    },
    onChangeSelect: function(event){
        var cfg = this.config;
        var ids = (event.target.id).split(/_AX_/g);
        var gr = ids[ids.length-3];
        var itemIndex = ids[ids.length-2];
        var item = cfg.rows[gr].list[itemIndex];

        var frm = document[cfg.targetID+"_AX_form"];
        var selectedIndex = frm[item.key].selectedIndex;
        var selectedValue = frm[item.key].options[selectedIndex].value;

        if(item.onChange){
            item.onChange.call(item, item.options[selectedIndex], selectedValue);
        }
    },
    onChangeInput: function(event){
        var cfg = this.config;
        var ids = (event.target.id).split(/_AX_/g);
        var gr = ids[ids.length-3];
        var itemIndex = ids[ids.length-2];
        var item = cfg.rows[gr].list[itemIndex];

        var frm = document[cfg.targetID+"_AX_form"];
        var changeValue = frm[item.key].value;

        if(item.onChange){
            item.onChange.call(item, changeValue);
        }
    },
    onFocusInput: function(event){
        var cfg = this.config;
        var ids = (event.target.id).split(/_AX_/g);
        var gr = ids[ids.length-3];
        var itemIndex = ids[ids.length-2];
        var item = cfg.rows[gr].list[itemIndex];

        var frm = document[cfg.targetID+"_AX_form"];
        var focusValue = frm[item.key].value;

        if(item.onFocus){
            item.onFocus.call(item, focusValue, frm[item.key]);
        }
    },
    onclickButton: function(event){
        var cfg = this.config;
        var target = axf.get_event_target(event.target, function(el){
            if((el.tagName||"").ucase() == "BUTTON"){
                return true;
            }
        });
        if(target){
            var ids = (target.id).split(/_AX_/g);
            var gr = ids[ids.length-3];
            var itemIndex = ids[ids.length-2];
            var item = cfg.rows[gr].list[itemIndex];

            if(item.onclick){
                item.onclick.call(item);
            }
        }
    },
	onKeyDownInput: function(event){
		var cfg = this.config;
		var ids = (event.target.id).split(/_AX_/g);
		var gr = ids[ids.length-3];
		var itemIndex = ids[ids.length-2];
		var item = cfg.rows[gr].list[itemIndex];

		var frm = document[cfg.targetID+"_AX_form"];
		var changeValue = frm[item.key].value;

		if(item.onkeydown){
			item.onkeydown.call(item, event, changeValue);
		}
	},
	onKeyUpInput: function(event){
		var cfg = this.config;
		var ids = (event.target.id).split(/_AX_/g);
		var gr = ids[ids.length-3];
		var itemIndex = ids[ids.length-2];
		var item = cfg.rows[gr].list[itemIndex];

		var frm = document[cfg.targetID+"_AX_form"];
		var changeValue = frm[item.key].value;

		if(item.onkeyup){
			item.onkeyup.call(item, event, changeValue);
		}
	},
    /**
     * @method AXSearch.getParam
     * @returns {string}
     * @description 파라미터 형태로 값을 반환합니다.
     * @example
     * ```js
     * var pars = mySearch.getParam();
     * trace(pars);
     * // a=11&b=22&c=33
     * ```
     */
    getParam: function(){
        var cfg = this.config;
        var frm = (this.formbindMethod == "script") ? document[cfg.targetID+"_AX_form"] : this.target;
        return axdom(frm).serialize();
    },
    /**
     * @method AXSearch.reset
     * @returns {AXSearch}
     * @description search폼 입력 정보를 리셋합니다.
     * @example
     * ```js
     * mySearch.reset();
     * ```
     */
    reset: function(){
        var cfg = this.config;
        var frm = (this.formbindMethod == "script") ? document[cfg.targetID+"_AX_form"] : this.target;
        axdom(frm).get(0).reset();

        axdom(frm).find("[data-axbind=select]").bindSelectUpdate();
        //.trigger("change");

        return this;
    },

    /**
     * @method AXSearch.getItemId
     * @param {String} key - item key name
     * @description AXSearch내 엘리먼트 id를 반환합니다.
     * @example
     * ```js
     * mySearch.getItemId("type");
     * // element id;
     * ```
     */
    getItemId: function(key, value){
        var cfg = this.config;
        var gr = 0;
        var itemID;
        for(;gr<cfg.rows.length;){
            axdom.each(cfg.rows[gr].list, function(itemIndex, item){
                if(item.key == key){
                    if(item.type == "checkBox" || item.type == "radioBox"){
                        itemID = [];
                        axdom.each(item.options, function(idx, Opt){
                            itemID.push(cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key + "_AX_" + idx);
                        });
                    }else{
                        itemID = cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key;
                        return false;
                    }
                }
            });
            gr++;
        }
        return itemID;
    },
    /**
     * @method AXSearch.setItemValue
     * @param {String} key - item key name
     * @param {String|Array} value - item key name
     * @description 단일 속성인 대상에는 String, 다중 속성인 대상에는 Array 로 값을 지정할 수 있습니다. value 가 지정되지 않은 경우 빈 값으로 처리합니다.
     * @example
     * ```js
     * mySearch.setItemValue("checkbox", ["all","open"]);
     * mySearch.setItemValue("radiobox");
     * mySearch.setItemValue("inputText2"); // 빈값을 입력함으로써 입력된 값을 지울 수 있습니다.
     * ```
     */
    setItemValue: function(key, value){
        var cfg = this.config;
        var gr = 0;
        for(;gr<cfg.rows.length;){
            axdom.each(cfg.rows[gr].list, function(itemIndex, item){
                if(item.key == key){
                    if(item.type == "checkBox" || item.type == "radioBox"){
                        var values = [];
                        if(Object.isArray(value)){
                            values = value;
                        }else if(value == ""){

                        }else{
                            values.push(value);
                        }
                        axdom.each(item.options, function(idx, Opt){
                            var itemID = cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key + "_AX_" + idx;
                            var isCheck = false;
                            axdom.each(values, function(){ if(this == Opt.optionValue){ isCheck = true; return false; } });
                            AXgetId(itemID).checked = isCheck;
                            itemID = null;
                        });
                    }
                    else
                    if(item.type == "selectBox"){
                        var itemID = cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key;
                        var item_dom = axdom("#"+itemID);
                        if(item_dom.attr("data-axbind")){
                            item_dom.bindSelectSetValue((value||""));
                        }else{
                            item_dom.val((value||""));
                        }
                    }
                    else
                    {
                        var itemID = cfg.targetID + "_AX_" + gr + "_AX_" + itemIndex + "_AX_" + item.key;
                        axdom("#"+itemID).val((value||""));
                        itemID = null;
                    }
                }
            });
            gr++;
        }
    },

	/**
	 * @method AXSearch.submit
	 */
	submit: function(){
		var cfg = this.config;
		if(cfg.onsubmit) cfg.onsubmit();
		return this;
	}
});