// JS
'use strict';
var mobile = 768; // 전역 변수

$(document).ready(function() {
  preventDefaultA();  // 초기화
  scrollPageTop();    // 페이지 맨 위로 이동
  settingHeader();    // 헤더 셋팅
  settingGNB();       // GNB 셋팅
  settingNews();      // 뉴스 셋팅
  checkVisibility();  // 컨텐츠 영역 보이는 범위 찾기
  settingSlider();    // 슬라이더 셋팅

  // pc: #mainVisual li에 포커스 강제 적용
  $('#mainVisual li').on('focusin focusout', function() {
    if($(window).outerWidth() <= mobile) return false; // 모바일 미동작
    $(this).toggleClass('focus'); // ie
  });

  // #quickNav ul, #quickNav li > a에 포커스 강제 적용
  $('#quickNav ul').on('focusin focusout', function() {
      $(this).toggleClass('focus'); // ie
  });
  
  $('#quickNav li > a').on('focusin focusout', function() {
    $(this).toggleClass('focus'); // ie
  });

});

// 슬라이더 셋팅 함수
function settingSlider() {
  visualSlider();
  storySlider();
  partnerSlider();
  
  // slick 슬라이더 리사이즈 이벤트
  $(window).on('resize', function() {
    visualSlider();
    storySlider();
    partnerSlider();
  });

  // #partner ul에 slick 셋팅
  function partnerSlider() {
    var $slider = $('#partner > .inner > ul'), breakpoint = 1024;
    if($(window).outerWidth() <= breakpoint) { // 1024 이하
      $slider.not('.slick-initialized').slick({
        prevArrow: '<button class="slick-prev" aria-label="이전 슬라이드" style=""><img src="./img/common/btn_slide_prev.png" alt="이전 슬라이드" /></button>',
        nextArrow: '<button class="slick-next" aria-label="다음 슬라이드" style=""><img src="./img/common/btn_slide_next.png" alt="다음 슬라이드" /></button>',
        responsive: [
          {
            breakpoint: 9999, // pc
            settings: "unslick"
          },
          {
            breakpoint: 1025, // 1024 이하
            settings: {
              arrows: true,
              dots: false,
              infinite: true,
              slidesToShow: 5,
              slidesToScroll: 1,
              swipeToSlide: true,
              // variableWidth: true,
            }
          },
          {
            breakpoint: 769,
            settings: {
              slidesToShow: 3,
            }
          },
          // {
          //   breakpoint: 480,
          //   settings: {
          //     slidesToShow: 2,
          //   }
          // }
        ]
      });
    } else { // pc
      $slider.filter('.slick-initialized').slick('unslick').find('li, a').removeAttr('tabindex aria-hidden');
    }
  }

  // #story ul에 slick 셋팅
  function storySlider() {
    var $slider = $('#story > .inner > ul'), breakpoint = mobile;
    if($(window).outerWidth() <= breakpoint) {
      $slider.not('.slick-initialized').slick({
        mobileFirst: true,  // 모바일 우선 
        arrows: false,
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        centerMode: true,
        variableWidth: true,
        responsive: [
          {
            breakpoint: mobile, // 769 이상 == pc
            settings: "unslick"
          }
        ]
      });
    } else {
      $slider.filter('.slick-initialized').slick('unslick').find('li, a').removeAttr('tabindex role id aria-describedby aria-hidden');
    }
  }

  // #mainVsiual ul에 slick 셋팅
  function visualSlider() {
    var $slider = $('#mainVisual > ul'), breakpoint = mobile;
    if($(window).outerWidth() <= breakpoint) {
      $slider.not('.slick-initialized').slick({
        mobileFirst: true,  // 모바일 우선 
        arrows: false,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        responsive: [
          {
            breakpoint: mobile, // 769 이상 == pc
            settings: "unslick"
          }
        ]
      });
    } else {
      $slider.filter('.slick-initialized').slick('unslick').find('li, a').removeAttr('tabindex role id aria-describedby aria-hidden');
    }
  }
}

// 컨텐츠 영역 보이는 범위 찾는 함수
function checkVisibility() {
  var $section = $('.main_content');

  checkScrollAmt($section); 
  // 컨텐츠 스크롤 이벤트
  $(window).on('scroll resize', function() {
    checkScrollAmt($section);
  });

  // 요소(.main_content)가 들어설 스크롤 범위 찾는 함수
  function checkScrollAmt($selector) { // $section
    var $header = $('#header'),
        $tit = $header.find('.txt_cont_tit'),
        scrollAmt = $(document).scrollTop();

    $tit.text(''); //초기화

    $selector.each(function() {
      $selector = $(this);
      var $titData = $selector.find('h2'),
          triggerStart = $selector.offset().top,
          triggerEnd = $selector.offset().top + $selector.outerHeight();
      // console.log(scrollAmt + '/' + triggerStart + '/' + triggerEnd);

      // pc: 메인 컨텐츠 영역에 들어서면 타이틀 보이게
      if(triggerStart <= scrollAmt && scrollAmt < triggerEnd && $(window).outerWidth() > mobile) 
        $tit.text($titData.text());
    });
  }
}

