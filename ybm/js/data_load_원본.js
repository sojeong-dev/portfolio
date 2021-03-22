$(function() {
  'use strict';
  console.log('data load');

  var completeData = [];   //json데이터 담는 변수 //전역 변수
      
  getLoadDataFn(); 

  $(window).on('resize', function() {
    setResizeUI();
  });

  function getLoadDataFn() { //json파일을 받아오는 함수
    $.ajax({
      url: 'js/data.json',
      dataType: 'json',
      success: function(result) { //json파일이 담김
        // console.log(result);
        completeData = result.mainContent;
        // console.log(completeData);

        init();	//데이터 셋팅(초기화)
        setResizeUI();  //리사이즈시 데이터 style 위치 셋팅
      }
    })
  }

  function setResizeUI() {
    if($(window).width() < 768) {
      setPosUI(10);
    } else {
      setPosUI(35);
    }
  }

  function setPosUI(spaceLeft) { //데이터 style 위치 셋팅
    var $contInner = $('#curation > ul.inner'),
        $contLi = $contInner.children(),  //#curation ul.inner > li
        innerW = $contInner.outerWidth(),
        contW = $contLi.outerWidth(),
        contH = $contLi.outerHeight(true),
        innerH = 0, colNum = 0, rowNum = 0,
        arrOffsetLeft = [], arrOffsetTop = [];

    // console.log($contLi);
    
    colNum = Math.floor(innerW / contW);
    rowNum = Math.ceil($contLi.length / colNum);
    innerH = contH * rowNum;
    // console.log(innerW + '/' + innerH + '/' + contW + '/' + contH + '/' + colNum + '/' + rowNum);

    for(var i = 0; i < rowNum; i++) {
      for(var j = 0; j < colNum; j++) {
        arrOffsetTop.push(i);
        arrOffsetLeft.push(j);
      }
    }
    // console.log(arrOffsetTop + '/\n' + arrOffsetLeft); 

    $contInner.css({'height': innerH});
    $contLi.each(function(i) {
      $(this).css({'top': (contH * arrOffsetTop[i]) + 'px', 'left': (contW * arrOffsetLeft[i] + spaceLeft * arrOffsetLeft[i]) + 'px'});
    })
  }

  function init() { //데이터 셋팅 함수
    // console.log(completeData);
    $.each(completeData, function(i, item){
      // console.log(item.img);

      var $curLi = $('<li></li>'),
          $curA = $('<a href="#"></a>'),
          $imgArea = $('<p class="img_area"></p>'),
          $img = $('<img src="' + item.img + '" alt="" />'),
          $detail = $('<strong class="bg_dimed view_pc"><span class="txt_center">' + item.detail + '</span></strong>'),
          $txtArea = $('<p class="txt_area"></p>'),
          $tit = $('<span class="tit">' + item.tit + '</span>'), 
          $category = $('<span class="category">' + item.category + '</span>');

      $('#curation > .inner').prepend($curLi);  //최신등록순: 가장 마지막에 들어온 데이터가 가장 첫번째 위치하게
      $curLi.append($curA);
      $curA.append($imgArea);
      $imgArea.append($img);
      $imgArea.append($detail);
      $curA.append($txtArea);
      $txtArea.append($tit);
      $txtArea.append($category);
    });
        
  }
});
