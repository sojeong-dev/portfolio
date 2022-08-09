// common JS
'use strict';
var mo_tablet = 1200, // 전역 변수
    mobile = 768;

$(document).ready(function() {
  preventDefaultA();  // 초기화
  settingHeader();    // 헤더 셋팅
  settingGNB();    // GNB 셋팅

  // 탭 메뉴 버튼 클릭 이벤트
  settingTabMenu($('.tab_list > li > a'));
  
  // 언어 변경 클릭 이벤트
  settingTabMenu($('.lang_list > li > a'));

  // 패밀리 사이트 클릭 이벤트(토글)
  $('.family .btn_family_toggle').on('click', function() {
    $(this).toggleClass('on');
  });

  $('.family li').last().on('focusout', function() { // 포커스 강제 이동
    $('.btn_family_toggle').removeClass('on');
  });

  // 구현 페이지 명시
  $('[class *= "made"]').prepend('<span class="ico_blink"></span>');
});

// 더보기 버튼 누르면, max개씩 추가되게 셋팅 함수
function settingAddMore($list, $item, max) {
  var add = max;
  // console.log($list, $item, max, add);

  if($item.length > max) {
    $list.after('<button class="btn btn_more made_load">More</button>'); // 더보기 버튼 추가
    $item.eq(max - 1).nextAll().remove(); // 최대 max개 출력(default)
  }

  // 더보기 버튼 누르면 나머지 추가되게(max개씩)
  var $btnMore = $list.next();
  $btnMore.prepend('<span class="ico_blink"></span>'); // 구현 페이지 명시
  $btnMore.on('click', function() {
    // $list.children().last().find('a').focus();
    // console.log('+' + add, max + '<=i<' + (max + add));
    for(var i = max; i < max + add; i++) {
      $list.append($item.eq(i));
      // console.log(i);
    }
    $item.eq(max).find('a').focus(); // 더보기 버튼 클릭 시, 추가 되는 li요소로 포커스 강제 이동
    // console.log($item.eq(max));
    max += add; // li 추가되게 
    // console.log($item.length, max);
    if($item.length <= max) { // 컨텐츠 다 나오면
      $btnMore.remove(); // 더보기 버튼 제거
    }
  });
}

// 탭 메뉴 셋팅 함수
function settingTabMenu($tabMenu) {
  // 탭 메뉴 버튼 클릭 이벤트
  $tabMenu.on('click', function() {
    $tabMenu.parent().removeClass('on'); // li 초기화
    $(this).parent().addClass('on'); // 선택한 li.on
  });  
}

// GNB 셋팅 함수
function settingGNB() {
  var $header = $('#header'),
      $gnb = $('#gnb'),
      $menu = $gnb.find('.gnb_depth_1 > li > a'),
      $btnToggle = $gnb.prev(), // .btn_gnb_toggle
      $mask = $('#wrap').find('.bg_dimed'); // .bg_dimed

  // 현재 메뉴에 on 표시
  checkCurrentMenu();

  // pc: GNB 열기
  $menu.parent().on('mouseenter focusin', function() { // li
    if($(window).outerWidth() <= mo_tablet) return false; // 모바일 미동작
    $header.addClass('open');
    // $mask.stop(true).fadeIn(); // 부하 일어나지 않게 stop()
  });

  // pc: GNB 닫기
  $header.on('mouseleave focusout', function() {
    if($(window).outerWidth() <= mo_tablet) return false; // 모바일 미동작
    $(this).removeClass('open');
    // $mask.stop(true).fadeOut();
  });

  // mobile: GNB 열기/닫기
  $btnToggle.on('click', function() {
    $(this).toggleClass('on');
    $header.toggleClass('open');
    $gnb.toggleClass('open');
    $mask.toggleClass('on'); // 뒷 배경 어둡게
    $('html, body').toggleClass('scroll_disable'); // 모바일 시, 본문 스크롤 차단
    
    // 메뉴 클릭하면, 하위 메뉴 열기/닫기
    $menu.on('click', function(e) {
      if($(this).parent().find('.gnb_depth_2').length > 0 && $(window).outerWidth() <= mo_tablet) { // 하위 메뉴가 있다면
        $(this).parent().toggleClass('on'); // 선택된 li.on
        $(this).parent().siblings().removeClass('on');
      } 
      e.preventDefault();
    });

    $('.lang_list li').last().on('focusout', function() { // 포커스 강제 이동
      $btnToggle.removeClass('on');
      $header.removeClass('open');
      $gnb.removeClass('open');
      $mask.removeClass('on');
      $('html, body').removeClass('scroll_disable');
    });
  });

  // 반응형 전환 시 처리(초기화)
  $(window).on('resize', function() {
    if($(window).outerWidth() > mo_tablet) { // 1200
      $btnToggle.removeClass('on');
      $header.removeClass('open');
      $gnb.removeClass('open');
      $mask.removeClass('on');
      $('html, body').removeClass('scroll_disable');
    }
  });

  // 현재 페이지 메뉴에 on 표시하는 함수
  function checkCurrentMenu() {
    // 메뉴 키워드 식별(menuName[0], menuName[1], menuName[2])
    var menuName = $('body').attr('class').split(' ');
    // console.log(menuName[menuName.length - 1]);

    // 메뉴에 맞는 대메뉴명 표시
    $menu.parent().each(function() { // .gnb_depth_1 > li
      if(menuName[1] === $(this).attr('data-menu')) {
        $(this).addClass('on'); // li.on
      }
    });

    // 메뉴에 맞는 하위 메뉴명 표시
    $menu.siblings().find('li').each(function() { // li.on > .gnb_depth_2 > li
      if(menuName[2] === $(this).attr('data-menu')) {
        $(this).addClass('on'); // li.on
      }
    });
  }
}

// 헤더 셋팅 함수
function settingHeader() {
  var $header = $('#header');

  checkScrollHeader();
  // 헤더 스크롤 이벤트
  $(window).on('scroll', function() {
    checkScrollHeader();
  });
  
  // 헤더가 변경될 스크롤 위치 찾는 함수
  function checkScrollHeader() {
    var triggerElement = $('.main_visual'),
        trigger = 0;

    if($('body').hasClass('main')) trigger = triggerElement.outerHeight() - $header.outerHeight();

    if($(document).scrollTop() > trigger) $header.addClass('down');
    else $header.removeClass('down');
  }
}

// <a href="#"> 링크 기본 동작 비활성화 함수
function preventDefaultA() {
  $(document).on('click', 'a[href="#"]', function(e) { // 이벤트 위임
    e.preventDefault();
  });
}