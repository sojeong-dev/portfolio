$(function() {
  'use strict';
  console.log('data load');

  //전역변수
  var mobile = 768,
      completeDataC = [], completeDataS = []; //json데이터 담는 변수  

  loadDataFn();
  
  $(window).on('resize', function() {
    settingUIFn();
  });

  //json파일을 받아오는 함수
  function loadDataFn() {
    $.ajax({
      url: 'js/data.json',                //서버측 경로
      dataType: 'json',                   //json 명시
      success: function(result) { 
        // console.log(result);           //json파일이 담김 //{curation: Array(13), story: Array(8)}
        completeDataC = result.curation;  //배열 담음 
        completeDataS = result.story;
        // console.log(completeDataC, completeDataS);
  
        init(); //데이터 셋팅(초기화)
        settingUIFn(); //UI 셋팅
      }
    })
  }

  //UI 셋팅 함수
  function settingUIFn() {
    resizeOffsetFn($('#curation > ul.inner'));  //#curation 셋팅
    resizeSlickFn($('#story > ul.inner'))    //#story 셋팅
  }

  //#curation: 리사이즈 시, offset 셋팅 함수 
  function resizeOffsetFn($cardList) {  //#curation > ul.inner == box
    var $card = $cardList.children(),  //li == card
        boxWidth = $cardList.outerWidth(),
        boxHeight = 0,
        cardWidth = $card.outerWidth(),
        cardHeight = $card.outerHeight(true),
        rowNum = 0, //행
        colNum = 0, //열
        arrOffsetTop = [],  //행 좌표
        arrOffsetLeft = [], //열 좌표
        marginLeft = 0; //사이 간격
        
    //*Math.ceil() : 소수점 이하를 올림 | Math.round(): 반올림 | Math:floor(): 버림

    //열 갯수: 박스(ul.inner) 너비 / 카드(li) 너비
    colNum = Math.floor(boxWidth / cardWidth);  

    //행 갯수: 카드(li) 갯수 / 열 갯수
    rowNum = Math.ceil($card.length / colNum);  

    //카드(li) 행 갯수를 이용하여 박스(ul.inner) 높이 설정
    //박스(ul.inner) 높이: 카드(li) 높이 X 행 갯수 
    boxHeight = cardHeight * rowNum;

    //*Array.push(item): 배열 끝에 item 추가, 새 길이 반환

    //*구구단
    // for(var i = 2; i < 10; i++) { //행
    //   for(var j = 1; j < 10; j++) { //열
    //     console.log(i + ' x ' + j + ' = ' + (i * j));
    //   }
    // }

    //카드(li)의 행과 열을 좌표처럼 이용하여 카드(li) offset(top, left) 지정
    for(var i = 0; i < rowNum; i++) { //행
      for(var j = 0; j < colNum; j++) { //열
        arrOffsetTop.push(i); //행 좌표 추가
        arrOffsetLeft.push(j);  //열 좌표 추가
      }
    }
    // console.log(arrOffsetTop + '\n' + arrOffsetLeft); 

    //style 적용
    $cardList.css({'height': boxHeight});

    // if($(window).outerWidth() <= mobile) marginLeft = 10;
    //삼항 연산자
    $(window).outerWidth() > mobile ? marginLeft = 32 : marginLeft = 10;
    $card.each(function(i){
      $(this).css({
        'top': (cardHeight * arrOffsetTop[i]) + 'px',
        'left': ((cardWidth + marginLeft) * arrOffsetLeft[i]) + 'px'
      });
    }); 

    // console.log(boxWidth + 'x' + boxHeight + '/' + cardWidth + 'x' + cardHeight + '/' + $card.length + '/' + rowNum + 'x' + colNum);
  }

  //#story: 리사이즈 시, 슬릭 셋팅 함수
  function resizeSlickFn($slider) { //#story > ul.inner
    if($(window).outerWidth() <= mobile) {
      $slider.not('.slick-initialized').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        centerMode: true,
        variableWidth: true,
        arrows: false,
        infinite: true
      });
    } else {
      $slider.filter('.slick-initialized').slick('unslick');
      $slider.find('li, a').removeAttr('tabindex role id aria-describedby');
    }
  }

  //데이터 셋팅(초기화) 함수
  function init() {
    // console.log(completeDataC.length + ',' + completeDataS.length);	
    // $.each(arr, function(index, item) {}): 객체와 배열 모두에서 사용할 수 있는 일반적인 반복함수 > 배열과 유사 배열 객체들을 index를 기준으로 반복

    //#curation
    $.each(completeDataC, function(i, item) { 
      //파싱 작업: 필요한 데이터 뽑아냄
      var $curLi = $('<li></li>'),
          $curA = $('<a href="#" class="db"></a>'),
          $imgArea = $('<p class="img_area pr"></p>'),
          $img = $('<img src="' + item.img + '" alt="" />'),
          $detail = $('<strong class="detail bg_dimed pc"><span class="txt_center">' + item.detail + '</span></strong>'),
          $txtArea = $('<p class="txt_area"></p>'),
          $tit = $('<span class="tit db">' + item.tit + '</span>'),
          $category = $('<span class="category">' + item.category + '</span>');

      //html 추가
      $('#curation > .inner').prepend($curLi);  //최신등록순: 가장 마지막에 들어온 데이터가 가장 첫번째 위치하게
      $curLi.append($curA);
      $curA.append($imgArea);
      $imgArea.append($img);
      $imgArea.append($detail);
      $curA.append($txtArea);
      $txtArea.append($tit);
      $txtArea.append($category);
    });
    
    //#story
    $.each(completeDataS, function(i, item) { 
      //파싱 작업
      var $storyLi = $('<li></li>'),
          $storyA = $('<a href="#" class="db"></a>'),
          $img = $('<img src="' + item.img + '" alt="' + item.detail + '" />'),
          $txtArea = $('<p class="txt_area"></p>'),
          $category = $('<span class="badge_' + item.badge + ' dib">' + item.category + '</span>'),
          $tit = $('<span class="tit db">' + item.tit + '</span>');

      //html 추가
      $('#story > .inner').append($storyLi);  //오래된등록순: 처음 들어온 데이터 순으로 나열
      $storyLi.append($storyA);
      $storyA.append($img);
      $storyA.append($txtArea);
      $txtArea.append($category);
      $txtArea.append($tit);
    }); 
  }

})