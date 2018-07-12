function GenerateReportTable(selector){
  this.wrap = $(selector);
}

GenerateReportTable.prototype = {
  constructor: GenerateReportTable,
  init: function(){
    this.params = {};
    this.size = {};
    this.size.wrapHeight = $(window).height();
    this.size.wrapWidth = $(window).width();
    console.log(this.size.wrapHeight,this.size.wrapWidth);
    this.colsMain = $('.table-box-body col');
    this.initTdFrame(); //初始化td
    this.initThFrame(); //初始化th
    this.bindEventListener(); //绑定事件
    this.freezeHeader();  //固定头
    this.freezeLefte();
  },
  initTdFrame: function(){
    var $wrap = this.wrap;
    $wrap.find('td').each(function(index){
      var html = $(this).html();
      $(this).html('<div class="td-box">'+html+'</div>');
    })
  },
  initThFrame: function(){
    var $wrap = this.wrap;
    this.$ths = $wrap.find('thead th');
    
    this.$ths.each(function(index){
      var html = $(this).html();
      $(this).html('<div class="th-box">'+html+'<i class="resize"></i></div>');
    })
  },
  bindEventListener: function(){
    var _this = this;
    _this.params.focusObj = null;
    _this.params.activeObj = null;

    this.tdCellClick();
    this.tdCellDblclick();
  },
  tdCellClick: function(){
    var _this = this;
    var $wrap = _this.wrap;
    $wrap.on('click','.td-box',function(){
      _this.removeActive(this);
      $(this).addClass('active');
      if(this !== _this.params.focusObj){
        _this.endEditText(null);
      }
    })
  },
  tdCellDblclick: function (){
    var _this = this;
    var $wrap = _this.wrap;
    $wrap.on('dblclick','.td-box',function(){  
      _this.endEditText(this);
      $(this).addClass('editable');
      var html = $(this).html();
      $(this).html('<textarea>'+html+'</textarea>');
    })
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
    var $tableHeadBox = $('<div class="table-box-head"></div>').prependTo($('.table-wrap'));
    var headTable = document.createElement('table');
    var $tableColGroup = $('.table-box-body table colgroup').clone();
    var $thead = $('.table-box-body table thead');
    $(headTable).append($tableColGroup);
    $(headTable).append($thead);
    $tableHeadBox.append(headTable);

    // this.resizeCol(); //调节列宽
    this.setMainTableSize();  // 设置尺寸
    this.addScrollControl();  // 滚动控制
  },
  freezeLefte: function(){
    var _this = this;
    var $tableLeftWrap = $('<div class="table-wrap-left">').prependTo($('.report-table'));
    var leftWrapHead = this.wrap.find('.table-box-head').clone();
    var leftWrapBody = this.wrap.find('.table-box-body').clone();
    $tableLeftWrap.append(leftWrapHead);
    $tableLeftWrap.append(leftWrapBody);
    $tableLeftWrap.find('table').width(_this.wrap.find('table').width());
    $tableLeftWrap.width($('.table-box-head thead th').eq(0).outerWidth());
    $tableLeftWrap.height(_this.size.wrapHeight);
    $tableLeftWrap.find('.table-box-body').height(
      _this.size.wrapHeight - $tableLeftWrap.find('.table-box-head').height()
    );
  },
  resizeCol: function(){
    this.resizeBegin(); //开始调节
    this.resizeDo();  //调节
    this.resizeEnd(); //调节结束
  },
  resizeBegin: function(){
    var _this = this;
    var $ths = this.$ths;
    var $resizes = $('.table-box-head th .resize');

    $resizes.on('mousedown',function(e){
      _this.params.isResize = true;
      _this.params.colIndex = $resizes.index($(this));
      boxSize = $ths.eq(_this.params.colIndex).outerWidth();
      _this.params.startPos = e.pageX - boxSize;
    })
  },
  resizeDo: function(){
    var _this = this;
    var $tableMainCols = this.colsMain;
    var $tableHeadCols = $('.table-box-head col');
    var minSize = 100;
    $(document).on('mousemove',function(e){
      var size;
      if(_this.params.isResize){
        size = e.pageX - _this.params.startPos;
        if(size >= minSize ){
          $tableHeadCols.eq(_this.params.colIndex).width(size);
          $tableMainCols.eq(_this.params.colIndex).width(size);
        }
      }
    })
  },
  resizeEnd: function(){
    var _this = this;
    $(document).on('mouseup',function(e){
      _this.params.isResize = false;
    })
  },
  setMainTableSize: function(){
    var $wrap = this.wrap;
    var WinHeight = $(window).height();
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
  },200);
}


loading();



var table = new GenerateReportTable('.table-wrap');
table.init();

