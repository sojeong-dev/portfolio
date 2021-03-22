
$(function() {
  'use strict';

  var $header = $('#header'),
      mobile = 1280;

  init();             //초기화
  settingGNBFn();     //GNB 셋팅 함수
  scrollFn();         //스크롤 셋팅 함수
  // scrollTriggerFn();  //GSAP scrollTrigger 셋팅

  $(window).on('scroll resize', function() {
    scrollFn();
  });

  //헤더 언어 변경 클릭 이벤트
  $header.find('.lang_list > li > a').on('click', function() {
    $header.find('.lang_list > li').removeClass('on'); //초기화
    $(this).parent().addClass('on');  //li.on
  });

  //메인 비주얼 높이 설정
  $('.main_visual').css({'height': $(window).outerHeight()});

  //푸터 family site 버튼 클릭 이벤트
  $('#footer .family > .btn_link_toggle').on('click', function() {
    $(this).toggleClass('on');
  });

  //탭 메뉴 버튼 클릭 이벤트
  $('.tab_menulist > li > a').on('click', function() {
    $('.tab_menulist > li > a').parent().removeClass('on');  //초기화
    $(this).parent().addClass('on');
  });

  // //GSAP scrollTrigger 셋팅 함수
  // function scrollTriggerFn() {
  //   //위로 나타나게
  //   var $selector = $('.scroll_trigger'),
  //       $selectorChild;

  //   $selector.each(function() {
  //     $selector = $(this);
  //     $selectorChild = $selector.find('.scroll_ani_up');

  //     var timeLine = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: $selector,
  //         // start: 'top bottom-=50',
  //         // end: 'bottom center',
  //         start: 'top bottom',
  //         end: '+=350',
  //         // markers: true,
  //         scrub: 0.5
  //       }
  //     });
  //     timeLine.from($selectorChild, {autoAlpha: 0, y: 80, ease: 'Power1.easeOut'});
  //   });
    
  //   $(window).on('load', function() {
  //     ScrollTrigger.refresh();
  //   });
  // }

  //스크롤 셋팅 함수
  function scrollFn() {
    //헤더 스크롤 이벤트
    checkScrollTopFn($header);
  }

  //#header: 요소가 변경될 스크롤 위치 찾는 함수
  function checkScrollTopFn($selector) {  //header
    var trigger = 0;
    if($('body').hasClass('main')) trigger = $('.main_visual').outerHeight() - $selector.outerHeight();
  
    // if ($('.navi_area').hasClass('open')) return false; //네비가 열린 상태에서는 미동작
    if($(document).scrollTop() > trigger) {
      $selector.addClass('down');
    } else {
      $selector.removeClass('down');
    }
  }

  //#gnb 셋팅 함수
  function settingGNBFn() {
    var $gnb = $header.find('#gnb'),
        $menu = $gnb.find('.gnb_depth1 > li > a'),
        $btnToggle = $header.find('.btn_gnb_toggle'),
        $naviArea = $btnToggle.next();

    //현재 메뉴에 on 표시
    checkCurrentMenuFn();

    //pc: 네비 열기
    //*focus, click 등 이벤트는 a링크에 직접주는 것이 좋지만, focusin/focusout: 버블링되므로 li에 이벤트 붙임 > 헤더가 열린상태로 하위 메뉴까지 포커스가 가기위새서
    $menu.parent().on('mouseenter focusin', function() {  //li
      if($(window).outerWidth() <= mobile) return false;  //모바일 미동작
      $header.addClass('open');
    });

    //pc: 네비 닫기
    $header.on('mouseleave focusout', function() {
      if($(window).outerWidth() <= mobile) return false;  //모바일 미동작
      $header.removeClass('open');
    });

    //mobile: 네비 열기
    $btnToggle.on('click', function() {
      $(this).toggleClass('on');
      $naviArea.toggleClass('open');
      $header.toggleClass('open')
      $('html, body').toggleClass('scroll_disable');

      //메뉴 클릭하면, 하위 메뉴 나오게
      $menu.on('click', function(e) {
        if($(window).outerWidth() <= mobile && $(this).parent().find('ul').length > 0) {
          e.preventDefault(); //메뉴 클릭될 때, 상단으로 올라가지 않게 기본동작 막음

          $(this).parent().toggleClass('on'); //li.on > ul {display: block;}
          $(this).parent().siblings().removeClass('on'); 
        }
      });
    });

    //반응형 전환시 처리(초기화)
    $(window).on('resize', function() { 
      if($(window).outerWidth() > mobile) {  
        $btnToggle.removeClass('on');
        $naviArea.removeClass('open');
        $header.removeClass('open');
        $('html, body').removeClass('scroll_disable');
      }
    });
  }

  //현재 메뉴에 on 표시하는 함수
  function checkCurrentMenuFn() {
    var $gnb = $header.find('#gnb'),
        $menu = $gnb.find('.gnb_depth1 > li > a');

    //메뉴 키워드 식별 (menuName[0], menuName[1], menuName[2])
    var menuName = $('body').attr('class').split(' ');
    // console.log(menuName[menuName.length - 1]);

    //메뉴에 맞는 대매뉴명 표시
    $menu.parent().each(function() {  //li
      if(menuName[1] === $(this).attr('data-menu')) {
        $(this).addClass('on');
      }
    });

    //메뉴에 맞는 하위메뉴명 표시
    $menu.siblings().find('li').each(function() {  //li.on > ul > li
      if(menuName[2] === $(this).attr('data-menu')) {
        $(this).addClass('on');
      }
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

