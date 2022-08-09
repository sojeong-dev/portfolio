// main JS
$(document).ready(function() {
  'use strict';
  
  settingPageNav(); // 메인 페이지 네비 셋팅
  settingSlider();  // 슬라이더 셋팅
  settingGSAP();    // GSAP 셋팅

  // 메인비주얼 화면 높이가 뷰포트 높이와 같게 셋팅
  $('.main_visual').css({'height': $(window).innerHeight()}); // 메인 비주얼 높이 설정
  $(window).on('resize', function() {
    $('.main_visual').css({'height': $(window).innerHeight()});
  });

});

// GSAP 셋팅 함수
function settingGSAP() {
  // GSAP 애니메이션 셋팅
  var gsapAnimation = function() {
    var tl = gsap.timeline({default: {duration: .8}});

    if(!($('#header').hasClass('down'))) {
      tl.from('#mainVisual .bg_frame_light', {opacity: 0, scale: .2, duration: 1})
        .from('#mainVisual .slogan strong', {y: 40, color: 'transparent'})
        .from('#mainVisual .slogan strong + p', {color: 'transparent'})
        .from('#mainVisual .ico_scroll', {y: -40, opacity: 0});
    }
    $(window).on('scroll', function() {
      tl.progress(1); // 타임라인 진행률 설정 // 1: 스크롤 발생 시 애니메이션 바로 완료
    });
  };
  gsapAnimation();

  // GSAP ScrollTrigger 셋팅
  var scrollTrigger1 = function() {
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#mainVisual .slogan', // triggerElement, 스크롤 애니메이션 시작 지점 // '#mainVisual'이 뷰포트에 들어갈 때 애니메이션 애니메이션 시작
        start: 'center center', // start: (default)'top(triggerElement) bottom(viewport)' // 트리거 중앙이 뷰포트 중앙에 닿을 때
        // markers: true,
        scrub: .3, // 부드러운 스크러빙, 스크롤바를 잡는데 0.3초 걸림, 되감기(애니메이션 재사용)
      }
    });
    // 애니메이션 및 레이블을 타임 라인에 추가
    tl.addLabel('hide')
      .to('#mainVisual .slogan strong', {opacity: 0, scale: .7}, 'hide')
      .to('#mainVisual .slogan strong + p', {y: 40, opacity: 0}, 'hide'); // 동시에 애니메이션 나오게
  };
  scrollTrigger1();

  var scrollTrigger2 = function() {
    var $section = $('#onAir, #works, #news');

    $section.each(function() {
      $section = $(this);
      var $h2 = $section.find('h2'),
          $frame = $section.find('[class ^= "bg_frame_"]');

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: $section,
          start: 'top bottom',
          end: '+=400', // 트리거 시작 부분에서 400px까지 스크롤 한 후 종료
          // markers: true,
          scrub: .3,
        }
      });
      tl.addLabel('show') 
      .from($h2, {x: -60, opacity: 0}, 'show')
      .from($frame, {opacity: 0}, 'show');
    });
  };
  scrollTrigger2();

  var scrollTrigger3 = function() {
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#issue .txt_area',
        end: '+=300',
        // markers: true,
        scrub: .3
      }
    });
    tl.from('#issue .txt_area', {y: 60, opacity: 0});
  };
  scrollTrigger3();
}

// pageNav 스크롤 스파이 셋팅 함수
function settingPageNav() {
  var $pageNav = $('#mainPageNav'),
      $indicatorMenu = $pageNav.find('.indicator > li > a'),
      $section = $('.main section');

  // 페이지 인디케이터 클릭 이벤트
  $indicatorMenu.on('click', function(e) {
    // console.log(e.target, $(e.target)); // this, $(this)
    showPage(e.target);
    e.preventDefault(); // 중복 방지 // 앵커를 통한 페이지(section#id)로 이동 금지 // URL에 #id가 붙지 않도록 함
  });

  // 페이지 인디케이터 스크롤 이벤트
  checkScrollAmt($section);
  $(window).on('scroll resize', function(e) {
    checkScrollAmt($section);
  });

  // 인디케이터 메뉴 클릭 시, 해당 화면(section#id)으로 이동(부드럽게) 함수
  function showPage(selector) { // e.target
    var target = selector.getAttribute('href'), // section#id
        scrollTop = $(target).offset().top - $('#header').outerHeight();
    // console.log(selector, target, $(target).offset().top, scrollTop);

    // $indicatorMenu.parent().removeClass('on'); // li 초기화
    // $(this).parent().addClass('on'); // 선택한 li.on
    $('html, body').stop(true).animate({'scrollTop': scrollTop + 'px'}, 1000); // 스크롤 부드럽게
  }

  // 요소(section)가 들어설 스크롤 범위 찾는 함수
  function checkScrollAmt($selector) { // $section
    var scrollAmt = $(document).scrollTop();

    $selector.each(function(i) {
      $selector = $(this);
      var triggerHook = $(window).outerHeight() / 2, // viewport에 대해 상대적으로 어느 시점에서 보여줄 건지
          triggerStart = $selector.offset().top - triggerHook,
          triggerEnd = $selector.offset().top + $selector.outerHeight(true) - triggerHook;
      // console.log(scrollAmt + '/' + triggerStart + '/' + triggerEnd);

      // 1025 이상: 메인 컨텐츠 영역에 들어서면, 인디케이터 메뉴 표시되게
      if(triggerStart <= scrollAmt && scrollAmt < triggerEnd && $(window).outerWidth() > 1024) {
        // console.log(i);
        $indicatorMenu.parent().removeClass('on'); // li 초기화
        $indicatorMenu.parent().eq(i).addClass('on');

        if(scrollAmt <= $section.first().outerHeight() - $('#header').outerHeight()) {
          // console.log($selector); // #main_visual
          $pageNav.removeClass('bottom').addClass('top');
        } else if(scrollAmt >= $section.last().offset().top + $section.last().outerHeight() - $(window).outerHeight()) {
          // console.log($selector); // #news
          $pageNav.removeClass('top').addClass('bottom');
        } else {
          $pageNav.removeClass('top bottom');
        }
      }
    });
  }
}

// 슬라이더 셋팅 함수
function settingSlider() {
  initSlick();
  // slick 슬라이더 리사이즈 이벤트  
  $(window).on('resize', function(){
    initSlick();
  });

  function initSlick() {
    var $slider = $('#onAir > ul'),
        num = $slider.find('li').length;

    // 슬라이더 너비 확인
    checkSliderSize();
    $(window).on('resize', function() {
      checkSliderSize();
    });

    // 슬라이더 너비와 뷰포트 너비에 따른 슬라이더 생성 유무 함수
    function checkSliderSize() {
      var sliderWidth = 0;

      sliderWidth = $slider.find('li').eq(1).outerWidth(true) * num;
      $slider.css({'max-width': sliderWidth + 'px'});
      // console.log(num, $slider.find('li').length, $slider.find('li').eq(1).outerWidth(true), sliderWidth, $slider.outerWidth(), $(window).innerWidth());

      if($(window).innerWidth() <= sliderWidth) { // 뷰포트 너비 <= 슬라이더 너비
        $slider.not('.slick-initialized').slick({ // 슬라이더 생성
          arrows: true,
          dots: false,
          infinite: true,
          // slidesToShow: 3,
          swipeToSlide: true,
          centerMode: true,
          variableWidth: true,
          appendArrows: $('#onAir .control'),
        });
      } else {
        $slider.filter('.slick-initialized').slick('unslick').find('li, a').removeAttr('tabindex role id aria-describedby aria-hidden');
      }
    }
  }

}
