/** 三级展开表格
 * */

function TableExpend() {
  this.options = {
    wrapObj: {},
    tbHeadData: [],
    subDataDone: {},
    minDataDone: {},
    wrapWidth: 0,
    wrapHeight: 0,
    random:0
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
    _this.options = $.extend(_this.options, options);

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
      var html = '<table class="expand-table" id="head_tb">';
      html += _this.generateColgroup(tbHeads);
      html += '<thead>';
      html += '<tr><th rowspan="2"></th><th rowspan="2"></th><th rowspan="2">地区</th>';

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

      html += '<tbody><tr>';
      html += '<td></td><td></td><td class="td-name">合计</td>';
      for (var i = 0; i < tbHeads.length; i++) {
        html += '<td>' + tbHeads[i].NUM + '</td>'
      }
      html += '</tr></tbody><table>';

      thObj.append(html);


      _this.generateSup(tbObj, tbHeads);
    })
  },
  generateSup: function (obj, tbHeads) {
    var _this = this;
    $.get("../json/statisData1.json", function (data) {

      var tbSupDatas = data.list1;
      var html = '<table class="expand-table" id="body_tb">';

      var hash = _this.getHash(tbSupDatas, 'CODE2');

      html += _this.generateColgroup(tbHeads);

      html += _this.hashToTr(hash, tbHeads, 'supper');

      html += '</table>';

      var supObjs = $(html).appendTo(obj);
      var tbObj = $('#tb_body_box_'+ _this.options.random);
      var thObj = $('#tb_head_box_'+ _this.options.random);
      tbObj.css('maxHeight', _this.options.wrapHeight - thObj.height() + 17 + 'px');

      _this.addOnScroll(tbObj, thObj);

      _this.addSupClick(supObjs);
    });
  },
  generateSub: function (obj, code) {
    var _this = this;
    $.get("../json/statisData2.json", function (data) {
      var tbSubDates = data.list2;
      var hash = _this.getHash(tbSubDates, 'CODE1');
      var html = _this.hashToTr(hash, _this.options.tbHeadData, 'sub');

      var subObjs = $(html).insertAfter(obj);

      if (!_this.options.subDataDone[code]) {
        _this.options.subDataDone[code] = true;
      }
      _this.addSubClick($(subObjs.prevObject));
      obj.toggleClass('open');
    });
  },
  generateMin: function (obj, code) {
    var _this = this;
    $.get("../json/statisData3.json", function (data) {
      var tbSubDates = data.list3;
      var hash = _this.getHash(tbSubDates, 'ENT_ID');
      var html = _this.hashToTr(hash, _this.options.tbHeadData, 'min');
      $(obj).after(html);
      if (!_this.options.minDataDone[code]) {
        _this.options.minDataDone[code] = true;
      }
      obj.toggleClass('open');
    })
  },
  addSupClick: function (objs) {
    var _this = this;
    console.log(objs);
    objs.find('.icon-expand').on('click', function (ev) {
      var $this = $(ev.target);
      var supObj = $($this).parent().parent();
      var sup = supObj.attr('tName');
      var mins = $('[ssupName="' + sup + '"]');
      var subs = $('[supName = "' + sup + '"]');

      if (!_this.options.subDataDone[sup]) {
        _this.generateSub(supObj, sup);
      } else {
        if (supObj.hasClass('open')) {
          mins.addClass('hide');
          subs.addClass('hide');
          supObj.siblings('.bor-top').removeClass('bor-top');
          supObj.siblings('.bor-bot').removeClass('bor-bot');
          subs.removeClass('open');
        } else {
          subs.removeClass('hide');
          subs.eq(0).addClass('bor-top');
          subs.eq(subs.length - 1).addClass('bor-bot');

        }
        supObj.toggleClass('open');
      }
    });
  },
  addSubClick: function (objs) {
    console.log(objs);
    var _this = this;
    objs.find('.icon-expand').on('click', function (ev) {
      var $this = $(ev.target);
      var subObj = $($this).parent().parent();
      var sub = subObj.attr('tName');
      var mins = $('[supName="' + sub + '"]');

      if (!_this.options.minDataDone[sub]) {
        _this.generateMin(subObj, sub);
      } else {
        if (subObj.hasClass('open')) {
          if (mins.length) {
            mins.addClass('hide');
            if (sub === mins.parent().find('.bor-bot').attr('supName')) {
              subObj.addClass('bor-bot');
              mins.removeClass('bor-bot');
            }
          }
        } else {
          mins.removeClass('hide');
          if (subObj.hasClass('bor-bot') && mins.length) {
            subObj.removeClass('bor-bot');
            mins.eq(mins.length - 1).addClass('bor-bot');
          }
        }
        subObj.toggleClass('open');
      }
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
    var html = '';
    html += '<colgroup>' +
      '<col class="icon-col">' +
      '<col class="icon-col">' +
      '<col width="285" class="name-col">';
    for (var index = 0; index < tbHeads.length; index++) {
      html += '<col width="100">'
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
  hashToTr: function (hash, arrHead, level) {
    var html = '';

    for (var key in hash) {
      //hash的每一项
      var item = hash[key];
      var name;

      if (level === 'supper') {
        name = 'NAMEY';
        html += '<tbody>';
        html += '<tr class="box supper" tName="' + key + '">';
        html += '<td><i class="icon-expand" ></i></td><td></td>';
      } else if (level === 'sub') {
        name = 'NAME1';
        html += '<tr class="box sub" tName="' + key + '" supName="' + item['A1'].CODE2 + '">';
        html += '<td></td><td><i class="icon-expand" ></i></td>';
      } else {
        name = 'ENT_NAME';
        html += '<tr class="box min" tName="' + key + '" supName="' + item['A1'].CODE1 + '" ssupName="' + item['A1'].CODE2 + '">';
        html += '<td></td><td></td>';
      }
      var flag = 1;
      for (var i = 0; i < arrHead.length; i++) {
        var tdObj = item[arrHead[i].ID];
        if (tdObj) {
          if (flag === 1) {
            html += '<td class="td-name">' + tdObj[name] + '</td>';
            flag--;
          }
          html += '<td>' + tdObj.NUM + '</td>';
        } else {
          html += '<td>0</td>';
        }
      }
      html += '</tr>';
      if (level === 'super') {
        html += '</tbody>';
      }
    }

    return html;
  }
}
