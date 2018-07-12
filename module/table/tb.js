function GenerateReportTable(selector){
  this.params = {};
  this.size = {};
  this.view = {};
  this.view.wrap = $(selector);
}

GenerateReportTable.prototype = {
  constructor: GenerateReportTable,
  init: function(options){
    this.size.wrapHeight = $(window).height();
    this.size.wrapWidth = $(window).width();
    this.view.mainCols = $('.table-box-body col');
    this.options = $.extend(true,{},options);

    this.initTdFrame(); //初始化td
    this.initThFrame(); //初始化th
    this.bindEventListener(); //绑定事件
    this.freezeHeader();  //固定头
    this.freezeLefte(); //固定列
  },
  initTdFrame: function(){
    var $wrap = this.view.wrap;
    $wrap.find('td').each(function(index){
      var html = $(this).html();
      $(this).html('<div class="td-box">'+html+'</div>');
    })
  },
  initThFrame: function(){
    var $wrap = this.view.wrap;
    this.view.ths = $wrap.find('thead th');
    this.view.ths.each(function(index){
      var html = $(this).html();
      $(this).html('<div class="th-box">'+html+'<i class="resize"></i></div>');
    })
  },
  bindEventListener: function(){
    var _this = this;
    var $wrap = _this.view.wrap;
    _this.params.focusObj = null;
    _this.params.activeObj = null;

    $wrap.on('click','.td-box',this.tdCellClick(this)); //点击事件
    $wrap.on('dblclick','.td-box',this.tdCellDblclick(this));  //双击事件
  },
  tdCellClick: function(_this){
    return function(){
      _this.removeActive(this);
      $(this).addClass('active');
      if(this !== _this.params.focusObj){
        _this.endEditText(null);
      }
    }
  },
  tdCellDblclick: function (_this){
    return function(){
      _this.endEditText(this);
      var html = $(this).html();
      $(this).addClass('editable');
      $(this).html('<textarea>'+html+'</textarea>');
    }
  },
  endEditText: function(editObj){
    var _focusObj = this.params.focusObj;
    if(_focusObj){
      var val = $(_focusObj).find('textarea').val();
      $(_focusObj).html(val);
    }
    this.params.focusObj = editObj;
  },
  removeActive: function(nowObj){
    var _activeObj = this.params.activeObj;
    if(_activeObj){
      $(_activeObj).removeClass('active');
    }
    this.params.activeObj = nowObj;
  },
  freezeHeader: function(){
    this.createHeaderFreezeTable();

    this.resizeCol(); //调节列宽
    this.setMainTableSize();  // 设置尺寸
    this.addScrollControl();  // 滚动控制
  },
  createHeaderFreezeTable: function(){
    var $tableHeadBox = $('<div class="table-box-head"></div>').prependTo($('.table-wrap'));
    var $headTable = $('<table></table>');
    var $tableColGroup = $('.table-box-body table colgroup').clone();
    var $thead = $('.table-box-body table thead');

    $headTable.append($tableColGroup);
    $headTable.append($thead);
    $tableHeadBox.append($headTable);
  },
  freezeLefte: function(){
    var $tableLeftWrap = $('<div class="table-wrap-left">').prependTo($('.report-table'));
    var leftWrapHead = this.view.wrap.find('.table-box-head').clone();
    var leftWrapBody = this.view.wrap.find('.table-box-body').clone();
    $tableLeftWrap.append(leftWrapHead);
    $tableLeftWrap.append(leftWrapBody);
    $tableLeftWrap.find('table').width(this.view.wrap.find('table').width());
    $tableLeftWrap.width($('.table-box-head thead th').eq(0).outerWidth());
    $tableLeftWrap.height(this.size.wrapHeight);
    $tableLeftWrap.find('.table-box-body').height(
      this.size.wrapHeight - $tableLeftWrap.find('.table-box-head').height()
    );
  },
  resizeCol: function(){
    this.view.resizes = this.view.wrap.find('.table-box-head th .resize');

    this.view.resizes.on('mousedown',this.resizeBegin(this))  // 开始调节
    $(document).on('mousemove',this.resizeDo(this)) // 调节
    $(document).on('mouseup',this.resizeEnd(this))  // 结束调节
  },
  resizeBegin: function(_this){
    return function(e){
      _this.params.isResize = true;
      _this.params.colIndex = _this.view.resizes.index($(this));
      boxSize = _this.view.ths.eq(_this.params.colIndex).outerWidth();
      _this.params.startPos = e.pageX - boxSize;
    }
  },
  resizeDo: function(_this){
    var minSize = 100;
    _this.view.headCols = _this.view.wrap.find('.table-box-head col');

    return function(e){
      var size;
      if(_this.params.isResize){
        size = e.pageX - _this.params.startPos;
        if(size >= minSize ){
          _this.view.headCols.eq(_this.params.colIndex).width(size);
          _this.view.mainCols.eq(_this.params.colIndex).width(size);
        }
      }
    }
  },
  resizeEnd: function(_this){
      return function(e){
        _this.params.isResize = false;
      }
  },
  setMainTableSize: function(){
    var headHeight =  $('.table-box-head table').height();
    $('.report-table').height(this.size.wrapHeight);
    $('.table-box-body').height(this.size.wrapHeight - headHeight - 2);
  },
  addScrollControl: function(){
    var $headTable = $('.table-box-head')
    $('.table-box-body').on('scroll',function(e){
      $headTable.scrollLeft($(this).scrollLeft());
      if(($headTable).scrollLeft() > 0){
        $('.table-wrap-left').addClass('upper');
      }else{
        $('.table-wrap-left').removeClass('upper');
      }
      $('.table-box-body').not(this).scrollTop($(this).scrollTop());
    })
  }
}

function loading(){
  var loadElement = document.getElementById('loading');
  setTimeout(function(){
    loadElement.style.display = 'none';
  },1000);
}



loading();

var table = new GenerateReportTable('.table-wrap');
table.init({
  freezeRowNumber: 4,
  freezeColNumber: 3
});

