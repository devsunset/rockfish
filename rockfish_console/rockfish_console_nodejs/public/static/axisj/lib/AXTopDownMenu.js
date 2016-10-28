/**
 * AXTopDownMenu
 * @class AXTopDownMenu
 * @extends AXJ
 * @version v1.29
 * @author tom@axisj.com
 * @logs
 "2013-03-12 오후 8:21:23",
 "2013-11-22 오후 6:03:35 - tom : parent item Addclass 추가",
 "2013-12-31 오후 2:06:06 - root : setTree 시 child node count check 추가",
 "2014-04-14 - tom : setTree 메소드 엘리먼트 준비전에 박스모델 가져오는 문제 딜레이로 해결",
 "2014-05-19 - tom : childMenu 오픈 위치 버그 픽스",
 "2014-05-20 - tom : parentMenu 너비 계산부 컨테이너에 적용",
 "2014-07-10 - tom : childMenu 오픈 위치 버그 픽스",
 "2014-11-20 - root : jQuery 독립우회코드 변경"
 "2015-02-22 tom : setTree로 메뉴 설정시 사용자 태그 이벤트예외 처리"
 "2015-03-09 tom : setHighLightMenu 기존 활성화 메뉴 제거 처리 구문 추가"
 "2015-12-07 tom : onclick 속성 확장
 "2016-03-27 tom : 메뉴 오픈 애니메이션 제거
 "2016-06-30 tom : tree의 최상위 아이템들에 isTop 속성 추가
 * @example
 ```js
 var myMenu = new AXTopDownMenu();
 myMenu.setConfig({
	menuBoxID:"menuBox",        //{string} - 메뉴타겟 엘리먼트 아이디
	parentMenu:{
		className:"parentMenu"  //[string] - 1단계 메뉴의 CSS 클래스
	},
	childMenu:{
		className:"childMenu",  //[String] - 2단계 메뉴의 CSS 클래스
		align:"center",         //[string] - ('left'|'center'|'right')
		valign:"top",           //[string] - ('top'|'bottom')
		margin:{top:0, left:0},     //[object] - {top:0, left:0}|{bottom:0, left:0}
		arrowClassName:"varrow2",   //[String] - 2단계 메뉴의 박스 화살표 CSS 클래스
		arrowMargin:{top:1, left:0} //[object] - {top:0, left:0}|{bottom:0, left:0}
	},
	childsMenu:{
		className:"childsMenu", //[String] - 3단계 메뉴 이상의 CSS 클래스
		align:"left",           //[string] - ('left'|'center'|'right')
		valign:"top",           //[string] - ('top'|'bottom')
		margin:{top:-4, left:0},        //[object] - {top:0, left:0}|{bottom:0, left:0}
		arrowClassName:"harrow",        //[String] - 3단계 메뉴의 박스 화살표 CSS 클래스
		arrowMargin:{top:13, left:1}    //[object] - {top:0, left:0}|{bottom:0, left:0}
	},
	// 메뉴 a 태그가 onclick 이 있으면 data-href, 없으면 href 가 됩니다
	onclick: function(item){}
});

 ```
 *
 */