// 뉴스 셋팅 함수
function settingNews() {
  var $header = $('#header'),
      $news= $header.find('.news'),
      $tit = $news.find('.txt_news_random'),
      $btnToggle = $news.find('.btn_news_toggle'),
      $article = $news.find('article'),
      $titData = $article.find('.txt_data'),
      random = 0;
  
  checkScrollTop($news);
  // 뉴스 스크롤 이벤트
  $(window).on('scroll', function() {
    checkScrollTop($news);
  })

  // 뉴스 데이터 랜덤으로 타이틀에 들어가게
  random = Math.floor(Math.random() * $titData.length); // 0 <= random <= 1
  $tit.text($titData[random].innerText);

  // pc: 뉴스 열기
  $tit.on('mouseenter focusin', function() {
    if($(window).outerWidth() <= mobile) return false; // 모바일 미동작
    $article.addClass('open');
  });

  // pc: 뉴스 닫기
  $article.on('mouseleave', function() {
    if($(window).outerWidth() <= mobile) return false; // 모바일 미동작
    $(this).removeClass('open');
  });

  $article.children().last().on('focusout', function() { // 포커스 강제 이동
    if($(window).outerWidth() <= mobile) return false; // 모바일 미동작
    $article.removeClass('open');
  });

  // mobile: 뉴스 열기/닫기
  $btnToggle.on('click', function() {
    $(this).toggleClass('on');
  });

  // 반응형 전환 시 처리(초기화)
  $(window).on('resize', function() {
    if($(window).outerWidth() > mobile) {
      $btnToggle.removeClass('on');
    }
  });

  // 요소(.news)가 변경될 스크롤 위치 찾는 함수
  function checkScrollTop($selector) { //$news
    var $triggerElement = $('.main_visual'),
        trigger = $triggerElement.outerHeight() - $header.find('.header_main').outerHeight();
    
    // mobile: 트리거(메인 비주얼) 지점 넘어가면 뉴스 없앰
    if($(document).scrollTop() > trigger && $(window).outerWidth() <= mobile) {
      $selector.addClass('hide');
      $header.css({'height': 'auto'}); 
      $btnToggle.removeClass('on');  //초기화
    } else {
      $selector.removeClass('hide');
      $header.removeAttr('style');  // 해제
    }
  }
}

// GNB 셋팅 함수
function settingGNB() {
  var $gnb = $('#gnb'),
      $btnOpen = $gnb.prev(), // .btn_gnb
      $btnClose = $gnb.children().last(), // .btn_gnb_close
      $mask = $('#header').children().last(); // .bg_dimed
  
  // GNB 열기
  $btnOpen.on('click focus', function() {
    $gnb.addClass('open');
    $mask.addClass('on'); // 뒷 배경 어둡게

    // 메뉴 순서대로 나오게
    $gnb.find('li.menu_bottom').siblings().each(function(i) {
      // $(this).css({'transition-delay': (i * 0.1) + 's'});
    });

    // 모바일 시, 본문 스크롤 차단
    if($(window).outerWidth() <= mobile) $('html, body').addClass('scroll_disable'); 
  });

  // GNB 닫기
  $btnClose.on('click blur', function() {
    $(this).parent().removeClass('open'); // #gnb
    $mask.removeClass('on');
    $('html, body').removeClass('scroll_disable');
  });

  // 반응형 전환 시 처리(초기화)
  $(window).on('resize', function() {
    $gnb.removeClass('open');
    $mask.removeClass('on');
    $('html, body').removeClass('scroll_disable');
  });
}

// 헤더 셋팅 함수
function settingHeader() {
  var $header = $('#header');

  checkScrollHeader();
  // 헤더 스크롤 이벤트
  $(window).on('scroll', function() {
    checkScrollHeader();
  });
  
  // 헤더 스크롤 다운 함수
  function checkScrollHeader() {
    if($(document).scrollTop() > 0) $header.addClass('down');
    else $header.removeClass('down');
  }
}

// 페이지 맨 위로 이동(부드럽게) 함수
function scrollPageTop() {
  $('.btn_page_top').on('click', function() {
    // $('html, body').scrollTop(0); // 맨 위(상단)으로 올림
    $('html, body').stop(true).animate({'scrollTop': 0}, 500); // 스크롤 부드럽게
  });
}

// <a href="#"> 링크 기본 동작 비활성화 함수
function preventDefaultA() {
  $(document).on('click', 'a[href="#"]', function(e) { // 이벤트 위임
    e.preventDefault();
  });
}