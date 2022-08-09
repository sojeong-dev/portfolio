// load data JS
$(function() {
  'use stirct';
  console.log('data load complete');

  // 전역 변수
  var $tabMenu = $('.tab_list > li > a'),
      $tabCont = $('.tab_cont'),
      $tit = $tabCont.find('h3'),
      $list = $tabCont.find('ul'),
      $currentTabMenu = $('.tab_list > li.on > a'); // 현재 선택 되어 있는 탭 메뉴 // li.on == 전체
      completeData = []; // json 데이터 담는 수

  loadDataFn();

  // 탭 메뉴 버튼 클릭 이벤트
  $tabMenu.on('click', function() {
    $currentTabMenu = $(this);
    $tit.text($currentTabMenu.text()); // h3
    $list.empty(); // 누적되지 않게 초기화
    $list.next().remove(); //더보기 버튼 초기화
    loadDataFn(); // 함수 호출
  });

  // Ajax를 이용하여 json데이터 파싱, 사용 함수
  function loadDataFn() {
    $.ajax({
      url: '/js/data.json', // 서버측 경로
      dataType: 'json', // json 명시
      success: function(result) {
        // console.log(result); // json파일이 담김 // {portfolio: Array(17)}
        completeData = result.portfolio; // 배열 담음
        // console.log(completeData);

        init(); // 데이터 셋팅(초기화)
        settingAddMore($list, $list.children(), 6); // 더보기 버튼 셋팅
      }
    });
  }

  // 데이터 셋팅(초기화) 함수
  function init() {
    // console.log(completeData.length);  // 17

    // 최신 등록순 정렬 // 날짜별 내림차순 정렬
    completeData.sort(function(a, b) {
      a = a.date.replace(/\-/g,''),
      b = b.date.replace(/\-/g,'');
      return b - a;
    });
    // console.log(completeData);

    $.each(completeData, function() {
      // 파싱 작업: 필요한 데이터 뽑아냄
      var innerHTML = '\n';
          innerHTML += '<li>\n';
          innerHTML += '  <a href="#">\n';
        if(this.state.indexOf('방영') !== -1 && this.state.indexOf('예정') === -1) {
          innerHTML += '    <span class="badge_onair">ON-AIR</span>\n';
        }
          innerHTML += '    <div class="img_box">\n';
          innerHTML += '      <img src="' + this.img + '" alt="' + this.tit + '포스터 이미지" />\n';
          innerHTML += '      <div class="detail">\n';
          innerHTML += '        <span class="detail_tit"> ' + this.tit + ' </span>\n';
          innerHTML += '        <ul>\n';
          innerHTML += '          <li><em>연출</em><span>' + this.director + '</span></li>\n';
          innerHTML += '          <li><em>극본</em><span>' + this.writer + '</span></li>\n';
          innerHTML += '          <li><em>출연</em><span>' + this.mainCast + '</span></li>\n';
          innerHTML += '        </ul>\n';
          innerHTML += '      </div>\n';
          innerHTML += '    </div>\n';
          innerHTML += '    <strong class="tit">' + this.tit + '</strong>\n';
          innerHTML += '  </a>\n';
          innerHTML += '</li>\n';

      // html 추가
      // console.log($currentTabMenu.text() === this.state)
      // console.log(this.state.includes($currentTabMenu.text()))
      if(this.state.indexOf($currentTabMenu.text()) != -1 || $currentTabMenu.text() === '전체') {
        $list.append(innerHTML);
      }
    });
    // console.log($list.children().length, completeData.length);
    if($list.children().length === 0) 
      $list.append('<li class="data_no">등록된 내용이 없습니다.</li>');
  }
});