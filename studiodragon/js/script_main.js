
$(function() {
  'use strict';
  
  //스크롤 스파이 셋팅
  showIndicatorContFn();
  scrollFn();

  $(window).on('scroll resize', function() {
    scrollFn();
  });

  //스크롤 셋팅 함수
  function scrollFn() {
    //페이지 인디케이터 스크롤 이벤트
    checkScrollAmtFn($('section'));
  }

  //section: 페이지 인디케이터 요소가 들어설 스크롤 범위(amount) 찾는 함수
  function checkScrollAmtFn($selector) {  //section
    var $indicatorMenu = $('#pageNav > ul.indicator > li'),
        scrollAmt = $(document).scrollTop();

    $indicatorMenu.removeClass('on'); //초기화

    $selector.each(function(i) {
      $selector = $(this);
      var triggerHook = $(window).outerHeight() / 2,
          triggerStart = $selector.offset().top - triggerHook,
          triggerEnd = $selector.offset().top + $selector.outerHeight(true) - triggerHook;
      // console.log(scrollAmt + '/' + triggerStart + '/' + triggerEnd);

      if(triggerStart <= scrollAmt && scrollAmt < triggerEnd && $(window).outerWidth() > 1024) {
        $indicatorMenu.eq(i).addClass('on');

        if($selector.attr('id') === 'news') {
          $('#pageNav').addClass('bottom');
        } else {
          $('#pageNav').removeClass('bottom');
        }
      }
    });
  }

  //ul.indicator: 인디케이터 메뉴 클릭 시, 해당 화면으로 이동시키는 함수
  function showIndicatorContFn() {
    var $indicatorMenu = $('#pageNav > ul.indicator > li > a');

    $indicatorMenu.on('click', function() {
      var contID = $(this).attr('href'),
          contOffsetTop = $(contID).offset().top - $('#header').outerHeight();

      $indicatorMenu.parent().removeClass('on');  //초기화
      $(this).parent().addClass('on');
      //*animate() 사용할 때, 항상 먼저 stop() 넣어줘야 > 부화가 걸릴 수 있으므로 정확히 stop(true) 넣어줘야
      $('html, body').stop(true).animate({'scrollTop': contOffsetTop + 'px'}, 1000);
    });
  }
});

