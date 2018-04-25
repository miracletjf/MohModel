/**
 * Created by MiracleTJF on 2018/3/27.
 */

/**
 *  Moh原型链（参照jquery原型链）
 *      1.调用 Moh()可以返回一个实例
 *      2.Moh自己是构造函数，可以显示的new出来
 *      3.实例的方法绑在原型链上
 * */

var Moh = function(selector) {
    return new Moh.fn.init(selector);
};

Moh.fn = Moh.prototype = {
    init: function (sel) {
        this.nu = 'nu';
        this.objs = [document];
        this.selector(sel);
    },
    selector : function (sel) {
        var _this = this;
        var selArr = sel.split(' ');
        for(var i =0 ;i<selArr.length ; i++){
            var stype = selArr[i].substr(0,1);
            var subStr = selArr[i].substring(1,selArr[i].length);
            var tempObjs = [];
            for(var j = 0 ;j<_this.objs.length; j++){
                if(stype === '#'){
                    tempObjs.push(document.getElementById(subStr));
                }else if(stype === '.'){
                    tempObjs = tempObjs.concat(classSelector(_this.objs[j],subStr));
                }
            }

            _this.objs = tempObjs;
        }

        function classSelector(obj,name) {
            var nodes = obj.childNodes;
            var objs = [];
            var nodeClassName;
            var nodeArr = [];

            for(var i=0;i<nodes.length;i++){
                if(nodes[i].nodeType === 1){
                    nodeClassName = nodes[i].className;
                    nodeArr = nodeClassName.split(' ');
                    if(nodeArr.indexOf(name) !== -1){
                        objs.push(nodes[i]);
                    }
                }
            }

            return objs;
        }
        console.log(sel);
    }
};

Moh.fn.init.prototype = Moh.fn;


/**
 *  function classHandler
 *  操作class
 * */
Moh.prototype.classHandler = function(effect,name) {
    var _this = this;
    var objs = _this.objs;
    console.log(objs);
    var clsName = objs[0].className;
    var clsAttr = clsName.split(' ');
    console.log(_this.nu);
    if(effect === 'add'){
        var index = clsAttr.indexOf(name);
        if(index === -1){
            clsName += ' '+name;
            for(var i = 0 ; i< objs.length;i++){
                objs[i].className = clsName;
            }
        }
    }else if(effect === 'remove'){
        var index = clsAttr.indexOf(name);
        if(index > -1){
            clsAttr.splice(index,1);
            clsName = clsAttr.join(' ');
            for(var i = 0 ; i< objs.length;i++){
                objs[i].className = clsName;
            }
        }
    }

    return _this;
}

/** tab切换 构造函数
 *  author: miracletjf
 *  date: 2018-4-8 16:52:09
 *  1.属性
 *    tabPs tab父级节点
 *    contPs 内容父级节点
 *    tabs  tab元素子节点所对应的下标数组
 *    conts 内容元素节点所对应的下标数组
 *  2.方法
 *    init() 初始化tab方法，实现tab切换功能
 * */
function TabsChange(tabsId,contentsId,callback){
    this.tabPs = document.getElementById(tabsId);
    this.contPs = document.getElementById(contentsId);
    this.tabs = [];
    this.conts = [];
    this.callback = callback;
}

TabsChange.prototype = {
    //构造函数
    constructor: TabsChange,

    init: function () {
        var that = this;
        var tabChilds = that.tabPs.childNodes;
        var contChilds = that.contPs.childNodes;

        that.domFilter(tabChilds,that.tabs);
        that.domFilter(contChilds,that.conts);
        var tab0 = that.addEvent(that,tabChilds,contChilds);
        tab0.click();


    },
    domFilter: function (nodes,objs) {
        for(var i = 0; i < nodes.length; i++){
            var nodeItem = nodes[i];

            if(nodeItem.nodeType == 1){
                objs.push(i);
            }
        }
    },
    addEvent: function (that,tabChilds,contChilds) {
        for(var i = 0;i<that.tabs.length;i++){
            (function (i) {

                tabChilds[that.tabs[i]].onclick = function () {

                    for(var j=0;j<that.conts.length;j++){

                        tabChilds[that.tabs[j]].className = tabChilds[that.tabs[j]].className.replace(/ active/,'');
                        if(i == j){
                            console.log(i);

                            tabChilds[that.tabs[j]].className = tabChilds[that.tabs[j]].className + ' active';
                            contChilds[that.conts[j]].style.display = 'block';
                        }else{
                            contChilds[that.conts[j]].style.display = 'none';
                        }
                    }

                    if(typeof that.callback == 'function'){
                        that.callback.call(this,i,contChilds[that.conts[i]]);
                    }
                }
            })(i);
        }
        return tabChilds[that.tabs[0]];
    }

}

/** appendHTML
 *  author: miracletjf
 *  date: 2018-4-9 10:46:33
 *  作用: 增加一个可在DOM中添加HTML的方法
 * */
HTMLElement.prototype.appendHTML = function (html) {
    var divTemp = document.createElement("div"),nodes = null,
        fragment = document.createDocumentFragment();
    divTemp.innerHTML = html;
    nodes = divTemp.childNodes;

    for(var i=0;i<nodes.length;i++){
        fragment.appendChild(nodes[i].cloneNode(true));
    }
    this.appendChild(fragment);
    //清理
    nodes = null;
    fragment = null;

};

/** 获取页面宽度，高度
 *  1.参数 win
 *    默认为当前的window对象，传入参数即可覆盖
 *  2.返回值
 *    返回一个对象
 *      width: 页面宽度
 *      height: 页面高度
 *
 * */

function getPageSize(win){
    var winObj = win || window;
    var pageWidth = winObj.innerWidth;
    var pageHeight = winObj.innerHeight;

    if(typeof pageWidth != 'number'){
        if(document.compatMode == "CSS1Compat"){
            pageWidth = winObj.document.documentElement.clientWidth;
            pageHeight = winObj.document.documentElement.clientHeight;
        }else {
           pageWidth = winObj.document.body.clientWidth;
           pageHeight = winObj.document.body.clientHeight;
        }
    }

    return {width:pageWidth,height:pageHeight};
}