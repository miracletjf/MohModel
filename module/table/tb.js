loading();

function loading(){
  var loadElement = document.getElementById('loading');
  setTimeout(function(){
    loadElement.style.display = 'none';
  },200);
}

var focusObj;
var activeObj;
var $ths = $('.table-wrap thead th');
var $cols = $('.table-wrap colgroup col');

init();

function init(){
  initTdFrame();
  initThFrame();
  bindEventListener();
  fiexHeader();
}

function bindEventListener(){

  $('.table-wrap').on('click','.td-box',function(){ 
    removeActive(this);
    $(this).addClass('active');
    if(this !== focusObj){
      endEditText(null);
    }
  })

  $('.table-wrap').on('dblclick','.td-box',function(){  
    endEditText(this);
    $(this).addClass('editable');
    var html = $(this).html();
    $(this).html('<textarea>'+html+'</textarea>');
  })
}

function endEditText(editObj){
  if(focusObj){
    var val = $(focusObj).find('textarea').val();
    $(focusObj).html(val);
  }
  
  if(typeof editObj !== 'undefined'){
    focusObj = editObj;
  }
}

function removeActive(nowObj){
  if(activeObj){
    $(activeObj).removeClass('active');
  }
  
  if(typeof nowObj !== 'undefined'){
    activeObj = nowObj;
  }
}

function initTdFrame(){
  $('.table-wrap td').each(function(index){
    var html = $(this).html();
    $(this).html('<div class="td-box">'+html+'</div>');
  })
}

function initThFrame(){
  $ths.each(function(index){
    var html = $(this).html();
    $(this).html('<div class="th-box">'+html+'<i class="resize"></i></div>');
  })
}

function resizeCol(){
  var colIndex,startPos,endPos, edit, boxSize ,minSize = 100;
  var $tableHeadCols = $('.table-box-head col');
  var $resizes = $('.table-box-head th .resize');

  $resizes.on('mousedown',function(e){
    edit = true;
    colIndex = $resizes.index($(this));
    boxSize = $ths.eq(colIndex).outerWidth();
    startPos = e.pageX - boxSize;
    console.log('down----',e)
    console.log(colIndex);
  })

  $(document).on('mousemove',function(e){
    var size;
    if(edit){
      size = e.pageX - startPos;
      if(size >= minSize ){
        $tableHeadCols.eq(colIndex).width(size);
        $cols.eq(colIndex).width(size);
      }
    }
  })
  $(document).on('mouseup',function(e){
    edit = false;
  })
}

function fiexHeader(){
  var $tableHeadBox = $('<div class="table-box-head table-"></div>').prependTo($('.table-wrap'));
  var headTable = document.createElement('table');
  var $tableColGroup = $('.table-box-main table colgroup').clone();
  var $thead = $('.table-box-main table thead');
  $(headTable).append($tableColGroup);
  $(headTable).append($thead);
  $tableHeadBox.append(headTable);

  resizeCol();
  setMainTableSize();
  addScrollControl();
}

function fiexLeft(){
  
}

function setMainTableSize(){
  var allWidth = 0;
  var WinHeight = $(window).height();
  var WinWidth = $(window).width();
  $cols.each(function(index){
    allWidth += $(this).outerWidth();
  })
  $('.table-wrap').css({
    'height': WinHeight + 'px'
  })
  var headHeight =  $('.table-box-head table').height();
  $('.table-box-main').height(WinHeight - headHeight - 1);
}




function addScrollControl(){
  var $headTable = $('.table-box-head')
  $('.table-box-main').on('scroll',function(e){
    $headTable.scrollLeft($(this).scrollLeft());
  })
}

