$(function() {
  'use strict';

  //전역변수
  var $header = $('header'),
      mobile = 768;

  init();           //초기화
  settingNavFn();   //네비 셋팅 함수
  settingNewsFn();  //뉴스 셋팅 함수
  scrollFn();       //스크롤 셋팅 함수

  $(window).on('scroll resize', function() {
    scrollFn(); 
  });

  //pc: visualMenu li 포커스 적용
  $('#visualMenu li').on('focusin focusout', function() {
    if($(window).outerWidth() <= mobile) return false; //모바일 미동작
    $(this).toggleClass('focus'); //ie
  });

  //스크롤 맨 위로 이동(부드럽게)
  $('#quickMenu > .btn_scroll_top').on('click', function() {
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

    //컨텐츠 타이틀 스크롤 이벤트
    checkScrollAmtFn($('.main_content'));
  }

  //header news: 요소가 변경될 스크롤 위치 찾는 함수
  function checkScrollTopFn($selector) {  //$header.find('.news')
    var $triggerElement = $('.main_visual'),
        trigger = $triggerElement.outerHeight() - $header.find('.hd_main').outerHeight();

    //mobile: 요소 트리거 지점을 넘어가면 뉴스 없앰
    if($(document).scrollTop() > trigger && $(window).outerWidth() <= mobile) {
      $selector.addClass('hide');
      $header.css({'height': 'auto'}); 
      $header.find('.btn_toggle').removeClass('on');  //초기화
    } else {
      $selector.removeClass('hide');
      $header.removeAttr('style');  //해제
    }
  }
  
  //main_content: 요소가 들어설 스크롤 범위(amount) 찾는 함수
  function checkScrollAmtFn($selector) {  //.main_content
    var $tit = $header.find('.txt_cont_tit'),
        scrollAmt = $(document).scrollTop();

    $tit.text(''); //초기화

    $selector.each(function() {
      $selector = $(this);
      var $titData = $selector.find('h2'),
          triggerStart = $selector.offset().top,
          triggerEnd = $selector.offset().top + $selector.outerHeight();
      // console.log(scrollAmt + '/' + triggerStart + '/' + triggerEnd);

      //pc: 메인 컨텐츠 영역에 들어서면 타이틀 보이게
      if(triggerStart <= scrollAmt && scrollAmt < triggerEnd && $(window).outerWidth() > mobile) {
        $tit.text($titData.text());
      }
    });
  }

  //header news 셋팅 함수
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
    $tit.on('mouseenter focusin', function() {
      if($(window).outerWidth() <= mobile) return false; //모바일 미동작
      $article.addClass('open');
    });    

    //pc: 뉴스 닫기
    $article.on('mouseleave', function() {
      if($(window).outerWidth() <= mobile) return false; //모바일 미동작
      $(this).removeClass('open');
    });
    
    //pc: 접근성
    $article.children().last().on('focusout', function() {
      if($(window).outerWidth() <= mobile) return false; //모바일 미동작
      $article.removeClass('open');
    });

    //mobile: 뉴스 열기/닫기
    $btnToggle.on('click', function() {
      $(this).toggleClass('on');
    });

    //반응형 전환 시 처리(초기화)
    $(window).on('resize', function() {
      if($(window).outerWidth() > mobile) {
        $btnToggle.removeClass('on');
      }
    });
  }

  //nav 셋팅 함수
  function settingNavFn() {
    var $nav = $header.find('#nav'),
        $btnOpen = $nav.prev(),
        $btnClose = $nav.children().last(),
        $bgDimed = $header.children().last();

    //네비 열기
    $btnOpen.on('click focus', function() {
      $nav.addClass('open');
      $bgDimed.addClass('on');

      //메뉴 순서대로 나오게
      $nav.find('li.menu_bottom').siblings().each(function(i) {
        $(this).css({'transition-delay': '0.' + (i + 1) + 's'});
      });

      //모바일 시, 본문 스크롤 차단
      if($(window).width() <= mobile) $('html, body').addClass('scroll_disable'); 
    });   
    
    //네비 닫기
    $btnClose.on('click blur', function() {
      $nav.removeClass('open');
      $bgDimed.removeClass('on');
      $('html, body').removeClass('scroll_disable');
    });

    //반응형 전환시 처리(초기화)
    $(window).on('resize', function() {
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
  }

});