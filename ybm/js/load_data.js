$(function() {
  'use strict';

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
        console.log('data load complete');
        // console.log(result);           //json파일이 담김 //{curation: Array(13), story: Array(8)}
        completeDataC = result.curation;  //배열 담음 
        completeDataS = result.story;
        // console.log(completeDataC, completeDataS);
  
        init(); //데이터 셋팅(초기화)
        settingUIFn(); //UI 셋팅
      }
    });
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
        
    //열 갯수: 박스(ul.inner) 너비 / 카드(li) 너비
    colNum = Math.floor(boxWidth / cardWidth);  

    //행 갯수: 카드(li) 갯수 / 열 갯수
    rowNum = Math.ceil($card.length / colNum);  

    //카드(li) 행 갯수를 이용하여 박스(ul.inner) 높이 설정
    //박스(ul.inner) 높이: 카드(li) 높이 X 행 갯수 
    boxHeight = cardHeight * rowNum;

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

    //#curation
    $.each(completeDataC, function() { 
      //파싱 작업: 필요한 데이터 뽑아냄
      var innerHTML = '\n';
          innerHTML += '<li>\n';
          innerHTML += ' <a href="#">\n';
          innerHTML += '   <p class="img_area">\n';
          innerHTML += '     <img src="' + this.img + '" alt="" />\n';
          innerHTML += '     <strong class="detail bg_dimed pc">\n';
          innerHTML += '       <span class="txt_center">' + this.detail + '</span>\n';
          innerHTML += '     </strong>\n';
          innerHTML += '   </p>\n';
          innerHTML += '   <p class="txt_area">\n';
          innerHTML += '     <span class="tit">' + this.tit + '</span>\n';
          innerHTML += '     <span class="category">' + this.category + '</span>\n';
          innerHTML += '   </p>\n';
          innerHTML += ' </a>\n';
          innerHTML += '</li>\n';

      //html 추가
      $('#curation > .inner').prepend(innerHTML);  //최신등록순: 가장 마지막에 들어온 데이터가 가장 첫번째 위치하게
    });//each(completeDataC)
    
    //#story
    $.each(completeDataS, function() { 
      var innerHTML = '\n';
          innerHTML += '<li>\n';
          innerHTML += '  <a href="#">\n';
          innerHTML += '    <img src="' + this.img + '" alt="' + this.detail + '" />\n';
          innerHTML += '    <p class="txt_area">\n';
          innerHTML += '      <span class="badge_' + this.badge + '">' + this.category + '</span>\n';
          innerHTML += '      <span class="tit">' + this.tit + '</span>\n';
          innerHTML += '    </p>\n';
          innerHTML += '  </a>\n';
          innerHTML += '</li>\n';

      //html 추가
      $('#story > .inner').append(innerHTML);  //오래된등록순: 처음 들어온 데이터 순으로 나열
    });//each(completeDataS)
  }

})