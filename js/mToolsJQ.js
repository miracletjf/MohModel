/** 顶部导航
 *  author: miracletjf
 *  data: 2018-4-10 13:27:27
 *  1 属性
 *    id: 导航所在的父级id
 *    data: 导航数据（name,url）
 *    callback: 点击以后的回调
 *  2 方法
 *    init: 初始化
 *    createDemo:创建dom元素
 *    addEvent: 增加点击事件
 *
 * */
function TopNav(id,data,callback) {
    this.id = id;
    this.data = data;
    this.callback = callback;
}

TopNav.prototype = {
    constructor : TopNav,
    init: function () {
        var _this = this;
        var ulObj = _this.createDom(_this.id,_this.data);
        _this.addEvent(ulObj);
    },
    createDom : function (id,data) {
        var navHtml = '<ul>';
        for(var i=0;i<data.length;i++) {
            var dataLi = data[i];
            navHtml += '<li class="f-ib"><span class="item" dataUrl="'+dataLi.url+'">'+dataLi.name+'</span></li>';
        }
        navHtml += '</ul>';
        return $(navHtml).appendTo($('#'+id));
    },
    addEvent: function (obj) {
        var _this =  this;
        var $obj = obj;
        $obj.on('click','.item',function (e) {
            $(this).addClass('active').parent().siblings().find('.item').removeClass('active');
            if(typeof _this.callback === 'function'){
                _this.callback.call(this);
            }
            e.stopPropagation();
        });
    }
}

/** 侧边栏导航
 *  author: miracletjf
 *  date: 2018-4-8 16:52:20
 *  1 属性
 *    data 数据
 *    id 所在容器id
 *  2.方法
 *    init() 调用内部方法生成菜单
 *    createDom() 创建dom元素
 *    addClickEvent() 点击展开，选中事件
 * */
function SlideNav(id,data) {
    this.data = data;
    this.id = id;
}

SlideNav.prototype = {
    constructor : SlideNav,
    init : function () {
        var _this = this;
        var obj = document.getElementById(_this.id);
        if(obj.innerHTML.replace(/\W/g,'') === ''){
            _this.createDom(obj);
            _this.addClickEvent(obj);
        }else {
            _this.createDom(obj);
        }
    },
    createDom : function (obj) {
        var _this = this;
        var dataTemp = _this.data;
        var subData;
        var hrefStr = 'javascript:void(0);';
        var htmlStr = '<ul class="m-left-nav">';
        for(var i=0;i<dataTemp.length;i++){
            if(dataTemp[i].href){
                hrefStr = dataTemp[i].href;
            }
            htmlStr +='<li class="item"><a  href="'+hrefStr+'" target="main_frame"><i class="glyphicon glyphicon-folder-open"></i>'+dataTemp[i].name+'</a>';
            hrefStr = 'javascript:void(0);';

            if(dataTemp[i].sub){
                htmlStr += '<ul class="sub-nav">';
                subData = dataTemp[i].sub;
                for(var j=0;j<subData.length;j++){
                    htmlStr +='<li class="sub-item"><a href="'+subData[j].href+'" target="main_frame">'+subData[j].name+'</a></li>';
                }
                htmlStr += '</ul>';
            }
            htmlStr +='</li>';
        }
        htmlStr += '</ul>';

        $(obj).html(htmlStr);
    },
    addClickEvent : function (obj) {
        $(obj).on('click','li',function (e) {
            var $this = $(this);
            if($this.hasClass('item')){
                var $snav = $this.find('.sub-nav');
                $this.toggleClass('active');
                if($snav.length !== 0){
                    $snav.slideToggle("fast");
                }
                $this.siblings().removeClass('active');
                $(obj).find('.sub-nav').not($snav).slideUp("fast");

            }else {
                $this.addClass('active').siblings().removeClass('active');
            }
            e.stopPropagation();
        })
    }
}