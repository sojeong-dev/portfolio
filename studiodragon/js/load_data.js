$(function() {
  'use strict';
  console.log('data load');

  //전역변수
  var $tabMenu = $('.tab_menulist > li > a'),
      $tabCont = $('.portfolio ul.tab_conlist'),
      completeData = [];  //json데이터 담는 변수

  var $currentTabMenu = $('.tab_menulist > li.on > a'); //현재 선택되어 있는 메뉴 == '전체'
  loadDataFn();  //json파일을 받아오는 함수

  $tabMenu.on('click', function() {
    // console.log($(this).text())
    $currentTabMenu = $(this);
    $tabCont.empty();  //누적되지 않게 초기화
    $tabCont.next().remove(); //더보기 버튼 초기화
    loadDataFn(); //함수 호출
  });

  function loadDataFn() {
    $.ajax({
      url: '/js/data.json',
      dataType: 'json',
      success: function(result) { //json파일 담김
        // console.log(result);
        completeData = result.portfolio;

        init(); //데이터 셋팅(초기화)
        settingBtnMoreFn();  //더보기 버튼 셋팅
      }
    })
  };

  //더보기 버튼 누르면, 6개씩 추가되게 셋팅 함수
  function settingBtnMoreFn() {
    var $contAll = $tabCont.children(),
        n = 6,  //default
        add = 6;

    if($tabCont.children().length >= n) {
      $tabCont.after('<a href="#" class="btn_more db">More</a>'); //더보기 버튼 추가
      $tabCont.children().eq(n - 1).nextAll().remove();  //최대 6개 출력(default)
    }
    
    //더보기 버튼 누르면 나머지 추가되게
    $tabCont.next().on('click', function() {
      for(var i = n; i < n + add; i++) {
        $tabCont.append($contAll.eq(i));
      }
      n += add;

      if($contAll.length <= n) //컨텐츠 다 나오면 
        $tabCont.next().remove(); //더보기 버튼 삭제
    });
  }
  
  //데이터 셋팅(초기화) 함수
  function init() {
    // console.log(completeData.length);
    $.each(completeData, function() {
      // //파싱 작업
      // var $workLi = $('<li class="dib pr oh"></li>'),
      //     $workA = $('<a href="#" class="db"></a>'),
      //     $badge = $('<span class="badge_onair pa">ON-AIR</span>'),
      //     $imgArea =  $('<div class="img_area pr"></div>'),
      //     $img = $('<img src="' + item.img + '" alt="' + item.tit + ' 포스터" />'),
      //     $detail = $('<div class="detail pa"></div>'),
      //     $detailInner = $('<span class="txt_tit db">' + item.tit + '</span>' 
      //                   + '<ul>'
      //                     + '<li><strong class="txt_name">연출</strong><span>' + item.director + '</span></li>'
      //                     + '<li><strong class="txt_name">극본</strong><span>' + item.writer + '</span></li>'
      //                     + '<li><strong class="txt_name">출연</strong><span>' + item.mainCast + '</span></li>'
      //                   + '</ul>'),
      //     $workTit = $('<p class="txt_tit">' + item.tit + '</p>');                  

      // //html 추가
      // $('.portfolio .tab_conlist').append($workLi); 
      // $workLi.append($workA);
      // if(item.state === '방영') $workA.append($badge);
      // $workA.append($imgArea);
      // $imgArea.append($img);
      // $imgArea.append($detail);
      // $detail.append($detailInner);
      // $workA.append($workTit);

      //파싱 작업
      var innerHTML = '\n';
          innerHTML += '<li class="dib pr oh">\n';
          innerHTML += '  <a href="#" class="db">\n';

        if(this.state === '방영')
          innerHTML += '    <span class="badge_onair pa">ON-AIR</span>\n';
          
          innerHTML += '    <div class="img_area pr">\n';
          innerHTML += '      <img src="' + this.img + '" alt="' + this.tit + ' 포스터" />\n';
          innerHTML += '      <div class="detail pa">\n';
          innerHTML += '        <span class="txt_tit db">' + this.tit + '</span>\n';
          innerHTML += '        <ul>\n';
          innerHTML += '          <li><strong class="txt_name">연출</strong><span>' + this.director + '</span></li>\n';
          innerHTML += '          <li><strong class="txt_name">극본</strong><span>' + this.writer + '</span>\n';
          innerHTML += '          <li><strong class="txt_name">출연</strong><span>' + this.mainCast + '</span></li>\n';
          innerHTML += '        </ul>\n';
          innerHTML += '      </div>\n';
          innerHTML += '    </div>\n';
          innerHTML += '    <p class="txt_tit">' + this.tit + '</p>\n';
          innerHTML += '  </a>\n';
          innerHTML += '</li>\n';

      //html 추가
      // console.log($currentTabMenu.text());
      // console.log($('.tab_menulist > li.on > a').text());
      if($currentTabMenu.text() === this.state || $currentTabMenu.text() === '전체') {
        $tabCont.append(innerHTML);
      }
    });//each()

    // console.log($tabCont.children().length);
    if($tabCont.children().length === 0) {
      $tabCont.append('<li class="data_no">등록된 내용이 없습니다.</li>');
    }
  }
});