var AXTopDownMenu = Class.create(AXJ, {
    initialize: function (AXJ_super) {
        AXJ_super();

        this.tree = [];
        this.poi = "";
        this.config.openType = "over";
        this.config.easing = {
            open: {duraing: 200, easing: "expoOut"},
            close: {duration: 200, easing: "expoOut"}
        };
        //this.config.menuBoxID = "menuBox";
        this.config.parentMenu = {
            className: "parentMenu"
        };
        this.config.childMenu = {
            className: "childMenu",
            arrowClassName: "varrow",
            align: "center",
            valign: "top",
            margin: {top: 10, left: 0, bottom: 0},
            arrowMargin: {top: 10, left: 0, bottom: 0}
        };
        this.config.childsMenu = {
            className: "childsMenu",
            arrowClassName: "harrow",
            align: "left",
            valign: "top",
            margin: {top: 10, left: 0, bottom: 0},
            arrowMargin: {top: 10, left: 0, bottom: 0}
        };
        this.config.parentOutResetChild = true;
        this.config.childOutClose = true;
        this.config.childOutCloseTime = 700;
    },
    init: function () {
        var cfg = this.config;

        if (cfg.menuBoxID) {
            this.menuBox = axdom("#" + cfg.menuBoxID);

            //서브 메뉴를 숨김 처리 합니다.
            this.menuBox.find("." + cfg.childMenu.className).hide();
            this.menuBox.find("." + cfg.childsMenu.className).hide();

            this.initParents();
            this.initChild();
            if (cfg.onComplete) cfg.onComplete.call(this);
        }
        else if (cfg.targetID) {

        }
        axdom(window).bind("resize", this.windowResize.bind(this));
    },
    windowResizeApply: function () {
        var cfg = this.config, menuBoxWidth = 0;
        axf.each(this.tree, function () {
            this.width = axdom("#" + this.id).outerWidth();
            this.height = axdom("#" + this.id).outerHeight();
            menuBoxWidth += axdom("#" + this.id).parent().outerWidth().number() + 2;
        });
        //trace(menuBoxWidth);
        //this.menuBox.css({width:menuBoxWidth});
    },
    /**
     * @method AXTopDownMenu.setTree
     * @param {jsObject} obj - example code 참고
     * @description
     * 메뉴타겟 엘리먼트 아이디 안에 메뉴 대상 HTML 엘리먼트가 있는 경우 자동으로 메뉴를 구성합니다. setTree 메소드는 타겟을 빈 노드로 선언하고 setTree 메소드를 통해 동적으로 메뉴를 구성하는 메소드입니다.
     * @example
     ```
     var sampleTreeItem = {
    label: "Bottom Menu",			//{string} - 메뉴의 라벨
    url: "http://www.axisj.com", 	//{string} - 연결URL
    addClass: "myMenuClass", 		//{string} - 메뉴아이템에 추가할 CSS 클래스
    cn: [sampleTreeItem, ...., sampleTreeItem]	//[array] - 자식 메뉴 Array
};

     var myMenu = new AXTopDownMenu();

     var tree = [
     {label:"Bottom Menu", url:"http://www.axisj.com", cn:[
       {label:"valign - bottom", url:"http://www.axisj.com"},
       {label:"margin - bootom", url:"http://www.axisj.com"},
       {label:"margin - top X", url:"http://www.axisj.com"}
   ]},
     {label:"Script Control Way", url:"http://www.axisj.com", cn:[
        {label:"Script Way Use setTree", url:"abhttp://www.axisj.comc"},
        {label:"setHighLightMenu", url:"http://www.axisj.com", cn:[
            {label:"first : String", url:"http://www.axisj.com"},
            {label:"second : Array", url:"http://www.axisj.com"},
            {label:"third : setHighLightOriginID", url:"http://www.axisj.com"}
        ]},
       {label:"myMenu2", url:"http://www.axisj.com"}
   ]},
     {label:"no Expand Menu", url:"http://www.axisj.combc"},
     {label:"no Expand Menu", url:"http://www.axisj.com"},
     {label:"no Expand Menu", url:"http://www.axisj.com"}
     ];
     myMenu.setTree(Tree);

     ```
     */
    setTree: function (tree) {
        var cfg = this.config;
        cfg.menuBoxID = cfg.targetID, _this = this;

        if (!this.menuBox) this.menuBox = axdom("#" + cfg.menuBoxID);

        var po = [];

        var treeFn = function (subTree) {
            axdom.each(subTree, function (pi, T) {
                po.push("<li>");
                var addClass = (T.cn && T.cn.length > 0 ) ? " class = \"" + cfg.childsMenu.hasChildClassName + "\"" : "";
                if (cfg.onclick) {
                    po.push("<a data-href=\"" + (T.url || cfg.href) + "\"" + addClass + " data-id=\"" + (T._id || "") + "\" id=\"" + (T._id || "") + "\" data-label=\"" + (T.label || "").dec().delHtml() + "\">" + (T.label || "").dec() + "</a>");
                }
                else {
                    po.push("<a href=\"" + (T.url || cfg.href) + "\"" + addClass + " id=\"" + (T._id || "") + "\">" + (T.label || "").dec() + "</a>");
                }
                if (T.cn && T.cn.length > 0) {
                    po.push("<div class=\"" + cfg.childsMenu.className + "\">");
                    po.push("	<ul>");
                    po.push(treeFn(T.cn));
                    po.push("	</ul>");
                    po.push("</div>");
                }
                po.push("</li>");
            });
        };

        po.push("<ul>");
        axdom.each(tree, function (pi, T) {
            var addClass = [];
            if (T.addClass) {
                addClass.push(T.addClass);
            }
            po.push("<li>");
            po.push("	<div class=\"" + cfg.parentMenu.className + " " + addClass.join(" ") + "\">");
            var addClass = (T.cn) ? " class = \"" + cfg.childMenu.hasChildClassName + "\"" : "";

            if (cfg.onclick) {
                po.push("<a data-href=\"" + (T.url || cfg.href) + "\"" + addClass + " data-is-top='true' data-id=\"" + (T._id || "") + "\" id=\"" + (T._id || "") + "\" data-label=\"" + (T.label || "").dec().delHtml() + "\">" + (T.label || "").dec() + "</a>");
            }
            else {
                po.push("<a href=\"" + (T.url || cfg.href) + "\"" + addClass + " id=\"" + (T._id || "") + "\">" + (T.label || "").dec() + "</a>");
            }

            if (T.cn && T.cn.length > 0) {
                po.push("<div class=\"" + cfg.childMenu.className + "\">");
                po.push("	<ul>");
                po.push(treeFn(T.cn));
                po.push("	</ul>");
                po.push("</div>");
            }
            po.push("	</div>");
            po.push("</li>");
        });
        po.push("</ul>");
        po.push("<div class=\"clear\"></div>");

        this.menuBox.empty();
        this.menuBox.append(po.join(''));

        if (cfg.onclick) {
            this.menuBox.find('[data-href]').bind("click", function () {
                cfg.onclick({
                    id: this.getAttribute("data-id"),
                    href: this.getAttribute("data-href"),
                    label: this.getAttribute("data-label"),
                    isTop : this.getAttribute("data-is-top")
                });

                if (this.getAttribute("data-href") != "#") {
                    _this.outChild();
                }
            });
        }

        //서브 메뉴를 숨김 처리 합니다.
        this.menuBox.find("." + cfg.childMenu.className).hide();
        this.menuBox.find("." + cfg.childsMenu.className).hide();

        setTimeout(function () {
            _this.initParents();
            _this.initChild();
            if (cfg.onComplete) cfg.onComplete.call(this);
        }, 300);
    },
    initParents: function () {
        var cfg = this.config;
        var parents = [], menuBoxWidth = 0;
        this.menuBox.find("." + cfg.parentMenu.className).each(function (pi, EL) {
            EL.id = cfg.menuBoxID + "_PM_" + pi;
            var _id = "";

            var ELA = axdom(EL).children("A");

            if (ELA.get(0).id) _id = axdom(EL).children("A").get(0).id;
            ELA.get(0).id = cfg.menuBoxID + "_PMA_" + pi;
            ELA.attr("data-axmenuid", _id);

            parents.push({
                _id: _id,
                id: EL.id,
                width: axdom(EL).outerWidth(),
                height: axdom(EL).outerHeight(),
                cn: [],
                coi: ""
            });
            menuBoxWidth += axdom(EL).parent().outerWidth().number() + 2;
        });
        this.tree = parents;
        //this.menuBox.css({width:menuBoxWidth});

        if (cfg.openType == "over") {
            this.menuBox.find("." + cfg.parentMenu.className + ">a").bind("mouseover", this.onoverParent.bind(this));
            this.menuBox.find("." + cfg.parentMenu.className + ">a").bind("focus", this.onoverParent.bind(this));
            this.menuBox.find("." + cfg.parentMenu.className + ">a").bind("click", this.onclickParent.bind(this));

            if (cfg.childOutClose) {
                var onoutChild = this.onoutChild.bind(this);
                this.menuBox.find("." + cfg.parentMenu.className + ">a").bind("mouseout", onoutChild);
            }
        }
        else if (cfg.openType == "click") {
            this.menuBox.find("." + cfg.parentMenu.className + ">a").bind("mouseover", this.onoverParent.bind(this));
            this.menuBox.find("." + cfg.parentMenu.className + ">a").bind("click", this.onclickParent.bind(this));
        }
    },
    onoverParent: function (event) {
        if (!this.active && this.config.openType == "click") return this;

        if (this.childObserver) clearTimeout(this.childObserver); //닫기 명령 제거
        var _this = this, cfg = this.config;

        var target = axf.get_event_target(event.target, {tagname: "a"});
        var poi = target.id.split(/\_/g).last();
        if (this.poi != "" && this.poi != poi) {
            axdom("#" + cfg.menuBoxID + "_PMA_" + this.poi).removeClass("on");
            axdom("#" + cfg.menuBoxID + "_PMC_" + this.poi).hide();
            if (cfg.parentOutResetChild) this.closeSubMenu(this.tree[this.poi]);
        }

        //slideDown check
        if (this.dfPoi != undefined) axdom("#" + cfg.menuBoxID + "_PMA_" + this.dfPoi).removeClass("on");
        axdom("#" + cfg.menuBoxID + "_PMA_" + poi).addClass("on");
        //trace("#" + cfg.menuBoxID + "_PMC_" + poi);

        var tgDiv = axdom("#" + cfg.menuBoxID + "_PMC_" + poi);
        if (this.tree[poi] && !this.tree[poi].divDim) {
            tgDiv.show();
            this.tree[poi].divDim = {width: tgDiv.outerWidth(), height: tgDiv.outerHeight()};
            if (this.tree[poi].height == null) {
                for (var index = 0; index < this.tree.length; index++) {
                    this.tree[index].height = axdom("#" + this.tree[index].id).outerHeight();
                }
                //trace(poi, this.tree[poi]);
            }
            var topDim = {width: this.tree[poi].width, height: this.tree[poi].height};

            /* subMenu positioning */
            if (cfg.childMenu.align == "center") {
                var posLeft = topDim.width / 2 - this.tree[poi].divDim.width / 2 + cfg.childMenu.margin.left;
            }
            else if (cfg.childMenu.align == "left") {
                var posLeft = 0 + cfg.childMenu.margin.left;
            }
            else if (cfg.childMenu.align == "right") {
                var posLeft = topDim.width - this.tree[poi].divDim.width + cfg.childMenu.margin.left;
            }
            if (cfg.childMenu.valign == "top") {
                var posTop = topDim.height + cfg.childMenu.margin.top;
                if (cfg.childMenu.float) {
                    tgDiv.css({top: posTop, left: posLeft});
                }
                else {
                    tgDiv.css({top: posTop, left: posLeft, width: this.tree[poi].divDim.width});
                }
            }
            else if (cfg.childMenu.valign == "bottom") {
                var posTop = topDim.height + cfg.childMenu.margin.bottom;
                if (cfg.childMenu.float) {
                    tgDiv.css({top: posTop, left: posLeft});
                }
                else {
                    tgDiv.css({top: "auto", bottom: posTop, left: posLeft, width: this.tree[poi].divDim.width});
                }
            }
            /* -------------------- */

            /* subMenu Arrow positioning */
            if (cfg.childMenu.arrowClassName) {
                var arrow = tgDiv.find("." + cfg.childMenu.arrowClassName);
                if (cfg.childMenu.align == "center") {
                    var aLeft = tgDiv.outerWidth() / 2 - arrow.outerWidth() / 2 + cfg.childMenu.arrowMargin.left;
                }
                else if (cfg.childMenu.align == "left") {
                    var aLeft = 0 + cfg.childMenu.arrowMargin.left;
                }
                else if (cfg.childMenu.align == "right") {
                    var aLeft = tgDiv.outerWidth() - arrow.outerWidth() + cfg.childMenu.arrowMargin.left;
                }
                if (cfg.childMenu.valign == "top") {
                    var aTop = -arrow.outerHeight() + cfg.childMenu.arrowMargin.top;
                    arrow.css({top: aTop, left: aLeft});
                }
                else if (cfg.childMenu.valign == "bottom") {
                    var aTop = -arrow.outerHeight() + cfg.childMenu.arrowMargin.bottom;
                    arrow.css({bottom: aTop, left: aLeft});
                }
            }
            /* -------------------- */

            tgDiv.hide();
            topDim = null;
            posTop = null;
            posLeft = null;
        }

        _this.overParentAnimate = true;
        tgDiv.show();
        /*
         tgDiv.fadeIn(
         {
         duration: cfg.easing.open.duration,
         easing: cfg.easing.open.easing,
         complete: function() {
         _this.overParentAnimate = false;
         }
         }
         );
         */

        this.poi = poi;
    },
    onclickParent: function (event) {
        var cfg = this.config;
        var target = axf.get_event_target(event.target, {tagname: "a"});
        var poi = target.id.split(/\_/g).last();

        if (!this.active) {

            this.active = true;
            this.activePoi = poi;
            this.onoverParent(event);

        } else {
            if (poi != this.activePoi) {
                this.active = true;
                this.activePoi = poi;
                this.onoverParent(event);
                return this;
            }

            this.active = false;
            axdom("#" + cfg.menuBoxID + "_PMA_" + this.poi).removeClass("on");
            axdom("#" + cfg.menuBoxID + "_PMC_" + this.poi).hide();

        }

    },
    initChild: function () {
        var cfg = this.config;
        var initChilds = this.initChilds.bind(this);
        var tree = this.tree;
        this.menuBox.find("." + cfg.parentMenu.className).each(function (pi, EL) {
            var child = axdom(EL).children("." + cfg.childMenu.className).get(0);
            if (child) {
                child.id = cfg.menuBoxID + "_PMC_" + pi;
                if (cfg.childMenu.arrowClassName) {
                    var arrow = axdom("<div class=\"" + cfg.childMenu.arrowClassName + "\"></div>");
                    axdom(child).prepend(arrow);
                }
                initChilds(child.id, tree[pi]);
            }
            else {

            }
        });
    },
    initChilds: function (cid, rTree) {
        var initChilds = this.initChilds.bind(this);
        var cfg = this.config;
        var tree = rTree.cn;

        var onoverChild = this.onoverChild.bind(this);
        var onoutChild = this.onoutChild.bind(this);
        //trace(cid);
        axdom("#" + cid + ">ul>li").each(function (pi, EL) {
            var linkA = axdom(EL).children("A");
            var _id = "";
            if (linkA.get(0).id) _id = linkA.get(0).id;
            linkA.get(0).id = cid.replace("PMC", "PMA") + "_" + pi;
            linkA.attr("data-axmenuid", _id);
            linkA.bind("mouseover", onoverChild);
            if (cfg.childOutClose && cfg.openType == "over") {
                linkA.bind("mouseout", onoutChild);
            }

            //axdom(EL).children("A").html(cid.replace("PMC", "PMA") + "_" + pi);
            var childDiv = axdom(EL).children("." + cfg.childsMenu.className).get(0);
            if (childDiv) {
                childDiv.id = cid + "_" + pi;

                if (cfg.childsMenu.arrowClassName) {
                    var arrow = axdom("<div class=\"" + cfg.childsMenu.arrowClassName + "\"></div>");
                    axdom(childDiv).prepend(arrow);
                }

                tree.push({
                    _id: _id,
                    id: cid + "_" + pi,
                    cn: [],
                    coi: ""
                });
                initChilds(cid + "_" + pi, tree[pi]);
            }
            else {
                tree.push({
                    _id: _id,
                    id: cid + "_" + pi,
                    cn: [],
                    coi: ""
                });
            }
        });
    },
    closeSubMenu: function (pitem) {
        if (!pitem) return;
        if (pitem.coi == "") return;
        var cfg = this.config;
        axdom("#" + pitem.coi).slideUp(
            {
                duration: cfg.easing.close.duration,
                easing: cfg.easing.close.easing,
                complete: function () {
                }
            }
        );
        pitem.coi = "";
        //하위 자식들의 poi 모두 닫기

        var closeAllSubMenu = function (stree) {
            axdom.each(stree, function () {
                if (this.coi != "") {
                    axdom("#" + this.coi).hide();
                }
                closeAllSubMenu(this.cn);
            });
        };
        closeAllSubMenu(pitem.cn);
    },
    onoverChild: function (event) {
        if (this.childObserver) clearTimeout(this.childObserver); //닫기 명령 제거
        var cfg = this.config;
        var target = axf.get_event_target(event.target, {tagname: "a"});
        var eid = target.id;
        var ids = target.id.split(/\_/g);
        var tree = this.tree;
        var item = {};
        var pitem = {};
        for (var a = 2; a < ids.length; a++) {
            if (a == ids.length - 2) {
                pitem = tree[ids[a]];
            }
            if (tree[ids[a]]) {
                if (tree[ids[a]].cn) {
                    item = tree[ids[a]];
                    tree = tree[ids[a]].cn;
                }
            }
        }

        if (pitem) {
            if (pitem.coi != "" && pitem.coi != item.id) {
                this.closeSubMenu(pitem);
            }
        }

        if (item) {
            if (item.id) {

                var tgDiv = axdom("#" + item.id);

                //slideDown check
                if (!item.divDim) {
                    axdom("#" + item.id).show();
                    item.divDim = {width: tgDiv.outerWidth(), height: tgDiv.outerHeight()};
                    var pDim = {
                        width: axdom("#" + eid).outerWidth(),
                        height: axdom("#" + eid).outerHeight(),
                        pos: axdom("#" + eid).position()
                    };

                    if (cfg.childsMenu.align == "left") {
                        var posLeft = pDim.width + cfg.childsMenu.margin.left;
                    }
                    else {
                        var posLeft = -item.divDim.width + cfg.childsMenu.margin.left;
                    }

                    if (cfg.childsMenu.valign == "top") {
                        var posTop = pDim.pos.top + cfg.childsMenu.margin.top;
                        tgDiv.css({top: posTop, left: posLeft, width: item.divDim.width});
                    }
                    else {
                        var posTop = (pitem.divDim.height - pDim.pos.top) - pDim.height + cfg.childsMenu.margin.bottom;
                        tgDiv.css({bottom: posTop, left: posLeft, width: item.divDim.width});
                    }

                    /* subMenu Arrow positioning */
                    if (cfg.childsMenu.arrowClassName) {

                        var arrow = tgDiv.find("." + cfg.childsMenu.arrowClassName);
                        if (cfg.childsMenu.align == "left") {
                            var aLeft = -arrow.outerWidth() + cfg.childsMenu.arrowMargin.left;
                        }
                        else {
                            var aLeft = tgDiv.outerWidth() - arrow.outerWidth() + cfg.childsMenu.arrowMargin.left;
                        }
                        if (cfg.childsMenu.valign == "top") {
                            var aTop = 0 + cfg.childsMenu.arrowMargin.top;
                            arrow.css({top: aTop, left: aLeft});
                        }
                        else if (cfg.childsMenu.valign == "bottom") {
                            var aTop = 0 + cfg.childsMenu.arrowMargin.bottom;
                            arrow.css({bottom: aTop, left: aLeft});
                        }
                    }
                    /* -------------------- */

                    tgDiv.hide();
                    pDim = null;
                    posTop = null;
                    posLeft = null;
                }

                tgDiv.fadeIn(
                    {
                        duration: cfg.easing.open.duration,
                        easing: cfg.easing.open.easing,
                        complete: function () {
                        }
                    }
                );
                if (pitem) pitem.coi = item.id.replace("PMA", "PMC");
            }

        }

    },
    onoutChild: function (event) {
        var cfg = this.config;
        var outChild = this.outChild.bind(this);
        this.childObserver = setTimeout(function () {
            outChild();
        }, cfg.childOutCloseTime);
    },
    outChild: function () {
        this.active = false;
        var cfg = this.config;
        this.closeSubMenu(this.tree[this.poi]);

        axdom("#" + cfg.menuBoxID + "_PMA_" + this.poi).removeClass("on");
        if (this.dfPoi != undefined) axdom("#" + cfg.menuBoxID + "_PMA_" + this.dfPoi).addClass("on");
        axdom("#" + cfg.menuBoxID + "_PMC_" + this.poi).slideUp(
            {
                duration: cfg.easing.close.duration,
                easing: cfg.easing.close.easing,
                complete: function () {
                }
            }
        );
    },
    setHighLightMenu: function (poi) {
        var cfg = this.config;
        this.menuBox.find(".parentMenu").removeClass("on");
        this.menuBox.find(".parentMenu a").removeClass("on");
        this.menuBox.find(".childMenu a").removeClass("on");

        if (axdom.isArray(poi)) {
            this.poi = this.dfPoi = poi;
            var tree = this.tree;
            axdom.each(poi, function (idx, T) {
                if (idx == 0) tree = tree[T.number()];
                else  tree = tree.cn[T.number()];
                if (tree) {
                    if (idx == 0) {
                        axdom("#" + tree.id).addClass("on");
                        axdom("#" + tree.id).children("A").addClass("on");
                    }
                    else {
                        axdom("#" + tree.id.replace("_PMC_", "_PMA_")).addClass("on");
                    }
                }
            });
        }
        else {
            this.poi = this.dfPoi = poi;
            axdom("#" + cfg.menuBoxID + "_PMA_" + this.dfPoi).addClass("on");
        }
    },
    /**
     * @method AXTopDownMenu.setHighLightOriginID
     * @param {string} - 메뉴 엘리먼트에 사용자가 정의한 ID
     * @description
     * 타겟 엘리먼트안에 Html 엘리먼트로 메뉴를 정의한 경우 엘리먼트 안에 사용자가 정의해 둔 아이디로 메뉴의 하이라이트를 처리해줍니다.
     * @example
     ```
     myMenu.setHighLightOriginID("ID1245");
     ```
     */

    setHighLightOriginID: function (_id) {
        var cfg = this.config;
        var tree = this.tree;
        var findedID = "";

        var treeFn = function (subTree) {
            axdom.each(subTree, function (idx, T) {
                if (T._id == _id) {
                    findedID = T.id;
                    return false;
                }
                else {
                    if (T.cn) treeFn(T.cn);
                }
            });
        };

        axdom.each(this.tree, function (idx, T) {
            if (T._id == _id) {
                findedID = T.id;
                return false;
            }
            else {
                if (T.cn) treeFn(T.cn);
            }
        });

        if (findedID) {
            this.findedID = findedID;
            var pos = findedID.split(/_PM[C]?_/g).last();
            var selectedMenus = pos.split(/_/g);
            this.setHighLightMenu(selectedMenus);
            return selectedMenus;
        } else {
            this.menuBox.find(".parentMenu").removeClass("on");
            this.menuBox.find(".parentMenu a").removeClass("on");
            this.menuBox.find(".childMenu a").removeClass("on");
        }

    },

    /**
     * @method AXTopDownMenu.setHighLightID
     * @param {array} - [0, 1] 와 같이 각 뎁스의 순번을 전달합니다.
     * @description
     * 메뉴의 포지션 값으로 포지션에 해당하는 메뉴를 하이라이트 처리해 줍니다.
     * @example
     ```
     myMenu.setHighLightMenu([2, 1]); // 3번째 아이템(1depth)의 2번째 아이템(2depth)을 하이라이트 처리합니다.
     ```
     */
    setHighLightID: function (_id) {
        var cfg = this.config;
        var tree = this.tree;
        var findedID = "";

        var treeFn = function (subTree) {
            axdom.each(subTree, function (idx, T) {
                if (T.id == _id) {
                    findedID = T.id;
                    return false;
                }
                else {
                    if (T.cn) treeFn(T.cn);
                }
            });
        };
        axdom.each(tree, function (idx, T) {
            if (T.id == _id) {
                findedID = T.id;
                return false;
            }
            else {
                if (T.cn) treeFn(T.cn);
            }
        });

        if (findedID) {
            this.findedID = findedID;
            var pos = findedID.split(/_PM[C]?_/g).last();
            var selectedMenus = pos.split(/_/g);
            this.setHighLightMenu(selectedMenus);
            return selectedMenus;
        }
    }
});