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
    random:0,        //保证内部id不重复（绝大多数情况）
    levelKeys: {      //级别主键
      supper: 'CODE2',
      sub: 'CODE1',
      min: 'ENT_ID'
    },
    mainCol:{
      width: 285,
      text: '地区'
    },
    cols: [],     //从地区后第一列开始（设置每列宽度数组形式） ex: [100,300,,200]
    countRow: true,  //合计行
    default: 0,
    order: [],
    type: 'col',
    alignType: 'left'
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
    _this.options.random = Math.round(Math.random()*100);
    _this.options = $.extend(true,_this.options, options);
    console.log(_this.options);

    _this.options.wrapObj.css({
      'width': _this.options.wrapWidth,
      'height': _this.options.wrapHeight
    });
    var boxs = _this.generateBox(_this.options.wrapObj);
    var headBox = boxs.head;
    var bodyBox = boxs.body;

    _this.generateHead(headBox, bodyBox);

  },
  generateBox: function (obj) {
    var _this = this;
    var html1 = '<div class="tb-head-box tb-box" id="tb_head_box_'+_this.options.random+'"></div>';
    var html2 = '<div class="tb-body-box tb-box" id="tb_body_box_'+_this.options.random+'"></div>';
    var head = $(html1).appendTo(obj);
    var body = $(html2).appendTo(obj);

    return {head: head, body: body};
  },
  generateHead: function (thObj, tbObj) {
    var _this = this;
    $.get("../json/statisArrx.json", function (data) {

      var tbHeads = data.listx;
      _this.options.tbHeadData = data.listx;
      var colSpan = 1;
      var html = '<table class="expand-table '+_this.options.alignType+'" id="head_tb">';
      html += _this.generateColgroup(tbHeads);
      html += '<thead>';
      html += '<tr><th rowspan="2"><span class="export-btn">导出</span>'+_this.options.mainCol.text+'</th>';
      for (var i = 0; i < tbHeads.length; i++) {
        if (tbHeads[i + 1] && tbHeads[i].COL === tbHeads[i + 1].COL) {
          colSpan++;
        } else {
          html += '<th colspan="' + colSpan + '">' + tbHeads[i].COL + '</th>';
          colSpan = 1;
        }
      }
      html += '</tr></tr>';
      for (var i = 0; i < tbHeads.length; i++) {
        html += '<th>' + tbHeads[i].NAME + '</th>'
      }
      html += '</tr></thead>';
      if(_this.options.countRow){
        html += '<tbody><tr>';
        html += '<td class="td-name"><i class="icon-expand-all"></i>合计</td>';
        var def;
        for (var i = 0; i < tbHeads.length; i++) {
          def = (!tbHeads[i].NUM)?_this.options.default:tbHeads[i].NUM;
          html += '<td>' + def + '</td>'
        }
        html += '</tr></tbody>';
      }
      html += '<table>';
      thObj.append(html);
      _this.generateSup(tbObj, tbHeads);
    })
  },
  generateSup: function (obj, tbHeads) {
    var _this = this;
    $.get("../json/statisData1.json", function (data) {

      var tbSupDatas = data.list1;
      var html = '<table class="expand-table '+_this.options.alignType+'" id="body_tb">';

      var hash = _this.getHash(tbSupDatas, _this.options.levelKeys.supper);

      html += _this.generateColgroup(tbHeads);

      html += _this.hashToTr(hash, tbHeads, 'supper');

      html += '</table>';

      var supObjs = $(html).appendTo(obj);
      var tbObj = $('#tb_body_box_'+ _this.options.random);
      var thObj = $('#tb_head_box_'+ _this.options.random);
      tbObj.css('height', _this.options.wrapHeight - thObj.height() + 17 + 'px');

      _this.addOnScroll(tbObj, thObj);

      _this.addSupClick(supObjs,'330000');

      _this.addAllClick();
    })
  },
  generateSub: function (obj, code,index,special) {
    var _this = this;
    $.get("../json/statisData2.json", function (data) {
      var tbSubDates = data.list2;
      var hash = _this.getHash(tbSubDates, _this.options.levelKeys.sub);
      var html = _this.hashToTr(hash, _this.options.tbHeadData, 'sub',special);

      var subObjs = $(html).insertAfter(obj);

      if (!_this.options.supDataDone[code]) {
        _this.options.supDataDone[code] = true;
      }

      _this.addSubClick($(subObjs));

      obj.toggleClass('open');

      if(typeof _this.temp.supArr[index] === 'object' && _this.temp.supArr[index].subAutoClick){
        console.log(_this.temp.supArr[index].subAutoClick);
        $(subObjs).find('.icon-expand').each(function () {
          $(this).click();
        });
        _this.temp.supArr[index].subAutoClick = false;
        _this.temp.supArr[index].hasGenerate = true;
      }else{
        _this.temp.supArr[index] = {};
        _this.temp.supArr[index].hasGenerate = true;
      }
      if(typeof special !== "undefined"){
        $(subObjs).find('.icon-expand').click();
        _this.temp.subIcon = $(subObjs).find('.icon-expand');
      }
    });
  },
  generateMin: function (obj, code) {
    var _this = this;
    $.get("../json/statisData3.json", function (data) {
      var tbSubDates = data.list3;
      if(_this.options.type === 'col'){
        var hash = _this.getHash(tbSubDates, _this.options.levelKeys.min);
        var html = _this.hashToTr(hash, _this.options.tbHeadData, 'min');
      }else{
        var html = _this.options.dataToTr(data);
      }
      var minObjs = $(html).insertAfter(obj);
      if (!_this.options.subDataDone[code]) {
        _this.options.subDataDone[code] = true;
      }
      obj.toggleClass('open');
    })
  },
  addSupClick: function (objs,special) {
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
        if(typeof special !== 'undefined' && sup === special){
          _this.generateSub(supObj,sup,index,special);
        }else {
          _this.generateSub(supObj,sup,index);
        }
      } else {

        if(typeof special !== 'undefined' && sup === special){
          _this.temp.subIcon.click();
        }else {
          if(_this.temp.supArr[index].subAutoClick && _this.temp.supArr[index].hasGenerate){
            subs.removeClass('hide');
            subs.find('.icon-expand').each(function () {
              $(this).parent().parent().hasClass('open') || $(this).click();
            });
            _this.temp.supArr[index].subAutoClick = false;
            supObj.addClass('open');

          }else if (supObj.hasClass('open')) {
            mins.addClass('hide');
            subs.addClass('hide');
            subs.removeClass('open');
            supObj.removeClass('open');

          } else {
            subs.removeClass('hide');
            supObj.addClass('open');

          }
        }
      }

    });
  },
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
  addAllClick: function () {
    var _this = this;
    $('.icon-expand-all').on('click',function(ev){
      var $this = $(ev.target);
      if(!$this.parent().parent().hasClass('open')){
        _this.options.wrapObj.find('.supper').find('.icon-expand').each(function (index) {
          if(!_this.temp.supArr[index]){
            _this.temp.supArr[index] = {};
          }
          _this.temp.supArr[index].subAutoClick = true;
          $(this).click();
        });
      }else {
        _this.options.wrapObj.find('.icon-expand').each(function () {
          $(this).parent().parent().hasClass('open') && $(this).click();
        });
      }
      $this.parent().parent().toggleClass('open');
    });
  },
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
  hashToTr: function (hash, arrHead, level,special) {
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
        if(typeof  special !== 'undefined')
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
      html += '<tr class="box min" tName="'+row[_this.options.levelKeys.min]+'" supName="'+row[_this.options.levelKeys.sub]+'" ssupName="'+_this.options.levelKeys.supper+'">';
      for(var j = 0 ;j<_this.options.order.length; j++){
        if(j === 0){
          html += '<td class="td-name">'+row[_this.options.order[j]]+'</td>';
          continue;
        }
        var content = (!row[_this.options.order[j]])?_this.options.default:row[_this.options.order[i]];
        html += '<td>'+content+'</td>';
      }
      html += '</tr>';
    }

    return html;
  }
  
}
