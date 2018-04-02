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