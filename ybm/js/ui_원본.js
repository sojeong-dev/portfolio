$(function() {
  'use strict';

  // a링크 기본동작 막음
  $(document).on('click', 'a[href="#"]', function(e) {  
    e.preventDefault(); 
  });

  var $header = $('#header'),
      mobileW = 768;

  setScrollUI();
  setGNB();
  setNewsUI();

  $(window).on('scroll', function() {
    setScrollUI();
  });

  //스크롤 맨 위로 이동
  $('#quickMenu .btn_scroll_top').on('click', function() {  
    $('html, body').stop().animate({'scrollTop': 0}, 500);
  });

  function setScrollUI() {  //스크롤 발생시 UI 셋팅 
    if($(document).scrollTop() > 0) { //헤더 스크롤 다운
      $header.addClass('down');
    } else {
      $header.removeClass('down');
    }
    
    checkScrollAmt();
  }
  
  function setGNB() { //GNB 셋팅
    var $gnb = $header.find('#gnb'),
        $btnOpen = $gnb.prev(), //.btn_gnb_ham
        $btnClose = $gnb.children().last(), //.btn_gnb_close
        $bgDim = $header.children().last(); //#header > .bg_dimed

    $btnOpen.on('click', function() {
      $bgDim.addClass('open'); 
      $gnb.addClass('open');  
     
      $gnb.find('li.menu_side').siblings().each(function(i) { //GNB 열리면 메뉴 순서대로 나오게 
        $(this).css({'transition-delay': '0.' + (i + 1) +'s'});
      });
    });

    $btnClose.on('click', function() { 
      $bgDim.removeClass('open'); 
      $gnb.removeClass('open');
    });
  }

  function setNewsUI() {  //뉴스 셋팅
    var $news = $header.find('.hd_news'),
        $newsTop = $news.find('.news_top_random'),
        $newsMain = $news.find('.news_main'),
        $btnToggle = $news.find('.btn_toggle');

    getRandomDataFn($newsTop, $newsMain); 
    //pc용
    $newsTop.on('mouseenter focus', function() {  
      if($(window).outerWidth() <= mobileW) return false; //모바일 미동작
      $newsMain.addClass('open');
    });
    
    $newsMain.on('mouseleave', function() {
      if($(window).outerWidth() <= mobileW) return false; //모바일 미동작
      $(this).removeClass('open');
    });

    $newsMain.children().last().on('focusout', function() { //접근성
      if($(window).outerWidth() <= mobileW) return false; //모바일 미동작
      $newsMain.removeClass('open');
    });

    //mobile용
    $btnToggle.on('click', function() {
      $(this).toggleClass('on');
      $newsMain.toggleClass('open');
    });

    checkScrollVisual($news);

    $(window).on('scroll', function() {
      if($(window).outerWidth() <= mobileW) {
        checkScrollVisual($news);
      } 
    });

    $(window).on('resize', function() {
      if($(window).outerWidth() > mobileW) {  //pc 리사이즈시 초기화
        $btnToggle.removeClass('on');
        $newsMain.removeClass('open');
        $news.removeClass('hide');
      }
    });
  }

  function getRandomDataFn($newsTop, $newsMain) { //메인뉴스 랜덤하게 가져오는 함수
    var $newsData = $newsMain.find('.txt_data'),
        random = Math.floor((Math.random() * $newsData.length));  //0 ~ n  
    $newsTop.text($newsData[random].innerText);
  }

  function checkScrollVisual($news) { //.main_visual 넘어가면 뉴스 안보이게
    var $visual = $header.next().find('.main_visual'),
        visualH = $visual.outerHeight() - $header.outerHeight();

    if($(document).scrollTop() > visualH) {
      $news.addClass('hide');
    } else {
      $news.removeClass('hide');
    }
  }

  function checkScrollAmt() { //.main_content영역에서만 타이틀 보이게
    var $mainCont = $header.next().find('.main_content'),
        $titTop = $header.find('.sec_tit_top'), 
        scrollAmt = $(document).scrollTop();

    $titTop.text(''); //초기화

    $mainCont.each(function() {
      $mainCont = $(this);
      var $titData = $mainCont.find('.sec_tit'),
          minScroll = $mainCont.offset().top,
          maxScroll = $mainCont.offset().top + $mainCont.outerHeight();

      if(minScroll <= scrollAmt && scrollAmt < maxScroll) {
        $titTop.text($titData.text());
      } 
    });
  }
});