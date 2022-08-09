// common JS
'use strict';
var mo_tablet = 1024, // 전역 변수
    mobile = 600;

$(document).ready(function() {
  preventDefaultA();  // 초기화
  scrollPageTop();    // 페이지 맨 위로 이동 
  settingGNB();       // GNB 셋팅

  // 탭 메뉴 버튼 클릭 이벤트
  $('.tab_list > li > a').on('click', function() {
    $('.tab_list > li > a').parent().removeClass('on'); // 초기화
    $(this).parent().addClass('on');
  });  

  // 패밀리 사이트 열기/닫기 클릭 이벤트
  $('.family > .btn_family_toggle').on('click', function() {
    $(this).toggleClass('on');
  });
  $('.family > .btn_family_toggle').parent().find('li').last().on('focusout', function() { // 포커스 강제 이동
    $('.family > .btn_family_toggle').removeClass('on');
  });

  // 구현 페이지 명시
  $('[class *= "made"]').prepend('<span class="ico_blink"></span>');
});

// GNB 셋팅 함수
function settingGNB() {
  var $gnb = $('#gnb'),
      $menu = $gnb.find('ul > li > a'),
      $btnOpen = $gnb.prev(), // .btn_gnb
      $btnClose = $gnb.children().last(); // .btn_gnb_close

  // 현재 메뉴에 on 표시
  checkCurrentMenu();

  // GNB 열기
  $btnOpen.on('click focus', function() {
    $gnb.addClass('open');
    $('#wrap').append('<span class="bg_dimed on"></span>'); // 뒷 배경 어둡게
    $('html, body').addClass('scroll_disable'); // 모바일 시, 본문 스크롤 차단
  });

  // GNB 닫기
  $btnClose.on('click blur', function() {
    $(this).parent().removeClass('open'); // #gnb
    $('#wrap > .bg_dimed').remove();
    $('html, body').removeClass('scroll_disable');
  });

  // 반응형 전환 시 처리(초기화)
  $(window).on('resize', function() {
    if($(window).outerWidth() > mo_tablet) { // 1024
      $gnb.removeClass('open'); 
      $('#wrap > .bg_dimed').remove();
      $('html, body').removeClass('scroll_disable');
    }
  });

  // 현재 페이지 메뉴에 on 표시하는 함수
  function checkCurrentMenu() {
    // 메뉴 키워드 식별(menuName[0], menuName[1])
    var menuName = $('body').attr('class').split(' ');
    // console.log(menuName[menuName.length - 1]);

    // 메뉴에 맞는 메뉴명 표시
    $menu.parent().each(function() {  // li
      if(menuName[1] === $(this).attr('data-menu')) {
        $(this).addClass('on'); // li.on
      }
    });
  }
}

// 페이지 맨 위로 이동(부드럽게) 함수
function scrollPageTop() {
  var $btnTop = $('.btn_page_top');

  checkScrollTop();
  // 스크롤 이벤트
  $(window).on('scroll', function() {
    checkScrollTop();
  });

  function checkScrollTop() {
    if($(document).scrollTop() > 0) $btnTop.addClass('on');
    else $btnTop.removeClass('on'); 
  }

  // 클릭 이벤트
  $btnTop.on('click', function() {
    $('html, body').stop(true).animate({'scrollTop': 0}, 500); // 스크롤 부드럽게
  });
}

// <a href="#"> 링크 기본 동작 비활성화 함수
function preventDefaultA() {
  $(document).on('click', 'a[href="#"]', function(e) { // 이벤트 위임
    e.preventDefault();
  });
}