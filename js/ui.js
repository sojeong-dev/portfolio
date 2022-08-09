// JS
'use strict';
var mobile = 768; // 전역 변수
$(function() {
  preventDefaultA();
  initFullPage();
  // checkVisbility();

  // page 버튼 클릭 이벤트(토글)
  $('.page .btn').on('click', function() {
    $(this).toggleClass('on');
  });

  // 텍스트 애니메이션 순서대로 나오게
  $('#intro [data-clone]').each(function(i) {
    // $(this).not($('.name > span')).css({'animation-delay': (1 + (i * 0.1)) + 's'});
  }); 

});

// 요소가 보이는 범위 찾는 함수
function checkVisbility() {
  var $section = $('[class *= "portfolio"]');
  // console.log($section);

  checkScrollAmt($section);
  // 컨텐츠 스크롤 이벤트
  $(window).on('scroll resize', function() {
    checkScrollAmt($section);
  });

  // 요소가 들어설 스크롤 범위 찾는 함수
  function checkScrollAmt($selector) { // $section
    var scrollAmt = $(document).scrollTop();
    $selector.removeClass('show'); // 초기화

    $selector.each(function(i) {
      $selector = $(this);
      var triggerHook = $(window).outerHeight() / 2, // viewport에 대해 상대적으로 어느 시점에서 보여줄 건지
          triggerStart = $selector.offset().top - triggerHook,
          triggerEnd = $selector.offset().top + $selector.outerHeight(true) - triggerHook;
      // console.log(scrollAmt + '/' + triggerStart + '/' + triggerEnd);

      if(triggerStart <= scrollAmt && scrollAmt < triggerEnd) $selector.addClass('active');
    });
  }
}

// fullPage.js 사용 함수
function initFullPage() {
  $('#fullPage').fullpage({
    navigation: true,
    // anchors: ['firstPage', 'secondPage', '3rdPage', '4thPage', '5thPage'],
    navigationPosition: 'right',
    navigationTooltips: ['intro', 'portfolio 1', 'portfolio 2', 'portfolio 3','contact'],
	});
}

// <a href="#"> 링크 기본 동작 비활성화 함수
function preventDefaultA() {
  $(document).on('click', 'a[href="#"]', function(e) { // 이벤트 위임
    e.preventDefault();
  });
}