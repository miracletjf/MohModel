/** 三级展开表格
 * */
function TableExpend() {
  this.options = {
    wrapObj: {},    //最外层对象
    tbHeadData: [], //表头数据
    supDataDone: {},//一级hash数据记录表
    subDataDone: {},//二级hash数据记录表
    wrapWidth: 0,   //最外层对象宽度
    wrapHeight: 0,  //最外层对象高度
    random: 0,        //保证内部id不重复（绝大多数情况）
    levelKeys: {      //级别主键
      supper: 'CODE2',
      sub: 'CODE1',
      min: 'ENT_ID'
    },
    mainCol:{		//第一列参数对象
      width: 285,	//宽度
      title: '地区',	//标题
      text: '合计',	//第一行文字
      default: 0	//默认值
    },
    cols: [],     //从地区后第一列开始（设置每列宽度数组形式） ex: [100,300,,200]
    countRow: true,  //合计行
    default: 0, //默认值
    order: [],  //列表顺序
    type: 'col', //数据类型
    align: 'left'
  };
  this.temp = {
    supLength: 0,
    supArr: []
  }
}

TableExpend.prototype = {
  constructor: TableExpend,
  init: function (options) {
    var _this = this;
    _this.options.wrapWidth = $(window).width();
    _this.options.wrapHeight = $(window).height();
    _this.options.wrapObj = $('#tb_wrap');
    _this.options.random = Math.round(Math.random() * 100);
    _this.options = $.extend(true,_this.options, options);
    _this.options.wrapObj.css({
      'width': _this.options.wrapWidth,
      'height': _this.options.wrapHeight
    });
    var boxs = _this.generateBox(_this.options.wrapObj);
    var headBox = boxs.head;
    var bodyBox = boxs.body;
    _this.generateHead(headBox, bodyBox);
  },
  /** 生成表格布局
   * */
  generateBox: function (obj) {
    var _this = this;
    var html1 = '<div class="tb-head-box tb-box" id="tb_head_box_' + _this.options.random + '"></div>';
    var html2 = '<div class="tb-body-box tb-box" id="tb_body_box_' + _this.options.random + '"></div>';
    var head = $(html1).appendTo(obj);
    var body = $(html2).appendTo(obj);

    return {head: head, body: body};
  },
  /** 生成表头
   * */
  generateHead: function (thObj, tbObj) {
    var _this = this;
    var _queryCriteria = _this.options.queryCriteria;
    $.ajax(_this.options.arrx.url, {
      type: "post",
      data: _queryCriteria,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: function (rtn) {
        var data = JSON.parse(rtn);
        var tbHeads = data.listdata;
        _this.options.tbHeadData = data.listdata;
        var colSpan = 1;
        var html = '<table class="expand-table '+_this.options.align+'" id="head_tb">';
        html += _this.generateColgroup(tbHeads);
        html += '<thead>';
        html += '<tr><td class="th" rowspan="2"><span class="export-btn" onclick="excelExport()">导出</span>'+_this.options.mainCol.title+'</td>';
        for (var i = 0; i < tbHeads.length; i++) {
          if (tbHeads[i + 1] && tbHeads[i].COL === tbHeads[i + 1].COL) {
            colSpan++;
          } else {
            html += '<td class="th" colspan="' + colSpan + '">' + tbHeads[i].COL + '</td>';
            colSpan = 1;
          }
        }
        html += '</tr></tr>';
        for (var i = 0; i < tbHeads.length; i++) {
          html += '<td class="th">' + tbHeads[i].NAME + '</td>'
        }
        html += '</tr></thead>';
        if(_this.options.countRow){
          html +='<tbody><tr>';
          html += '<td class="td-name"><i class="icon-expand-all"></i>'+_this.options.mainCol.text+'</td>';
          var def;
          for (var i = 0; i < tbHeads.length; i++) {
            def = (!tbHeads[i].NUM)?_this.options.mainCol.default:tbHeads[i].NUM;
            html += '<td>' + def + '</td>'
          }
          html += '</tr></tbody>';
        }
        html += '</table>';
        thObj.append(html);
        _this.generateSup(tbObj, tbHeads);
      }
    })
  },
  /** 生成一级内容
   * */
  generateSup: function (obj, tbHeads) {
    var _this = this;
    var _queryCriteria = _this.options.queryCriteria;
    $.ajax(_this.options.arr1.url, {
      type: "post",
      data: _queryCriteria,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: function (rtn) {
        var data = JSON.parse(rtn);
        var tbSupDatas = data.listdata;
        var html = '<table class="expand-table '+_this.options.align+'" id="body_tb">';
        var hash = _this.getHash(tbSupDatas, _this.options.levelKeys.supper);
        html += _this.generateColgroup(tbHeads);
        html += _this.hashToTr(hash, tbHeads, 'supper');
        html += '</table>';
        var supObjs = $(html).appendTo(obj);
        var tbObj = $('#tb_body_box_' + _this.options.random);
        var thObj = $('#tb_head_box_' + _this.options.random);
        tbObj.css('height', _this.options.wrapHeight - thObj.height() + 17 + 'px');
        _this.addOnScroll(tbObj, thObj);
        _this.addSupClick(supObjs, '330000');

        _this.addAllClick();
      }

    });
  },
  /** 生成二级内容
   * */
  generateSub: function (obj, code, index, special) {
    var _this = this;
    var _queryCriteria = _this.options.queryCriteria;
    _queryCriteria["param/pcode"] = code;
    $.ajax(_this.options.arr2.url, {
      type: "post",
      data: _queryCriteria,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: function (rtn) {
        var data = JSON.parse(rtn);
        var tbSubDates = data.listdata;
        var hash = _this.getHash(tbSubDates, _this.options.levelKeys.sub);
        var html = _this.hashToTr(hash, _this.options.tbHeadData, 'sub', special);
        var subObjs = $(html).insertAfter(obj);
        if (!_this.options.supDataDone[code]) {
          _this.options.supDataDone[code] = true;
        }
        _this.addSubClick($(subObjs));
        obj.toggleClass('open');

        if (typeof special !== "undefined") {
          _this.temp.subIcon = $(subObjs).find('.icon-expand');
          _this.temp.subIcon.click();
          _this.temp.supArr[index] = {};
          _this.temp.supArr[index].subAutoClick = false;
        }else{
          if (typeof _this.temp.supArr[index] === 'object' && _this.temp.supArr[index].subAutoClick) {
            $(subObjs).find('.icon-expand').each(function () {
              $(this).click();
            });
            _this.temp.supArr[index].subAutoClick = false;
          } else {
            _this.temp.supArr[index] = {};
          }
        }
      }
    });
  },
  /** 生成三级内容
   * */
  generateMin: function (obj, code) {
    var _this = this;
    var _queryCriteria = _this.options.queryCriteria;
    _queryCriteria["param/pcode"] = code;
    $.ajax(_this.options.arr3.url, {
      type: "post",
      data: _queryCriteria,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: function (rtn) {
        var data = JSON.parse(rtn);
        var tbSubDates = data.listdata;

        if(_this.options.type === 'col'){
          var hash = _this.getHash(tbSubDates, _this.options.levelKeys.min);
          var html = _this.hashToTr(hash, _this.options.tbHeadData, 'min');
        }else{
          var html = _this.dataToTr(tbSubDates);
        }
        var minObjs = $(html).insertAfter(obj);
        if (!_this.options.subDataDone[code]) {
          _this.options.subDataDone[code] = true;
        }
        obj.toggleClass('open');
      }
    })
  },
  /** 给一级菜单添加点击事件
   * */
  addSupClick: function (objs, special) {
    var _this = this;
    var $icons = objs.find('.icon-expand');
    _this.temp.supLength = $icons.length;
    _this.temp.supArr.length = $icons.length;
    $icons.on('click', function (ev) {
      var $this = $(ev.target);
      var index = $icons.index($this);
      var supObj = $($this).parent().parent();
      var sup = supObj.attr('tName');
      var mins = $('[ssupName="' + sup + '"]');
      var subs = $('[supName = "' + sup + '"]');
      if (!_this.options.supDataDone[sup]) {
        if (typeof special !== 'undefined' && sup === special) {
          _this.generateSub(supObj, sup, index, special);
        } else {
          _this.generateSub(supObj, sup, index);
        }
      } else {
        if (_this.temp.supArr[index].subAutoClick) {
          subs.removeClass('hide');
          subs.find('.icon-expand').each(function () {
            $(this).parent().parent().hasClass('open') || $(this).click();
          });
          supObj.addClass('open');
          _this.temp.supArr[index].subAutoClick = false;
        }else{
          if (typeof special !== 'undefined' && sup === special) {
            _this.temp.subIcon.click();
          }else{
            if (supObj.hasClass('open')) {
              mins.addClass('hide');
              subs.addClass('hide');
              subs.removeClass('open');
            } else {
              subs.removeClass('hide');
            }
          }
          supObj.toggleClass('open');
        }
      }
    });
  },
  /** 给二级菜单添加点击事件
   * */
  addSubClick: function (objs) {
    var _this = this;
    var $icons = objs.find('.icon-expand');
    $icons.on('click', function (ev) {
      var $this = $(ev.target);
      var subObj = $($this).parent().parent();
      var sub = subObj.attr('tName');
      var mins = $('[supName="' + sub + '"]');
      if (!_this.options.subDataDone[sub]) {
        _this.generateMin(subObj, sub);
      } else {
        if (subObj.hasClass('open')) {
          if (mins.length) {
            mins.addClass('hide');
          }
        } else {
          mins.removeClass('hide');
        }
        subObj.toggleClass('open');
      }
    });
  },
  /** 全部展开，收拢事件
   * */
  addAllClick: function () {
    var _this = this;
    $('.icon-expand-all').on('click', function (ev) {
      var $this = $(ev.target);
      if (!$this.parent().parent().hasClass('open')) {
        _this.options.wrapObj.find('.supper').find('.icon-expand').each(function (index) {
          if (!_this.temp.supArr[index]) {
            _this.temp.supArr[index] = {};
          }
          _this.temp.supArr[index].subAutoClick = true;
          $(this).click();
        });
      } else {
        _this.options.wrapObj.find('.icon-expand').each(function () {
          $(this).parent().parent().hasClass('open') && $(this).click();
        });
      }
      $this.parent().parent().toggleClass('open');
    });
  },
  /** 滚动监听事件
   *  实现表头与数据同步滚动
   * */
  addOnScroll: function (tbObj, thObj) {
    tbObj.on('scroll', function (ev) {
      var $this = ev.target;
      var scTop = $($this).scrollTop();
      var scLeft = $($this).scrollLeft();
      if (scLeft >= 0) {
        thObj.scrollLeft(scLeft);
      }
    });
  },
  /** 生成列控制组
   * */
  generateColgroup: function (tbHeads) {
    var _this = this;
    var html = '';
    html += '<colgroup>' +
      '<col width="'+_this.options.mainCol.width+'">';
    for (var index = 0; index < tbHeads.length; index++) {
      if(index < _this.options.cols.length && _this.options.cols[index]){
        html += '<col width="'+_this.options.cols[index]+'">'
      } else {
        html += '<col width="100">';
      }
    }
    html += '</colgroup>';
    return html;
  },
  /** 对给定的数据进行分组，返回分好组的hash
   * */
  getHash: function (arrs, key) {
    var hash = {};
    for (var i = 0; i < arrs.length; i++) {
      if (!hash[arrs[i][key]]) {
        hash[arrs[i][key]] = {};
      }
      hash[arrs[i][key]][arrs[i].ID] = arrs[i];
    }
    return hash;
  },
  /** 把分好组的hash转成html
   *  1. 根据级别，表头进行生成
   * */
  hashToTr: function (hash, arrHead, level, special) {
    var _this = this;
    var html = '';
    for (var key in hash) {
      //hash的每一项
      var item = hash[key];
      var keys = Object.keys(item);
      var name;

      if (level === 'supper') {
        name = 'NAMEY';
        html += '<tbody>';
        html += '<tr class="box supper" tName="' + key + '">';
        html += '<td class="td-name"><i class="icon-expand" ></i>' + item[keys[0]][name] + '</td>';
      } else if (level === 'sub') {
        name = 'NAME1';
        if (typeof  special !== 'undefined')
          html += '<tr class="box sub hideImp" tName="' + key + '" supName="' + item[keys[0]][_this.options.levelKeys.supper] + '">';
        else
          html += '<tr class="box sub" tName="' + key + '" supName="' + item[keys[0]][_this.options.levelKeys.supper] + '">';
        html += '<td class="td-name"><i class="icon-expand" ></i>' + item[keys[0]][name] + '</td>';
      } else {

        name = 'ENT_NAME';
        html += '<tr class="box min" tName="' + key + '" supName="' + item[keys[0]][_this.options.levelKeys.sub] + '" ssupName="' + item[keys[0]][_this.options.levelKeys.supper] + '">';
        html += '<td class="td-name">' + item[keys[0]][name] + '</td>';
      }

      for (var i = 0; i < arrHead.length; i++) {

        var tdObj = item[arrHead[i].ID];
        if (tdObj && (!!tdObj.NUM)) {
          html += '<td>' + tdObj.NUM + '</td>';
        } else {
          html += '<td>'+_this.options.default+'</td>';
        }
      }
      html += '</tr>';
      if (level === 'super') {
        html += '</tbody>';
      }
    }
    return html;
  },
  dataToTr: function (data) {
    var _this = this;
    var html = '';
    var row;
    for(var i=0;i<data.length;i++){
      row = data[i];
      html += '<tr class="box min" tName="'+row[_this.options.levelKeys.min]+'" supName="'+row[_this.options.levelKeys.sub]+'" ssupName="'+row[_this.options.levelKeys.supper]+'">';
      for(var j = 0 ;j<_this.options.order.length; j++){
        if(j === 0){
          html += '<td class="td-name">'+row[_this.options.order[j]]+'</td>';
          continue;
        }
        var content = (!row[_this.options.order[j]])?_this.options.default:row[_this.options.order[j]];
        html += '<td>'+content+'</td>';
      }
      html += '</tr>';
    }

    return html;
  }
};

//导出
function excelExport() {
  var html_col = "";
  var table = document.getElementById("head_tb");
  /*for(var i=0;i<table.rows[0].cells.length;i++){
    html_col += '<col width="' + window.getComputedStyle(table.rows[0].cells[i],null).width + '">';
  }*/
  var htmlstr = "<table>" + html_col;
  htmlstr += table.innerHTML;
  var table = document.getElementById("body_tb")
  htmlstr += table.innerHTML;
  htmlstr += "</table>";
  if (document.getElementsByName("export").length > 0) {
    document.getElementsByName("htmlstr")[0].value = encodeURI(htmlstr);
    document.getElementsByName("export")[0].submit();
  } else {
    var export_form = document.createElement("form");
    export_form.name = "export";
    export_form.action = "/HtmlToExcelServlet";
    export_form.method = "POST";
    document.body.appendChild(export_form);
    var htmlstr_input = document.createElement("input");
    htmlstr_input.type = "hidden";
    htmlstr_input.name = "htmlstr";
    htmlstr_input.value = encodeURI(htmlstr);
    export_form.appendChild(htmlstr_input);
    export_form.submit();
  }
}
