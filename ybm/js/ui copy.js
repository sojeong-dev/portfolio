$(function() {
  'use strict';

  //전역함수
  var $header = $('header'),  //*jquery 객체 참조할 시 > 변수 이름 앞에 $를 붙여 표시
      mobile = 768;

  init();
  settingNavFn();
  settingNewsFn();
  scrollFn();

  $(window).on('scroll', function() {
    scrollFn(); 
  });

  $(window).on('resize', function() {
    // 반응형 전환시 처리(초기화)
    $('.news .btn_toggle').removeClass('on');
    $('nav').removeClass('open');
    $('header > .bg_dimed').removeClass('on');
  });

  //스크롤 맨 위로 이동(부드럽게)
  $('#quickMenu > .btn_scroll_top').on('click', function() {
    //*$("html").scrollTop(0);	//처음 상단으로 올림
    //=> scrollTop(): 선택한 요소의 수직위치을 알아내거나 특정값으로 이동시킴
    //*브라우저마다 $('html'), $('html, body') 잡는 영역 다름 > $('html, body') 권장
    $('html, body').stop().animate({'scrollTop': 0}, 500);	
  });

  //스크롤 셋팅 함수
  function scrollFn() {
    //헤더 스크롤 이벤트
    if($(document).scrollTop() > 0) {
      $header.addClass('down');
    } else {
      $header.removeClass('down');
    }

    //뉴스 스크롤 이벤트
    checkScrollTopFn($header.find('.news'));    

    //컨텐츠 스크롤 이벤트
    checkScrollAmtFn($('.main_content'));
  }

  //요소가 변경될 스크롤 위치 찾는 함수
  function checkScrollTopFn($selector) {  //$header.find('.news')
    var $triggerElement = $('.main_visual'),
        trigger = $triggerElement.outerHeight() - $header.find('.hd_main').outerHeight();

    //요소 트리거 지점을 넘어가면 뉴스 없앰
    if($(document).scrollTop() > trigger) {
      $selector.addClass('hide');
      $header.css({'height': 'auto'}); 
      $selector.find('.btn_toggle').removeClass('on');  //초기화
    } else {
      $selector.removeClass('hide');
      $header.removeAttr('style');  //해제
    }
  }
  
  //요소가 들어설 스크롤 범위(amount) 찾는 함수
  function checkScrollAmtFn($selector) {  //.main_content
    var $tit = $header.find('.txt_cont_tit'),
        scrollAmt = $(document).scrollTop();

    $tit.text(''); //초기화

    $selector.each(function() {
      $selector = $(this);
      var $titData = $selector.find('h2'),
          minScroll = $selector.offset().top,
          maxScroll = $selector.offset().top + $selector.outerHeight();
      // console.log(scrollAmt + '/' + minScroll + '/' + maxScroll);

      //메인 컨텐츠 영역에 들어서면 타이틀 보이게
      if(minScroll <= scrollAmt && scrollAmt < maxScroll) {
        $tit.text($titData.text());
      }
    })
  }

  //뉴스 셋팅 함수
  function settingNewsFn() {
    var $news = $header.find('.news'),
        $tit = $news.find('.txt_news_random'),
        $btnToggle = $news.find('.btn_toggle'),
        $article = $news.find('article'),
        $titData = $article.find('.txt_data'),
        random = 0;

    //뉴스 데이터 랜덤으로 타이틀에 들어가게
    random = Math.floor(Math.random() * $titData.length); //0~
    $tit.text($titData[random].innerText);

    //pc: 뉴스 열기    
    $tit.on('mouseenter focus', function() {
      if($(window).outerWidth() <= mobile) return false; //모바일 미동작
      $article.addClass('open');
    });    

    //pc: 뉴스 닫기
    $article.on('mouseleave', function() {
      if($(window).outerWidth() <= mobile) return false; //모바일 미동작
      $(this).removeClass('open');
    });

    //mobile: 뉴스 열기/닫기
    $btnToggle.on('click', function() {
      $(this).toggleClass('on');
    });
  }

  //네비 셋팅 함수
  function settingNavFn() {
    var $nav = $header.find('#nav'),
        $btnOpen = $nav.prev(),
        $btnClose = $nav.children().last(),
        $bgDimed = $header.children().last();

    //네비 열기
    $btnOpen.on('click', function() {
      $nav.addClass('open');
      $bgDimed.addClass('on');

      //메뉴 순서대로 나오게
      $nav.find('li.menu_bottom').siblings().each(function(i) {
        $(this).css({'transition-delay': '0.' + (i + 1) + 's'});
      })

      //모바일 시, 본문 스크롤 차단
      if($(window).width() <= mobile) $('html, body').addClass('scroll_disable'); 
    });   
    
    //네비 닫기
    $btnClose.on('click', function() {
      $nav.removeClass('open');
      $bgDimed.removeClass('on');
      $('html, body').removeClass('scroll_disable');
    });

  }

  //기본 셋팅(초기화) 함수
  function init() {
    //a링크 기본동작 막음
    $(document).on('click', 'a[href="#"]', function(e) {  
      e.preventDefault(); 
    });

    //html 요소 추가
    $header.find('.hd_main > .inner').append('<span class="txt_cont_tit txt_center pc"></span>');
    $header.append('<span class="bg_dimed"></span>');
  }
















  



      

});